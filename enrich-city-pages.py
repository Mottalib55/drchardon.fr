#!/usr/bin/env python3
"""
Enrich drchardon.fr city pages with unique content to improve SEO uniqueness.
Adds: city context paragraph, highlighted treatment, FAQs with schema.
"""

import os
import re
import json

SITE_DIR = os.path.dirname(os.path.abspath(__file__))
ORTHO_DIR = os.path.join(SITE_DIR, "orthodontie-proche")

# Zone pages to skip (not individual cities)
ZONE_PAGES = {
    "index", "boucle-de-seine",
    "hauts-de-seine-centre-sud", "hauts-de-seine-nord",
    "paris-centre-est", "paris-ouest",
    "seine-saint-denis-est", "seine-saint-denis-ouest",
    "val-d-oise-centre", "val-d-oise-sud",
    "yvelines-centre", "yvelines-est",
}

# ─── City data ────────────────────────────────────────────────────────────────
# Each city: (display_name, dept, population_approx, distance_km, transport_summary, notable_fact)
CITIES = {
    "acheres": ("Achères", "78", 22000, 25, "RER A jusqu'à Poissy puis correspondance", "ville verte des Yvelines, proche de la forêt de Saint-Germain"),
    "argenteuil": ("Argenteuil", "95", 115000, 5, "Transilien J et H", "deuxième ville du Val-d'Oise par sa population"),
    "asnieres-sur-seine": ("Asnières-sur-Seine", "92", 88000, 4, "métro ligne 13 et Transilien L", "ville résidentielle prisée des familles avec de nombreuses écoles"),
    "aubervilliers": ("Aubervilliers", "93", 89000, 12, "métro ligne 7 et 12", "en pleine transformation urbaine avec l'arrivée du Grand Paris Express"),
    "beauchamp": ("Beauchamp", "95", 9000, 18, "Transilien H", "commune paisible du Val-d'Oise, idéale pour les familles"),
    "bezons": ("Bezons", "95", 31000, 3, "tramway T2 et bus", "juste de l'autre côté de la Seine depuis Colombes"),
    "bobigny": ("Bobigny", "93", 54000, 15, "métro ligne 5 et tramway T1", "préfecture de Seine-Saint-Denis avec un pôle de santé important"),
    "bois-colombes": ("Bois-Colombes", "92", 29000, 2, "Transilien L", "commune limitrophe de Colombes, à quelques minutes à pied"),
    "bondy": ("Bondy", "93", 54000, 18, "RER E et tramway T4", "ville dynamique de Seine-Saint-Denis desservie par le RER E"),
    "bougival": ("Bougival", "78", 9000, 12, "bus RATP et voiture via A13", "village impressionniste au bord de la Seine"),
    "boulogne-billancourt": ("Boulogne-Billancourt", "92", 121000, 10, "métro lignes 9 et 10", "commune la plus peuplée des Hauts-de-Seine avec une forte demande en soins dentaires"),
    "carrieres-sur-seine": ("Carrières-sur-Seine", "78", 16000, 8, "RER A station Houilles", "commune résidentielle entre Chatou et Houilles"),
    "chatou": ("Chatou", "78", 32000, 8, "RER A", "ville des impressionnistes au bord de la Seine"),
    "chaville": ("Chaville", "92", 21000, 14, "Transilien N et L", "aux portes de la forêt de Meudon, entre Versailles et Paris"),
    "clamart": ("Clamart", "92", 53000, 15, "tramway T6 et bus", "ville verdoyante du sud des Hauts-de-Seine"),
    "clichy": ("Clichy", "92", 63000, 5, "métro ligne 13", "commune dense et bien desservie, limitrophe de Paris"),
    "conflans-sainte-honorine": ("Conflans-Sainte-Honorine", "78", 36000, 22, "Transilien J et L", "capitale de la batellerie au confluent de la Seine et de l'Oise"),
    "cormeilles-en-parisis": ("Cormeilles-en-Parisis", "95", 25000, 8, "Transilien J", "sur les hauteurs du Val-d'Oise, dominant la vallée de la Seine"),
    "courbevoie": ("Courbevoie", "92", 82000, 5, "Transilien L et métro via La Défense", "ville dynamique entre Colombes et La Défense"),
    "croissy-sur-seine": ("Croissy-sur-Seine", "78", 10000, 10, "bus depuis Le Vésinet-Le Pecq (RER A)", "village résidentiel calme en boucle de Seine"),
    "deuil-la-barre": ("Deuil-la-Barre", "95", 22000, 14, "Transilien H depuis Gare du Nord", "commune vallonnée du Val-d'Oise, entre Enghien et Montmorency"),
    "drancy": ("Drancy", "93", 72000, 15, "RER B et tramway T1", "ville importante de Seine-Saint-Denis avec de nombreuses familles"),
    "dugny": ("Dugny", "93", 11000, 16, "tramway T5 et bus", "petite commune proche du Bourget et du futur village olympique"),
    "eaubonne": ("Eaubonne", "95", 25000, 15, "Transilien H", "au cœur du Val-d'Oise, entre Ermont et Montmorency"),
    "enghien-les-bains": ("Enghien-les-Bains", "95", 12000, 10, "Transilien H (15 min depuis Gare du Nord)", "station thermale réputée au bord du lac"),
    "epinay-sur-seine": ("Épinay-sur-Seine", "93", 55000, 7, "Transilien H et tramway T8", "au carrefour de trois départements"),
    "ermont": ("Ermont", "95", 29000, 12, "Transilien H et C", "nœud ferroviaire du Val-d'Oise avec la gare d'Ermont-Eaubonne"),
    "fourqueux": ("Fourqueux", "78", 4500, 20, "bus depuis Saint-Germain-en-Laye", "petit village résidentiel en lisière de la forêt de Marly"),
    "franconville": ("Franconville", "95", 36000, 14, "Transilien C et H", "ville familiale du Val-d'Oise avec un important tissu associatif"),
    "garches": ("Garches", "92", 19000, 10, "Transilien L (gare de Garches-Marnes-la-Coquette)", "commune résidentielle connue pour l'hôpital Raymond-Poincaré"),
    "gennevilliers": ("Gennevilliers", "92", 48000, 4, "métro ligne 13 et tramway T1", "commune voisine de Colombes, accèssible rapidement"),
    "groslay": ("Groslay", "95", 9000, 16, "Transilien H", "petit bourg du Val-d'Oise dans la vallée de Montmorency"),
    "herblay-sur-seine": ("Herblay-sur-Seine", "95", 31000, 12, "Transilien J", "sur les rives de la Seine dans le Val-d'Oise"),
    "houilles": ("Houilles", "78", 33000, 5, "Transilien L et J", "entre Colombes et Sartrouville, très bien desservie"),
    "issy-les-moulineaux": ("Issy-les-Moulineaux", "92", 70000, 12, "métro ligne 12 et tramway T2", "ville high-tech au sud de Paris, proche de la Porte de Versailles"),
    "l-etang-la-ville": ("L'Étang-la-Ville", "78", 5000, 18, "bus depuis Saint-Germain-en-Laye", "village en forêt de Marly, à mi-chemin entre Saint-Germain et Versailles"),
    "l-ile-saint-denis": ("L'Île-Saint-Denis", "93", 8000, 7, "bus et tramway T1 proche", "île de la Seine entre Saint-Denis et Villeneuve-la-Garenne"),
    "la-celle-saint-cloud": ("La Celle-Saint-Cloud", "78", 22000, 14, "Transilien L et bus", "commune résidentielle verdoyante des Yvelines"),
    "la-courneuve": ("La Courneuve", "93", 44000, 14, "métro ligne 7 et tramway T1", "en plein renouveau urbain avec le Grand Paris Express"),
    "la-garenne-colombes": ("La Garenne-Colombes", "92", 30000, 2, "Transilien L", "commune limitrophe de Colombes, à quelques minutes du cabinet"),
    "le-blanc-mesnil": ("Le Blanc-Mesnil", "93", 57000, 17, "RER B", "ville familiale de Seine-Saint-Denis proche de l'aéroport"),
    "le-bourget": ("Le Bourget", "93", 16000, 16, "RER B et tramway T11", "célèbre pour son musée de l'Air et de l'Espace"),
    "le-pecq": ("Le Pecq", "78", 17000, 12, "RER A", "au pied de la terrasse de Saint-Germain-en-Laye"),
    "le-port-marly": ("Le Port-Marly", "78", 5000, 14, "bus depuis Saint-Germain-en-Laye", "petit port historique sur la Seine entre Marly et Le Pecq"),
    "le-vesinet": ("Le Vésinet", "78", 16000, 10, "RER A", "ville-parc résidentielle connue pour ses lacs et pelouses"),
    "levallois-perret": ("Levallois-Perret", "92", 66000, 6, "métro ligne 3 et bus", "commune dense entre Neuilly et Clichy"),
    "louveciennes": ("Louveciennes", "78", 7500, 14, "bus depuis Bougival ou Marly-le-Roi", "village historique perché au-dessus de la vallée de la Seine"),
    "maisons-laffitte": ("Maisons-Laffitte", "78", 24000, 12, "RER A", "cité du cheval, entre la Seine et la forêt de Saint-Germain"),
    "mareil-marly": ("Mareil-Marly", "78", 3500, 17, "bus depuis Saint-Germain-en-Laye", "village rural des Yvelines, calme et résidentiel"),
    "marly-le-roi": ("Marly-le-Roi", "78", 17000, 15, "Transilien L depuis Saint-Cloud", "ancienne résidence royale dans un cadre verdoyant"),
    "marnes-la-coquette": ("Marnes-la-Coquette", "92", 1700, 12, "bus depuis Garches", "plus petite commune des Hauts-de-Seine, en bordure de la forêt de Fausses-Reposes"),
    "meudon": ("Meudon", "92", 46000, 13, "RER C et Transilien N", "ville sur les coteaux de la Seine, connue pour son observatoire"),
    "montesson": ("Montesson", "78", 16000, 8, "bus depuis Le Vésinet (RER A)", "commune maraîchère de la boucle de Seine"),
    "montigny-les-cormeilles": ("Montigny-lès-Cormeilles", "95", 22000, 10, "Transilien J", "sur les coteaux du Val-d'Oise, proche de Cormeilles-en-Parisis"),
    "montmagny": ("Montmagny", "95", 15000, 14, "Transilien H", "commune du Val-d'Oise entre Deuil-la-Barre et Groslay"),
    "montmorency": ("Montmorency", "95", 22000, 14, "tramway T5 et Transilien H", "cité historique dans la vallée qui porte son nom"),
    "nanterre": ("Nanterre", "92", 95000, 7, "RER A et Transilien L via La Défense", "préfecture des Hauts-de-Seine, pôle universitaire et économique"),
    "neuilly-sur-seine": ("Neuilly-sur-Seine", "92", 62000, 7, "métro ligne 1 et bus", "commune résidentielle huppée aux portes de Paris"),
    "pantin": ("Pantin", "93", 58000, 13, "métro ligne 5 et RER E", "ville créative de Seine-Saint-Denis en plein essor"),
    "paris-10e": ("Paris 10e", "75", 90000, 12, "métro lignes 4, 5, 7 et Gare du Nord/Est", "arrondissement cosmopolite autour des gares du Nord et de l'Est"),
    "paris-11e": ("Paris 11e", "75", 146000, 14, "métro lignes 1, 2, 3, 5, 8, 9", "arrondissement le plus dense de Paris, très familial"),
    "paris-14e": ("Paris 14e", "75", 134000, 14, "métro lignes 4, 6, 13 et RER B", "quartiers résidentiels autour de Montparnasse et Denfert-Rochereau"),
    "paris-15e": ("Paris 15e", "75", 233000, 12, "métro lignes 6, 8, 10, 12, 13", "arrondissement le plus peuplé de Paris, très familial"),
    "paris-16e": ("Paris 16e", "75", 166000, 10, "métro lignes 1, 6, 9 et RER C", "arrondissement résidentiel entre le Bois de Boulogne et la Seine"),
    "paris-17e": ("Paris 17e", "75", 170000, 8, "métro lignes 2, 3, 13 et RER C", "arrondissement varié, des Batignolles à la Porte Maillot"),
    "paris-18e": ("Paris 18e", "75", 195000, 12, "métro lignes 2, 4, 12 et Transilien H", "arrondissement de Montmartre, très familial dans sa partie nord"),
    "paris-19e": ("Paris 19e", "75", 186000, 15, "métro lignes 5, 7 et tramway T3b", "arrondissement entre Buttes-Chaumont et La Villette"),
    "paris-1er": ("Paris 1er", "75", 16000, 12, "métro lignes 1, 4, 7 et RER A/B", "cœur historique de Paris, Louvre et Tuileries"),
    "paris-20e": ("Paris 20e", "75", 196000, 16, "métro lignes 2, 3, 9, 11", "arrondissement populaire et familial autour de Belleville et Ménilmontant"),
    "paris-2e": ("Paris 2e", "75", 20000, 12, "métro lignes 3, 7, 8, 9", "quartier des affaires et de la Bourse"),
    "paris-3e": ("Paris 3e", "75", 34000, 13, "métro lignes 3, 8, 11 et Transilien", "le Haut Marais, quartier historique et résidentiel"),
    "paris-4e": ("Paris 4e", "75", 28000, 13, "métro lignes 1, 7, 11 et RER B/C", "le Marais et l'Île de la Cité"),
    "paris-5e": ("Paris 5e", "75", 58000, 13, "métro lignes 7, 10 et RER B/C", "le Quartier latin, pôle universitaire et familial"),
    "paris-6e": ("Paris 6e", "75", 40000, 12, "métro lignes 4, 10, 12", "Saint-Germain-des-Prés et le Luxembourg"),
    "paris-7e": ("Paris 7e", "75", 51000, 11, "métro lignes 8, 10, 12, 13 et RER C", "arrondissement de la Tour Eiffel et des Invalides"),
    "paris-8e": ("Paris 8e", "75", 36000, 10, "métro lignes 1, 2, 9, 13 et RER A", "les Champs-Élysées et le quartier des affaires"),
    "paris-9e": ("Paris 9e", "75", 60000, 11, "métro lignes 2, 7, 12, 13", "quartier de l'Opéra et des Grands Boulevards"),
    "pierrefitte-sur-seine": ("Pierrefitte-sur-Seine", "93", 31000, 12, "tramway T5 et Transilien H", "au nord de Saint-Denis, bien connectée par le tramway"),
    "poissy": ("Poissy", "78", 40000, 20, "RER A et Transilien J", "cité historique des Yvelines au bord de la Seine"),
    "puteaux": ("Puteaux", "92", 45000, 5, "métro ligne 1 (La Défense) et Transilien L", "entre La Défense et la Seine, accès rapide à Colombes"),
    "rueil-malmaison": ("Rueil-Malmaison", "92", 80000, 6, "RER A et Transilien L", "grande ville résidentielle des Hauts-de-Seine, riche en espaces verts"),
    "saint-cloud": ("Saint-Cloud", "92", 30000, 8, "Transilien L et tramway T2", "ville résidentielle au pied de son parc historique"),
    "saint-denis": ("Saint-Denis", "93", 113000, 10, "métro ligne 13 et RER D", "ville du Stade de France, pôle universitaire majeur"),
    "saint-germain-en-laye": ("Saint-Germain-en-Laye", "78", 45000, 18, "RER A", "ville royale avec terrasse, forêt et lycée international"),
    "saint-gratien": ("Saint-Gratien", "95", 22000, 10, "Transilien H et C", "commune résidentielle entre Enghien et Épinay"),
    "saint-ouen-sur-seine": ("Saint-Ouen-sur-Seine", "93", 51000, 8, "métro ligne 13 et 14", "en pleine transformation avec l'extension de la ligne 14"),
    "sannois": ("Sannois", "95", 28000, 10, "Transilien H", "sur les hauteurs du Val-d'Oise, entre Argenteuil et Ermont"),
    "sarcelles": ("Sarcelles", "95", 58000, 18, "RER D et tramway T5", "grande ville du nord du Val-d'Oise avec une forte population familiale"),
    "sartrouville": ("Sartrouville", "78", 52000, 7, "Transilien L et RER A (Le Vésinet)", "entre Colombes et Maisons-Laffitte, excellentes connexions ferroviaires"),
    "soisy-sous-montmorency": ("Soisy-sous-Montmorency", "95", 18000, 15, "Transilien H et bus", "commune résidentielle dans la vallée de Montmorency"),
    "stains": ("Stains", "93", 39000, 13, "tramway T5 et bus", "entre Saint-Denis et Pierrefitte, bien connectée par le tramway"),
    "suresnes": ("Suresnes", "92", 49000, 7, "tramway T2 et bus", "sur les pentes du Mont-Valérien, entre Colombes et Puteaux"),
    "taverny": ("Taverny", "95", 27000, 17, "Transilien H", "au pied de la forêt de Montmorency"),
    "vanves": ("Vanves", "92", 28000, 13, "métro ligne 13 et tramway T3a", "petite commune du sud des Hauts-de-Seine, très bien desservie"),
    "vaucresson": ("Vaucresson", "92", 9000, 12, "Transilien L et bus", "village verdoyant entre Garches et La Celle-Saint-Cloud"),
    "ville-d-avray": ("Ville-d'Avray", "92", 11000, 11, "Transilien L", "village d'artistes entre les étangs de Corot et le parc de Saint-Cloud"),
    "villeneuve-la-garenne": ("Villeneuve-la-Garenne", "92", 27000, 4, "tramway T1 et bus", "commune voisine de Colombes, facilement accèssible"),
    "villetaneuse": ("Villetaneuse", "93", 14000, 12, "tramway T5 et Transilien H", "commune universitaire au nord de Saint-Denis"),
}

