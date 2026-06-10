<?php
/**
 * Endpoint de prise de rendez-vous — envoie un email via Resend.
 * POST /api/booking.php
 * Body JSON : { date, hour, name, email, phone, _t, _hp }
 */

// === Configuration ===
$RESEND_API_KEY = 're_GduWTUz8_6PTdHNstkrEuam9FYJv3AWem';
$TO_EMAIL       = 'cabinet@drchardon.fr';
$FROM_EMAIL     = 'rdv@drchardon.fr'; // Domaine vérifié dans Resend

// === Headers ===
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Méthode non autorisée']);
    exit;
}

// === Lire le body JSON ===
$raw = file_get_contents('php://input');
$body = json_decode($raw, true);

if (!$body) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'JSON invalide']);
    exit;
}

// === Anti-spam : honeypot ===
$honeypot = trim($body['_hp'] ?? '');
if ($honeypot !== '') {
    // Bot détecté — on renvoie un faux succès pour ne pas alerter
    echo json_encode(['ok' => true]);
    exit;
}

// === Anti-spam : timestamp (minimum 3 secondes pour remplir) ===
$timestamp = intval($body['_t'] ?? 0);
if ($timestamp > 0 && (time() - $timestamp) < 3) {
    echo json_encode(['ok' => true]);
    exit;
}

// === Anti-spam : rate limiting par IP (1 requête / 30s) ===
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitFile = sys_get_temp_dir() . '/booking_' . md5($ip) . '.lock';
if (file_exists($rateLimitFile) && (time() - filemtime($rateLimitFile)) < 30) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'Veuillez patienter avant de renvoyer une demande.']);
    exit;
}
touch($rateLimitFile);

// === Valider les champs ===
$date  = trim($body['date']  ?? '');
$hour  = trim($body['hour']  ?? '');
$name  = trim($body['name']  ?? '');
$email = trim($body['email'] ?? '');
$phone = trim($body['phone'] ?? '');

if ($date === '' || $hour === '' || $name === '' || $email === '' || $phone === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Tous les champs sont requis']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Adresse email invalide']);
    exit;
}

// === Formater la date ===
$dateObj = DateTime::createFromFormat('Y-m-d', $date);
$mois = [
    1 => 'janvier', 2 => 'février', 3 => 'mars', 4 => 'avril',
    5 => 'mai', 6 => 'juin', 7 => 'juillet', 8 => 'août',
    9 => 'septembre', 10 => 'octobre', 11 => 'novembre', 12 => 'décembre'
];
if ($dateObj) {
    $dateFormatted = $dateObj->format('j') . ' ' . $mois[(int)$dateObj->format('n')] . ' ' . $dateObj->format('Y');
} else {
    $dateFormatted = htmlspecialchars($date);
}

$nameEsc  = htmlspecialchars($name);
$emailEsc = htmlspecialchars($email);
$phoneEsc = htmlspecialchars($phone);
$hourEsc  = htmlspecialchars($hour);

// === Fonction d'envoi via Resend ===
function sendResend($apiKey, $from, $to, $subject, $html) {
    $payload = json_encode([
        'from'    => $from,
        'to'     => is_array($to) ? $to : [$to],
        'subject' => $subject,
        'html'    => $html,
    ]);

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey,
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    return ['response' => $response, 'httpCode' => $httpCode, 'error' => $curlError];
}

// === Email 1 : notification au cabinet ===
$htmlCabinet = <<<HTML
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
  <h2 style="color: #ff5149; margin-bottom: 24px;">Nouvelle demande de rendez-vous</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600; width: 120px;">Patient</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #eee;">{$nameEsc}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">Email</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:{$emailEsc}" style="color: #ff5149;">{$emailEsc}</a></td>
    </tr>
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">Téléphone</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="tel:{$phoneEsc}" style="color: #ff5149;">{$phoneEsc}</a></td>
    </tr>
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">Date</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #eee;">{$dateFormatted}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; font-weight: 600;">Heure</td>
      <td style="padding: 10px 0;">{$hourEsc}</td>
    </tr>
  </table>
  <p style="margin-top: 24px; font-size: 13px; color: #888;">Envoyé depuis le formulaire drchardon.fr</p>
</div>
HTML;

$result1 = sendResend(
    $RESEND_API_KEY,
    'Dr Chardon — RDV <' . $FROM_EMAIL . '>',
    $TO_EMAIL,
    'RDV — ' . $nameEsc . ' — ' . $dateFormatted . ' à ' . $hourEsc,
    $htmlCabinet
);

if ($result1['error']) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Erreur réseau']);
    exit;
}

if ($result1['httpCode'] < 200 || $result1['httpCode'] >= 300) {
    http_response_code(502);
    $resendBody = json_decode($result1['response'], true);
    $msg = $resendBody['message'] ?? 'Erreur Resend (HTTP ' . $result1['httpCode'] . ')';
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}

// === Email 2 : confirmation au patient ===
$htmlPatient = <<<HTML
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
  <h2 style="color: #ff5149; margin-bottom: 8px;">Demande de rendez-vous reçue</h2>
  <p style="color: #555; margin-bottom: 24px;">Bonjour {$nameEsc},</p>
  <p style="color: #333; line-height: 1.7;">
    Nous avons bien reçu votre demande de rendez-vous pour le <strong>{$dateFormatted}</strong> à <strong>{$hourEsc}</strong>.
  </p>
  <p style="color: #333; line-height: 1.7; margin-top: 16px;">
    Notre équipe fera de son mieux pour vous répondre <strong>sous 48h</strong>. Nous vous contacterons par téléphone ou par email pour confirmer votre créneau.
  </p>
  <div style="margin-top: 32px; padding: 20px; background: #f9f9f9; border-radius: 12px;">
    <p style="font-size: 14px; color: #555; margin: 0;">
      <strong>Cabinet Dr Sarah Chardon</strong><br>
      Chirurgien-dentiste — Exercice limité à l'orthodontie<br>
      Colombes (92)
    </p>
  </div>
  <p style="margin-top: 24px; font-size: 12px; color: #aaa;">Ceci est un email automatique, merci de ne pas y répondre.</p>
</div>
HTML;

// Envoi en best-effort (on ne bloque pas si ça échoue)
sendResend(
    $RESEND_API_KEY,
    'Cabinet Dr Chardon <' . $FROM_EMAIL . '>',
    $email,
    'Votre demande de rendez-vous — Dr Chardon',
    $htmlPatient
);

echo json_encode(['ok' => true]);
