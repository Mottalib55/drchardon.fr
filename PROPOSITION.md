# Dr Chardon - Proposition de Site Web Premium

## Concept Directeur

**Positionnement :** Un site "boutique de luxe" pour l'orthodontie, pas un site de cabinet dentaire lambda. L'inspiration vient des codes visuels des maisons de luxe (Aesop, Byredo, Le Labo) appliques au medical : sobriete, materiaux nobles, typographies elegantes, espace genereux.

**Philosophie :** Le site doit communiquer en 3 secondes : "Ce n'est pas un dentiste comme les autres. C'est une specialiste qui a choisi de se consacrer exclusivement a l'art de l'alignement."

---

## Direction Artistique

### Palette de couleurs
```
Fond principal     : #FAF8F5 (creme chaud, "Warm Ivory")
Fond secondaire    : #1A1A2E (bleu nuit profond, "Midnight")
Accent principal   : #C4A882 (or rose mat, "Champagne Gold")
Accent secondaire  : #8B7355 (bronze chaud, "Warm Bronze")
Texte principal    : #2D2D2D (charbon doux)
Texte secondaire   : #6B6B6B (gris elegant)
```

**Pourquoi :** On s'eloigne radicalement du bleu clinique/blanc sterilise habituel des sites dentaires. Les tons chauds communiquent : confiance, expertise, bien-etre, haut de gamme.

### Typographie
- **Titres :** Cormorant Garamond (serif elegant) - communique le prestige et la tradition medicale
- **Sous-titres :** DM Sans Medium (sans-serif moderne) - equilibre modernite/lisibilite
- **Corps de texte :** DM Sans Regular - lecture optimale sur tous ecrans
- **Accents/citations :** Cormorant Garamond Italic - pour les temoignages patients

### Style visuel
- **Photographies :** Tons chauds, lumiere naturelle douce, profondeur de champ faible (style editorial)
- **Formes :** Courbes organiques, bords arrondis, pas d'angles vifs
- **Effets :** Glassmorphism subtil pour les cartes, micro-animations au scroll, parallaxe legere
- **White space :** Genereux - chaque element respire

---

## Architecture du Site (Single Page Application scrollable + pages dedicees)

### SECTION 1 : Hero Cinematique
- Video en fond (ou image animee subtile) du sourire en gros plan, lumiere chaude
- Titre : "L'art de l'alignement" en Cormorant Garamond, grande taille
- Sous-titre : "Dr Chardon - Chirurgien-dentiste specialisee en orthodontie"
- CTA unique elegant : "Prendre rendez-vous" (bouton avec micro-animation au hover)
- Scroll indicator anime (fleche subtile)

### SECTION 2 : Philosophie / Approche
- Layout asymetrique : grande image a gauche (portrait Dr Chardon), texte a droite
- Titre : "Une approche dediee"
- Texte : Expliquer pourquoi une chirurgien-dentiste qui fait EXCLUSIVEMENT de l'ortho apporte une vision plus complete (connaissance de l'ensemble de la sphere buccale, pas uniquement les dents)
- Chiffres cles animes (apparition au scroll) : annees d'experience, patients traites, heures de formation

### SECTION 3 : Dr Chardon - Parcours & Expertise
- Design type "editorial magazine"
- Photo portrait professionnelle grand format
- **Parcours :**
  - Chirurgien-dentiste diplomee
  - DIU d'Orthopedie Dento-Cranio-Maxillo-Faciale
    - Hopital Pitie-Salpetriere, Paris
    - Sorbonne Universite
    - Formation de 3 ans, 2 480 heures
    - 250h theoriques + 1 250h pratiques + stages cliniques
  - Pratique exclusive de l'orthodontie
- Timeline visuelle elegante du parcours
- Citation personnelle en italic

### SECTION 4 : Traitements & Services
Cards en glassmorphism avec icones custom (pas de clipart) :