# ─── Treatment highlights (5 treatments, rotated by city index) ────────────────

TREATMENT_HIGHLIGHTS = [
    {
        "title": "Aligneurs invisibles",
        "slug": "aligneurs-invisibles",
        "paragraphs": [
            "Les aligneurs invisibles sont des gouttières transparentes sur mesure qui déplacent progressivement les dents. Changées toutes les deux semaines, elles offrent un traitement quasi-invisible, idéal pour les adultes et les adolescents soucieux de leur apparence. Le Dr Chardon utilise cette technique pour traiter les encombrements légers à modérés, les diastèmes et certaines malocclusions.",
            "Le suivi se fait tous les 6 à 8 semaines au cabinet de Colombes. Chaque consultation dure environ 20 minutes et permet de vérifier la progression du traitement et de remettre les nouvelles gouttières.",
        ],
    },
    {
        "title": "Appareils multibagues",
        "slug": "multibagues",
        "paragraphs": [
            "L'appareil multibagues est le traitement orthodontique de référence, adapté à toutes les malocclusions, des plus simples aux plus complexes. Le Dr Chardon propose des bagues métalliques classiques ainsi que des bagues en céramique, plus discrètes. Cette technique offre un contrôle précis du déplacement dentaire et des résultats prévisibles.",
            "Les rendez-vous de suivi ont lieu toutes les 4 à 8 semaines au cabinet. Chaque séance permet d'ajuster les arcs et de suivre l'évolution du traitement. La durée totale varie de 12 à 24 mois selon la complexité du cas.",
        ],
    },
    {
        "title": "Orthodontie interceptive chez l'enfant",
        "slug": "orthodontie-interceptive",
        "paragraphs": [
            "L'orthodontie interceptive s'adresse aux enfants de 6 à 11 ans. Elle permet de corriger précocement les problèmes de croissance des mâchoires et de guider l'éruption des dents définitives. Le Dr Chardon recommande une première consultation dès l'âge de 7 ans pour dépister d'éventuelles anomalies.",
            "Un traitement interceptif dure généralement 6 à 12 mois et utilise des appareils amovibles ou des dispositifs fixés. Cette approche précoce peut réduire la durée et la complexité d'un éventuel traitement futur à l'adolescence.",
        ],
    },
    {
        "title": "Orthodontie pour les adolescents",
        "slug": "orthodontie-adolescent",
        "paragraphs": [
            "L'adolescence est la période la plus fréquente pour un traitement orthodontique. La croissance osseuse encore active facilite les déplacements dentaires. Le Dr Chardon propose aux adolescents un choix entre bagues métalliques, bagues céramiques et aligneurs invisibles selon leur cas clinique et leurs préférences.",
            "Le traitement dure en moyenne 18 mois, avec des visites de contrôle tous les 6 à 8 semaines. Le cabinet propose des horaires adaptés pour limiter les absences scolaires, avec des créneaux le mercredi et en fin de journée.",
        ],
    },
    {
        "title": "Orthodontie adulte",
        "slug": "orthodontie-adulte",
        "paragraphs": [
            "De plus en plus d'adultes entreprennent un traitement orthodontique, que ce soit pour des raisons esthétiques ou fonctionnelles. Le Dr Chardon propose des solutions discrètes adaptées aux contraintes professionnelles : aligneurs invisibles, bagues céramiques ou attaches linguales selon l'indication clinique.",
            "Chez l'adulte, le traitement nécessite parfois une coordination avec d'autres professionnels de santé (parodontiste, prothésiste). Le cabinet assure cette coordination pour un résultat optimal tant sur le plan fonctionnel qu'esthétique.",
        ],
    },
]

# ─── FAQ pools by theme ───────────────────────────────────────────────────────

FAQ_POOLS = {
    "premiere_consultation": [
        ("Comment se déroule la première consultation d'orthodontie ?",
         "La première consultation dure environ 30 à 45 minutes. Le Dr Chardon réalise un examen clinique complet, prend des photos et des empreintes numériques si nécessaire. Elle vous explique le diagnostic, les options de traitement possibles et vous remet un devis détaillé. Cette consultation est l'occasion de poser toutes vos questions."),
        ("À quel âge faut-il consulter un orthodontiste pour la première fois ?",
         "L'Association Française d'Orthodontie recommande une première visite dès l'âge de 7 ans. À cet âge, les premières dents définitives ont fait leur éruption et il est possible de dépister des anomalies de croissance des mâchoires ou de positionnement des dents. Un dépistage précoce ne signifie pas forcément un traitement immédiat."),
    ],
    "tarifs": [
        ("Quels sont les tarifs d'un traitement orthodontique ?",
         "Le coût d'un traitement orthodontique varie selon la technique utilisée et la durée du traitement. Un devis détaillé est remis après la première consultation. La Sécurité sociale prend en charge une partie du traitement pour les patients de moins de 16 ans (semestre d'un montant de 193,50 €). Les mutuelles complètent souvent ce remboursement."),
        ("L'orthodontie est-elle remboursée par la Sécurité sociale ?",
         "Pour les patients de moins de 16 ans, la Sécurité sociale rembourse les traitements orthodontiques à hauteur de 193,50 € par semestre de traitement (TO 90). Au-delà de 16 ans, le traitement n'est plus pris en charge, mais de nombreuses mutuelles proposent des forfaits orthodontie adulte. Le cabinet vous aide à constituer votre dossier."),
    ],
    "duree": [
        ("Combien de temps dure un traitement orthodontique ?",
         "La durée dépend de la complexité du cas. Un traitement simple peut durer 6 à 12 mois, tandis qu'un cas complexe peut nécessiter 18 à 30 mois. Le Dr Chardon vous communique une estimation précise lors de la consultation. Les rendez-vous de suivi sont espacés de 4 à 12 semaines selon la technique utilisée."),
        ("À quelle fréquence faut-il venir au cabinet pendant le traitement ?",
         "Les rendez-vous de suivi ont lieu en moyenne toutes les 6 à 8 semaines pour un appareil multibagues et toutes les 8 à 10 semaines pour des aligneurs invisibles. Chaque visite dure 15 à 30 minutes. Le cabinet propose des horaires flexibles pour s'adapter à votre emploi du temps."),
    ],
    "techniques": [
        ("Quelle est la différence entre les bagues et les aligneurs invisibles ?",
         "Les bagues (multibagues) sont des attaches collées sur chaque dent, reliées par un arc métallique. Elles permettent de traiter tous les types de malocclusions. Les aligneurs invisibles sont des gouttières transparentes amovibles, plus discrètes mais adaptées aux cas légers à modérés. Le Dr Chardon vous recommande la technique la plus adaptée à votre situation."),
        ("Les bagues céramiques sont-elles aussi efficaces que les bagues métalliques ?",
         "Oui, les bagues céramiques offrent la même efficacité que les bagues métalliques. Elles sont fabriquées dans un matériau de la couleur de la dent, ce qui les rend beaucoup plus discrètes. Elles sont particulièrement appréciées des adultes et des adolescents. Le Dr Chardon utilise les deux types selon les préférences du patient et les exigences cliniques."),
    ],
    "hygiene": [
        ("Comment maintenir une bonne hygiène dentaire avec un appareil orthodontique ?",
         "Le brossage doit être minutieux, après chaque repas, avec une brosse à dents orthodontique et des brossettes interdentaires. L'équipe du cabinet vous explique les techniques de brossage adaptées à votre appareil. Pour les porteurs d'aligneurs, il suffit de retirer les gouttières pour manger et se brosser les dents normalement."),
        ("Peut-on manger normalement avec un appareil dentaire ?",
         "Avec des bagues, il est recommandé d'éviter les aliments très durs (pommes entières, caramels, nougat) et très collants. Les aliments doivent être coupés en petits morceaux. Avec des aligneurs invisibles, il n'y a aucune restriction alimentaire puisque les gouttières se retirent pour les repas."),
    ],
    "urgence": [
        ("Que faire en cas d'urgence orthodontique ?",
         "En cas de fil qui blesse la joue ou de bague décollée, contactez le cabinet par téléphone ou email. Le Dr Chardon vous proposera un rendez-vous rapidement. En attendant, de la cire orthodontique (fournie en début de traitement) permet de protéger la muqueuse. Une bague décollée n'est pas douloureuse mais doit être recollée rapidement."),
        ("Le cabinet propose-t-il des rendez-vous en urgence ?",
         "Oui, le cabinet réserve des créneaux pour les urgences orthodontiques (fil cassé, bague décollée, douleur). Contactez le cabinet par téléphone ou email pour obtenir un rendez-vous dans les 24 à 48 heures. Les urgences vitales (traumatisme dentaire) doivent être orientées vers les urgences hospitalières."),
    ],
    "contention": [
        ("Qu'est-ce que la contention orthodontique ?",
         "La contention est la phase qui suit le traitement actif. Un fil collé derrière les dents antérieures (contention fixe) ou une gouttière de nuit (contention amovible) maintient les dents dans leur nouvelle position. Cette étape est essentielle pour éviter la récidive. Le Dr Chardon recommande une contention à vie pour garantir la stabilité du résultat."),
        ("La contention est-elle obligatoire après un traitement orthodontique ?",
         "La contention est fortement recommandée. Sans elle, les dents ont tendance à revenir à leur position initiale. Le Dr Chardon pose un fil de contention collé derrière les incisives le jour du retrait de l'appareil. Ce fil est invisible et ne gêne pas au quotidien. Un contrôle annuel suffit pour vérifier sa tenue."),
    ],
}