1. **Bagues ceramiques** - Discretion et efficacite
2. **Aligneurs invisibles (type Invisalign)** - L'orthodontie invisible
3. **Orthodontie linguale** - Les bagues cachees derriere les dents
4. **Orthodontie de l'enfant** - Interception precoce
5. **Orthodontie de l'adolescent** - Accompagnement personnalise
6. **Orthodontie de l'adulte** - Il n'est jamais trop tard

Chaque carte : hover avec expansion, reveal de details, micro-animation.
Clic => section detaillee avec explication, avantages, cas types.

### SECTION 5 : Resultats (Before/After)
- Galerie interactive avec slider avant/apres
- Slider drag elegant (pas le classique cheap)
- Filtrable par type de traitement
- Temoignage patient associe a chaque cas

### SECTION 6 : Le Cabinet
- Carousel immersif des photos du cabinet
- Effet parallaxe sur les images
- Mise en avant de l'equipement high-tech
- Ambiance spa/bien-etre, pas "clinique"

### SECTION 7 : Parcours Patient
Timeline horizontale interactive :
1. Premier contact
2. Consultation & diagnostic
3. Plan de traitement personnalise
4. Debut du traitement
5. Suivi regulier
6. Resultat & contention

Chaque etape avec icone animee et description courte.

### SECTION 8 : Temoignages
- Design type "magazine quote"
- Grandes guillemets decoratives
- Carrousel de temoignages avec photos (si autorises)
- Note Google integree

### SECTION 9 : Contact & Rendez-vous
- Layout split : formulaire elegant a gauche, carte interactive a droite
- Integration Doctolib ou systeme de RDV
- Informations pratiques (adresse, telephone, horaires)
- Plan d'acces Google Maps en mode sombre (custom styled)

### Footer
- Design minimaliste, fond Midnight
- Logo, mentions legales, liens reseaux sociaux
- "Dr Chardon - Chirurgien-dentiste"

---

## Specifications Techniques

### Stack technologique
- **HTML5 / CSS3 / JavaScript** pur (pas de framework lourd)
- **GSAP** (GreenSock) pour les animations premium
- **ScrollTrigger** pour les animations au defilement
- **Swiper.js** pour les carousels
- **CSS custom properties** pour le theming
- **Google Fonts** (Cormorant Garamond + DM Sans)

### Performance
- Score Lighthouse vise : 95+
- Lazy loading des images
- Compression WebP/AVIF
- Chargement differe des scripts non-critiques
- Pas de jQuery, pas de Bootstrap (code sur-mesure)

### SEO
- Balisage Schema.org (Dentist, MedicalBusiness)
- Meta tags optimises pour "orthodontie [ville]", "chirurgien-dentiste orthodontie"
- Sitemap XML
- Optimisation Core Web Vitals

### Responsive
- Mobile-first
- Breakpoints : 375px, 768px, 1024px, 1440px, 1920px
- Menu hamburger anime sur mobile
- Touch-friendly sur tous les elements interactifs

---

## Ce qui differencie ce site des sites "cheap IA"

| Site generique               | Dr Chardon                                      |
|------------------------------|--------------------------------------------------|
| Template Bootstrap/WordPress | Code sur-mesure, zero template                   |
| Bleu clinique + blanc        | Palette chaude, or rose, bleu nuit                |
| Stock photos generiques      | Direction artistique editoriale                   |
| Animations basiques ou zero  | GSAP + ScrollTrigger, micro-interactions soignees |
| Typographie sans personnalite| Cormorant Garamond serif + DM Sans               |
| Contenu plat                 | Storytelling, parcours narratif                   |
| Formulaire basique           | Experience immersive, parcours patient interactif |
| Performance mediocre         | Lighthouse 95+, Core Web Vitals optimises         |

---

## Inspirations directes

- **Beehive Dental** (beehivedental.com) : palette chaude, photographie editoriale
- **Tend** (hellotend.com) : branding fort, video immersive, approche "boutique"
- **Grind Dentistry** : typographie bold, espace genereux, sentiment "studio"
- **Winchester House Dental** : palette navy + or, luxe assume
- **Aesop** (aesop.com) : pour l'elegance minimaliste et les tons chauds (hors dental)