# ─── City-specific intro templates ───────────────────────────────────────────

def get_city_intro(slug, city_name, dept, pop, distance, transport, fact):
    """Generate a unique intro paragraph for the city."""
    dept_names = {"75": "Paris", "78": "Yvelines", "92": "Hauts-de-Seine", "93": "Seine-Saint-Denis", "95": "Val-d'Oise"}
    dept_name = dept_names.get(dept, dept)

    # Use hash of slug to pick intro template
    idx = sum(ord(c) for c in slug) % 6
    pop_str = f"{pop:,}".replace(",", " ")

    templates = [
        f"Avec ses {pop_str} habitants, {city_name} est {'une des communes les plus peuplées' if pop > 50000 else 'une commune dynamique'} {'de ' if not dept_name.startswith('Paris') else ''}{'du département des ' if dept == '78' else 'du département des ' if dept == '92' else 'du département de ' if dept == '93' else 'du département du ' if dept == '95' else 'd'}{'' if dept == '75' else ''}{dept_name}. Située à {distance} km de Colombes, elle est desservie par {transport}. {city_name.split('(')[0].strip()}, {fact}, bénéficie d'un accès pratique au cabinet du Dr Chardon pour tous les traitements orthodontiques.",

        f"{city_name}, {fact}, compte environ {pop_str} habitants dans le département {'des ' if dept in ('78', '92') else 'de ' if dept == '93' else 'du ' if dept == '95' else 'de '}{dept_name}. Le cabinet du Dr Chardon à Colombes se trouve à {distance} km et est accèssible via {transport}. De nombreuses familles de {city_name.split('(')[0].strip()} font confiance au Dr Chardon pour l'orthodontie de leurs enfants et adolescents.",

        f"Située à {distance} km du cabinet, {city_name} ({dept_name}) est {'parfaitement connectée' if distance <= 10 else 'bien reliée'} à Colombes via {transport}. Cette commune de {pop_str} habitants, {fact}, compte de nombreux patients réguliers au cabinet du Dr Chardon. Les consultations de suivi, espacées de plusieurs semaines, sont compatibles avec un trajet {'court' if distance <= 8 else 'raisonnable'}.",

        f"Les habitants de {city_name} ({pop_str} habitants) bénéficient d'un accès {'direct' if distance <= 5 else 'rapide' if distance <= 12 else 'pratique'} au cabinet d'orthodontie du Dr Chardon à Colombes, à {distance} km via {transport}. {city_name.split('(')[0].strip()}, {fact}, est {'une commune voisine' if distance <= 5 else 'une commune proche'} où le cabinet accueille régulièrement des patients pour des traitements orthodontiques.",

        f"Le Dr Chardon reçoit de nombreux patients de {city_name}, commune de {pop_str} habitants {'des ' if dept in ('78', '92') else 'de ' if dept == '93' else 'du ' if dept == '95' else 'de '}{dept_name}. {fact.capitalize()}, {city_name.split('(')[0].strip()} se situe à {distance} km du cabinet. L'accès se fait via {transport}, ce qui facilite le suivi orthodontique régulier pour toute la famille.",

        f"{'Voisine directe de Colombes' if distance <= 4 else 'À ' + str(distance) + ' km de Colombes'}, {city_name} est {'la' if pop > 80000 else 'une'} commune {'la plus peuplée' if pop > 100000 else 'importante' if pop > 50000 else 'dynamique' if pop > 20000 else 'résidentielle'} {'des ' if dept in ('78', '92') else 'de ' if dept == '93' else 'du ' if dept == '95' else 'de '}{dept_name} avec {pop_str} habitants. {fact.capitalize()}, la ville est desservie par {transport}. Le cabinet du Dr Chardon à Colombes propose aux habitants de {city_name.split('(')[0].strip()} l'ensemble de ses traitements orthodontiques.",
    ]
    return templates[idx]


def get_faqs_for_city(slug, city_name):
    """Select 3 unique FAQs for this city from the pools."""
    pool_keys = list(FAQ_POOLS.keys())
    h = sum(ord(c) * (i + 1) for i, c in enumerate(slug))

    selected = []
    used_keys = set()
    for offset in range(3):
        key_idx = (h + offset * 3) % len(pool_keys)
        key = pool_keys[key_idx]
        while key in used_keys:
            key_idx = (key_idx + 1) % len(pool_keys)
            key = pool_keys[key_idx]
        used_keys.add(key)
        variant = (h + offset) % len(FAQ_POOLS[key])
        q, a = FAQ_POOLS[key][variant]
        # Make FAQ city-specific by prepending city context where relevant
        if offset == 0:
            q_city = q.replace("?", f" depuis {city_name}\u00a0?")
        else:
            q_city = q
        selected.append((q_city, a))
    return selected


def build_faq_html(faqs):
    """Build FAQ accordion HTML."""
    html = '<h2>Questions fréquentes</h2>\n<div class="zone-faq">\n'
    for q, a in faqs:
        html += f'<details class="zone-faq__item">\n'
        html += f'<summary class="zone-faq__question">{q}</summary>\n'
        html += f'<p class="zone-faq__answer">{a}</p>\n'
        html += f'</details>\n'
    html += '</div>'
    return html


def build_faq_schema(faqs, city_slug):
    """Build FAQPage JSON-LD schema."""
    items = []
    for q, a in faqs:
        items.append({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": a
            }
        })
    schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": items
    }
    return json.dumps(schema, ensure_ascii=False, indent=0)


def build_treatment_html(treatment, city_name):
    """Build treatment highlight section."""
    html = f'<h2>{treatment["title"]} pour les patients de {city_name}</h2>\n'
    for p in treatment["paragraphs"]:
        html += f'<p>{p}</p>\n'
    html += f'<p><a href="../traitements/{treatment["slug"]}" class="zone-treat-inline-link">En savoir plus sur {treatment["title"].lower()} →</a></p>'
    return html


def enrich_city_page(filepath, slug):
    """Add unique content to a city page."""
    if slug in ZONE_PAGES or slug not in CITIES:
        return False

    city_name, dept, pop, distance, transport, fact = CITIES[slug]

    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    # Skip if already enriched
    if "zone-faq" in html:
        return False

    # Generate unique content
    h = sum(ord(c) * (i + 1) for i, c in enumerate(slug))
    treatment = TREATMENT_HIGHLIGHTS[h % len(TREATMENT_HIGHLIGHTS)]
    faqs = get_faqs_for_city(slug, city_name)
    intro = get_city_intro(slug, city_name, dept, pop, distance, transport, fact)

    # Build new sections
    intro_html = f'\n<h2>Orthodontie pour les habitants de {city_name}</h2>\n<p>{intro}</p>\n'
    treatment_html = '\n' + build_treatment_html(treatment, city_name) + '\n'
    faq_html = '\n' + build_faq_html(faqs) + '\n'
    faq_schema = build_faq_schema(faqs, slug)

    # Insert FAQ schema in <head> before </head>
    html = html.replace('</head>', f'<script type="application/ld+json">\n{faq_schema}\n</script>\n</head>')

    # Insert content before the treatments section (before <h2>Traitements proposés</h2>)
    # or before closing </div> of zone-content
    insert_marker = '<h2>Traitements proposés</h2>'
    if insert_marker in html:
        html = html.replace(insert_marker, intro_html + treatment_html + faq_html + '\n' + insert_marker)
    else:
        # Fallback: insert before closing zone-content div
        html = html.replace('</div>\n\n<aside', intro_html + treatment_html + faq_html + '\n</div>\n\n<aside')

    # Add CSS for FAQs if not present
    faq_css = """
<style>
.zone-faq { margin: 2rem 0; }
.zone-faq__item { border-bottom: 1px solid rgba(255,255,255,0.1); padding: 1rem 0; }
.zone-faq__question { cursor: pointer; font-weight: 600; font-size: 1.05rem; list-style: none; }
.zone-faq__question::-webkit-details-marker { display: none; }
.zone-faq__question::before { content: "+"; margin-right: 0.75rem; font-weight: 700; }
details[open] .zone-faq__question::before { content: "−"; }
.zone-faq__answer { margin-top: 0.75rem; line-height: 1.7; color: rgba(255,255,255,0.8); }
.zone-treat-inline-link { color: #7eb8da; text-decoration: none; font-weight: 500; }
.zone-treat-inline-link:hover { text-decoration: underline; }
</style>
"""
    html = html.replace('</head>', faq_css + '</head>')

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)

    return True


def main():
    enriched = 0
    skipped = 0
    missing = 0

    for filename in sorted(os.listdir(ORTHO_DIR)):
        if not filename.endswith(".html"):
            continue
        slug = filename[:-5]  # Remove .html
        filepath = os.path.join(ORTHO_DIR, filename)

        if slug in ZONE_PAGES:
            skipped += 1
            continue

        if slug not in CITIES:
            print(f"  MISSING data for: {slug}")
            missing += 1
            continue

        if enrich_city_page(filepath, slug):
            enriched += 1
            print(f"  ✓ {slug}")
        else:
            print(f"  ○ {slug} (already enriched or skipped)")
            skipped += 1

    print(f"\nDone: {enriched} enriched, {skipped} skipped, {missing} missing data")


if __name__ == "__main__":
    main()
