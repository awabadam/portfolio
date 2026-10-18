import type { Playbook } from "./types";

/**
 * Édition française. Réécriture de en.ts par un rédacteur francophone, pas une
 * traduction mot à mot : mêmes ids, même nombre d'étapes, de points de
 * contrôle, de modèles et d'erreurs par chapitre (vérifié par
 * scripts/check-playbook.mjs).
 */
export const PLAYBOOK: Playbook = {
  title: "Le Playbook 30 jours du site qui attire les patients internationaux",
  subtitle: "Transformez le site que votre clinique a déjà en une source de demandes venues de l'étranger, chapitre par chapitre, avec les modèles prêts à coller.",
  intro:
    "Votre score d'audit montre où le site perd des patients. Ce playbook referme ces fuites. Chacun des 10 chapitres correspond à une question de l'audit, se lit seul, et se termine par une liste de contrôle, des modèles à copier-coller et une prochaine étape claire. Commencez par vos trois réponses les plus faibles. Un responsable de clinique avec un développeur disponible, ou un bon freelance, peut tout faire ici sans refonte. Rien ne dépend d'une plateforme particulière.",
  chapters: [
    {
      id: "languages",
      title: "Des pages complètes dans la langue de vos patients",
      promise: "Après ce chapitre, vous saurez exactement quelles pages traduire, dans quel ordre, et comment briefer un traducteur pour que les pages semblent écrites pour ce marché.",
      minutes: 6,
      why: [
        "Un patient à Riyad, à Lyon ou à Manchester compare quatre ou cinq cliniques en une soirée, sur son téléphone, dans sa langue. Si votre site lui propose une page d'accueil traduite et une liste de traitements en anglais, il ne s'acharne pas. Il va voir la clinique qui a écrit pour lui.",
        "La publicité rend ce manque coûteux. Une annonce en arabe qui envoie vers une page en anglais paie le clic et ne récupère rien. Le même budget sur une page arabe complète est l'amélioration la moins chère que vous puissiez apporter à vos campagnes.",
        "Le chantier est plus petit qu'il n'y paraît : deux ou trois marchés, les pages qui mènent à une demande, écrites une fois par un rédacteur natif, puis tenues à jour.",
      ],
      steps: [
        {
          title: "Choisissez deux ou trois marchés, pas dix",
          body: "Ouvrez la liste de vos demandes des six derniers mois et comptez les pays. Retenez les deux ou trois langues qui en couvrent la majorité. Chaque langue ajoutée est un jeu de pages à maintenir pour toujours, alors commencez là où les patients sont déjà.",
        },
        {
          title: "Listez les pages qui mènent à une demande",
          body: "Pour chaque langue, il vous faut le même ensemble : chaque page de traitement, les médecins, la page du parcours patient, les prix et la FAQ, la page contact et la page de remerciement. Le blog peut attendre. Une page d'accueil seule n'est pas une version linguistique, c'est le signe que le reste manque.",
        },
        {
          title: "Faites écrire les pages, pas traduire",
          body: "Donnez à un rédacteur médical natif la page anglaise et vos réponses au brief ci-dessous. Demandez une réécriture qui sonne local : habitudes de devise, nom courant du traitement, questions que ce marché pose. La traduction automatique peut faire un brouillon ; un natif doit finir.",
        },
        {
          title: "Adaptez la mise en page à la langue",
          body: "Les pages en arabe doivent être entièrement de droite à gauche : alignement du texte, menu, icônes, formulaires et bouton WhatsApp, tout se reflète. Vérifiez que les chiffres, les dates et les prix se lisent bien. Le français et l'allemand sont souvent nettement plus longs que l'anglais, les boutons et les titres ont donc besoin de place.",
        },
        {
          title: "Placez le sélecteur de langue à portée de pouce",
          body: "Affichez le nom de la langue dans sa propre écriture (العربية, Français, Türkçe), dans l'en-tête, visible sur téléphone sans ouvrir de menu. Détectez la langue du navigateur une fois et proposez le changement, sans jamais l'imposer.",
        },
        {
          title: "Gardez toutes les langues synchronisées",
          body: "Chaque version linguistique a besoin de sa propre URL, de son propre titre et de sa meta description, et de balises hreflang qui pointent vers les autres. Quand vous changez un prix ou un médecin dans une langue, changez-le le jour même dans toutes. Mettez un rappel mensuel dans l'agenda.",
        },
      ],
      checklist: [
        "Deux ou trois langues cibles choisies d'après les pays réels des demandes",
        "Chaque page de traitement existe dans chaque langue, pas seulement l'accueil",
        "Les pages médecins, parcours, prix, FAQ et contact existent dans chaque langue",
        "Pages écrites ou relues par un natif ayant une expérience médicale",
        "Pages arabes entièrement en miroir droite à gauche, formulaires et boutons compris",
        "Sélecteur de langue visible dans l'en-tête sur téléphone",
        "Chaque langue a ses URL, titres, meta descriptions et balises hreflang",
        "Une personne nommée est responsable de la synchronisation des prix et des médecins",
      ],
      templates: [
        {
          id: "translation-brief",
          title: "Brief de traduction pour un marché",
          kind: "outline",
          note: "À remplir une fois par langue et à envoyer avec les pages anglaises. Il transforme une traduction en réécriture.",
          body: `Marché : (pays ou région, par ex. Golfe, France, Royaume-Uni)
Langue et variante : (par ex. arabe standard moderne avec expressions du Golfe ; français de France)
Qui lit : (par ex. un patient de 35 à 55 ans qui compare 4 cliniques sur un téléphone ; souvent un proche réserve pour lui)
Comment ils appellent le traitement : (le nom courant, pas seulement le nom clinique)
Ton : simple, calme, sûr. Pas de points d'exclamation. Pas de « meilleure clinique ».
Devise et prix : (afficher les prix en EUR / GBP / USD selon le marché ; garder le prix « à partir de » identique à la page anglaise)
Questions que ce marché pose le plus : (3 à 5, tirées de votre historique WhatsApp)
Ce qu'il ne faut pas dire : (affirmations invérifiables, résultats promis, noms de concurrents)
Pages à livrer, dans l'ordre : pages de traitement, médecins, parcours patient, prix, FAQ, contact, remerciement
Format : un document par page, titres conservés, la longueur peut différer de l'anglais
Délai et relecteur : (qui valide à la clinique, pour quand)`,
        },
      ],
      mistakes: [
        "Traduire uniquement la page d'accueil et renvoyer tout le reste vers l'anglais",
        "Utiliser un plugin de traduction qui produit un arabe cassé avec une mise en page de gauche à droite",
        "Cacher le sélecteur de langue dans un menu hamburger",
        "Changer un prix dans une langue et oublier les deux autres pendant des mois",
      ],
      done: "Un patient de chaque marché cible peut aller de l'annonce au message WhatsApp sans voir une seule page en anglais.",
    },
    {
      id: "journey",
      title: "Une page qui explique tout le voyage",
      promise: "Après ce chapitre, vous aurez une page parcours patient qui répond aux questions logistiques que vos coordinateurs traitent chaque semaine, pour que le patient arrive sur WhatsApp prêt à réserver, et non prêt à demander.",
      minutes: 6,
      why: [
        "Un patient à l'étranger hésite rarement sur le traitement. Il hésite sur le voyage : qui vient me chercher, où je dors, combien de jours, puis-je venir avec mon mari, qui j'appelle une fois rentré. Si le site laisse ces questions ouvertes, le patient continue de comparer, et chaque comparaison est une occasion de le perdre.",
        "Votre équipe connaît déjà les réponses. Elle les répète sur WhatsApp des dizaines de fois par mois. Chaque répétition coûte des minutes qui pourraient aller à un patient prêt à réserver, et chaque patient qui n'a pas demandé est simplement parti.",
        "Une page honnête, écrite dans l'ordre où le patient vit les choses, transforme ces conversations en une réponse de deux lignes : « Oui, exactement comme sur cette page, voici votre plan. »",
      ],
      steps: [
        {
          title: "Recueillez les vraies questions",
          body: "Demandez aux coordinateurs les dix questions qu'ils traitent le plus souvent sur le voyage, le séjour et le suivi. Gardez la formulation exacte des patients. Ce sont vos titres.",
        },
        {
          title: "Écrivez dans l'ordre du patient",
          body: "Demande, plan, voyage, séjour, jours de traitement, suivi à Istanbul, suivi depuis la maison. Sept sections courtes, chacune avec ce qui se passe, combien de temps cela prend, ce que fait la clinique et ce que fait le patient.",
        },
        {
          title: "Nommez les détails pratiques",
          body: "Accueil à l'aéroport : quels aéroports, qui les accueille, dans quelles langues. Hôtel : quelle catégorie, à quelle distance de la clinique, si l'accompagnant est logé gratuitement. Jours : combien pour chaque traitement principal, et quand ils peuvent reprendre l'avion. Paiement : moyens acceptés et quand chaque partie est réglée.",
        },
        {
          title: "Dites à qui ils parlent à chaque étape",
          body: "Un coordinateur nommé, avec photo et langues parlées, avant et pendant le voyage. Un contact nommé pour le suivi une fois rentré, avec les horaires de réponse. Ce seul détail enlève la peur d'être oublié après le paiement.",
        },
        {
          title: "Ajoutez une version courte à chaque page de traitement",
          body: "Trois lignes : jours à Istanbul, quand vous rentrez, ce qui est inclus. Un lien vers la page parcours complète. Le patient ne devrait jamais quitter une page de traitement pour trouver la logistique.",
        },
        {
          title: "Utilisez-la dans vos réponses",
          body: "Enregistrez le lien dans les réponses rapides WhatsApp. Quand un patient demande l'accueil ou l'hôtel, envoyez le lien de la section et les deux lignes qui le concernent. La page explique, le coordinateur réserve.",
        },
      ],
      checklist: [
        "La page parcours existe dans chaque langue cible",
        "Sept étapes dans l'ordre du patient, du premier message au suivi depuis la maison",
        "Aéroports, accueil, catégorie d'hôtel et distance nommés",
        "Jours à Istanbul et jour du retour donnés pour chaque traitement principal",
        "Politique d'accompagnant et moyens de paiement indiqués",
        "Un coordinateur nommé et un contact de suivi avec horaires",
        "Résumé en trois lignes avec lien sur chaque page de traitement",
        "Lien enregistré dans les réponses rapides WhatsApp de l'équipe",
      ],
      templates: [
        {
          id: "journey-page",
          title: "Plan de la page parcours patient avec phrases types",
          kind: "outline",
          note: "Remplacez les parties entre crochets par les vrais détails de votre clinique. Phrases courtes : le patient lit sur un téléphone.",
          body: `Titre : Votre traitement à Istanbul, étape par étape

1. Votre demande (jour 0)
« Écrivez-nous sur WhatsApp ou par le formulaire. Sous [2 heures pendant les horaires d'ouverture], un coordinateur qui parle [français, anglais, arabe] vous répond et vous demande des photos ou une radio. »

2. Votre plan (jours 1 à 3)
« Notre médecin étudie votre cas et vous recevez un plan écrit : traitements, matériaux, nombre de jours, prix total et ce qui est inclus. Rien ne change à l'arrivée sans votre accord préalable. »

3. Le voyage
« Une fois votre confirmation reçue, nous proposons des dates. Vous réservez vos vols vers [l'aéroport d'Istanbul (IST) ou Sabiha Gökçen (SAW)] ; nous vous attendons aux arrivées avec une pancarte et vous conduisons à l'hôtel. »

4. Votre séjour
« Vous logez dans un hôtel [4 étoiles] à [10 minutes] de la clinique, [petit-déjeuner inclus, accompagnant logé gratuitement]. Tous les transferts entre l'hôtel et la clinique sont inclus. »

5. Les jours de traitement
« [Implants dentaires : 2 séjours de 5 à 7 jours, à 3 à 6 mois d'intervalle.] Un coordinateur vous accompagne à chaque rendez-vous et reste joignable sur WhatsApp entre les séjours. »

6. Le suivi à Istanbul
« Vous revoyez le médecin avant de rentrer. Vous repartez avec des consignes écrites dans votre langue, les médicaments si nécessaire, et le numéro de votre coordinateur. »

7. Le suivi depuis chez vous
« Nous prenons de vos nouvelles à [1 semaine, 1 mois et 6 mois]. Pour toute question, écrivez à [prénom] sur WhatsApp ; réponse sous [un jour ouvré]. Votre dentiste peut nous contacter directement au sujet de votre dossier. »

Phrase de fin
« Une question à laquelle nous n'avons pas répondu ? Écrivez-nous, nous répondons dans votre langue. » [bouton WhatsApp]`,
        },
      ],
      mistakes: [
        "Écrire la page comme un argumentaire de vente au lieu d'un programme",
        "Laisser le nombre de jours vague parce que « ça dépend », au lieu de donner une fourchette par traitement",
        "Aucun contact de suivi nommé, donc le patient craint d'être oublié après le paiement",
        "Enterrer la page dans le pied de page, sans aucun lien depuis les pages de traitement",
      ],
      done: "Un coordinateur peut répondre à toute question logistique avec le lien d'une section de la page et deux phrases.",
    },
    {
      id: "whatsapp",
      title: "Un bouton WhatsApp sur chaque page de traitement",
      promise: "Après ce chapitre, chaque page de traitement ouvrira une conversation WhatsApp avec un message pré-rempli qui indique à votre équipe le traitement et la langue, et votre équipe aura des réponses scriptées qui qualifient un patient en trois questions.",
      minutes: 7,
      why: [
        "La plupart des patients internationaux écrivent sur WhatsApp, pas par un formulaire. Un patient qui lit une page de traitement et décide de demander a, à cet instant, une question. Si le bouton est sur la page contact, il doit le chercher. Beaucoup ne le font pas ; ils ouvrent l'onglet de la clinique suivante.",
        "Le bouton n'est que la moitié du travail. L'autre moitié est la première réponse. Un patient qui écrit à quatre cliniques choisit souvent celle qui a répondu en premier avec des questions sensées. La clinique qui répond le lendemain matin par « Comment pouvons-nous vous aider ? » a déjà perdu la soirée.",
        "C'est généralement le levier le plus puissant pour les demandes, et il coûte un après-midi.",
      ],
      steps: [
        {
          title: "Utilisez un numéro WhatsApp Business qui appartient à la clinique",
          body: "Pas le téléphone personnel d'un coordinateur. Renseignez le profil professionnel avec le nom de la clinique, l'adresse, le site et les langues parlées. Définissez des horaires et un message d'absence pour que personne n'attende toute la nuit sans réponse.",
        },
        {
          title: "Créez un lien par traitement et par langue",
          body: "Le format est https://wa.me/<numéro>?text=<message>, avec le numéro au format international sans plus ni espaces, et le message encodé pour URL (un espace devient %20, un retour à la ligne %0A). Donnez à chaque page de traitement son propre message pré-rempli qui nomme le traitement, pour que l'équipe connaisse le contexte avant de lire le premier mot.",
        },
        {
          title: "Placez le bouton là où le pouce tombe",
          body: "Sur téléphone : un bouton fixe en bas de l'écran, visible sans faire défiler, sur chaque page de traitement. Sur ordinateur : dans l'en-tête et après la section prix. Libellez-le avec l'action, « Écrivez-nous sur WhatsApp », pas seulement une icône.",
        },
        {
          title: "Écrivez la première réponse avant le premier message",
          body: "Salutation dans la langue du patient, une phrase rassurante, puis trois questions de qualification : quel traitement, quand il peut voyager, et une photo ou un scanner. Enregistrez-la en réponse rapide. Le modèle ci-dessous donne la formulation.",
        },
        {
          title: "Fixez un délai de réponse que l'équipe peut tenir",
          body: "Choisissez un objectif réellement tenable, par exemple sous 15 minutes pendant les heures d'ouverture et une première réponse avant 9 h pour les messages de la nuit. Écrivez-le sur la page : « Nous répondons sous 15 minutes, de 9 h à 20 h heure d'Istanbul. » Une promesse tenue est un argument de conversion.",
        },
        {
          title: "Mesurez les clics",
          body: "Chaque bouton WhatsApp doit déclencher un événement de clic avec la page et le traitement en paramètres (le chapitre 9 explique comment). Sans cela, impossible de savoir quelle page ou quelle annonce a amené la conversation.",
        },
      ],
      checklist: [
        "Compte WhatsApp Business sur un numéro de la clinique, avec profil et horaires",
        "Un bouton sur chaque page de traitement, fixé en bas sur téléphone",
        "Le message pré-rempli nomme le traitement et la langue de la page",
        "Message d'absence dans chaque langue cible hors horaires",
        "Première réponse enregistrée par langue avec trois questions de qualification",
        "Délai de réponse écrit sur la page et mesuré chaque semaine",
        "Bouton libellé avec des mots, pas seulement une icône",
        "L'événement de clic se déclenche avec la page et le traitement en paramètres",
      ],
      templates: [
        {
          id: "wa-prefilled",
          title: "Messages WhatsApp pré-remplis par traitement",
          kind: "message",
          note: "Un par page de traitement, en français pour vos pages françaises, en anglais pour les pages anglaises. Encodez les espaces en %20 dans le lien. Le patient peut modifier avant d'envoyer.",
          body: `Implants dentaires (FR) :
Bonjour, je lis votre page sur les implants dentaires et je souhaite un devis. Mon pays : ___

Facettes / smile design (FR) :
Bonjour, je m'intéresse aux facettes. Puis-je envoyer des photos de mes dents pour un plan ? Mon pays : ___

Greffe de cheveux (FR) :
Bonjour, je souhaite une évaluation pour une greffe de cheveux. Je peux envoyer des photos. Mon pays : ___

Rhinoplastie (FR) :
Bonjour, j'envisage une rhinoplastie et je souhaite une consultation. Mon pays : ___

Message générique (FR) :
Bonjour, j'ai une question sur [traitement] et je souhaite parler à un coordinateur. Mon pays : ___

Implants dentaires (EN) :
Hello, I am reading your dental implants page and would like a quote. My country: ___

Message générique (EN) :
Hello, I have a question about [treatment] and would like to speak to a coordinator. My country: ___

Exemple de lien :
https://wa.me/90XXXXXXXXXX?text=Bonjour%2C%20je%20lis%20votre%20page%20sur%20les%20implants%20dentaires%20et%20je%20souhaite%20un%20devis.%20Mon%20pays%20%3A%20`,
        },
        {
          id: "wa-first-reply",
          title: "Scripts de première réponse pour l'équipe",
          kind: "message",
          note: "À enregistrer en réponses rapides. Envoyez en quelques minutes. Posez les trois questions dans un seul message pour que le patient réponde une fois.",
          body: `Première réponse (FR) :
Bonjour [prénom], merci d'avoir écrit à [Clinique]. Je suis [coordinateur], je m'occupe de votre dossier. Pour préparer un plan avec notre médecin, pouvez-vous me dire :
1. Quel traitement vous envisagez, et ce qui vous gêne le plus aujourd'hui
2. Quand vous pourriez venir à Istanbul, approximativement
3. Une photo (ou une radio si vous en avez une), pour que le médecin puisse évaluer
Dès que j'ai ces éléments, vous recevez un plan écrit avec le prix et le nombre de jours.

Si le patient n'envoie que « prix ? » (FR) :
Bien sûr. Les prix pour [traitement] commencent à [montant] et comprennent [hôtel, transferts, matériaux]. Le prix exact dépend de votre cas ; envoyez une photo et je fais confirmer par le médecin sous [24 heures].

Message d'absence de nuit (FR) :
Merci pour votre message. Notre équipe répond de 9 h à 20 h, heure d'Istanbul. [Coordinateur] vous écrira dès le matin. Si possible, envoyez une photo et votre pays pour que nous préparions votre plan.

Relance sans réponse après 2 jours (FR) :
Bonjour [prénom], je voulais vérifier que vous avez bien reçu le plan. Si vous avez des questions sur le prix, les jours à Istanbul ou l'hôtel, je suis là pour y répondre.

Première réponse (EN) :
Hello [name], thank you for writing to [Clinic]. I am [coordinator], I will look after your case. So I can prepare a plan with our doctor, could you tell me:
1. Which treatment you are considering, and what bothers you most today
2. When you could travel to Istanbul, roughly
3. A photo (or an X-ray if you have one), so the doctor can assess
As soon as I have these, you will receive a written plan with the price and the number of days.`,
        },
      ],
      mistakes: [
        "Bouton uniquement sur la page contact, ou caché dans un widget de chat qui se charge tard",
        "Le numéro personnel d'un coordinateur, qui part avec lui",
        "Une première réponse « Comment pouvons-nous vous aider ? » sans question, et la conversation s'arrête",
        "Pas de message d'absence, donc un patient qui écrit à 23 h lit le silence jusqu'à midi",
      ],
      done: "Ouvrez n'importe quelle page de traitement sur un téléphone, touchez une fois, et une conversation s'ouvre avec le traitement nommé ; un message test reçoit une réponse scriptée avec trois questions dans le délai annoncé.",
    },
    {
      id: "speed",
      title: "Des pages qui se chargent en moins de 3 secondes sur téléphone",
      promise: "Après ce chapitre, vos pages de traitement passeront un test de vitesse mobile, et vous aurez une routine mensuelle simple pour qu'elles restent rapides après chaque changement de contenu.",
      minutes: 5,
      why: [
        "Les patients naviguent sur téléphone, souvent en données mobiles, souvent directement depuis une annonce. Une page encore en chargement se ferme. Vous avez payé le clic ; la clinique suivante récupère le patient.",
        "La vitesse décide aussi de ce que vous payez. Google classe les pages lentes plus bas et note moins bien les pages d'atterrissage lentes dans Ads, donc le même budget achète moins de visites.",
        "La plupart des sites de clinique lents partagent quatre causes : images énormes, vidéo d'accueil, carrousels et empilement de scripts. Les quatre se corrigent sans refonte.",
      ],
      steps: [
        {
          title: "Mesurez les pages de traitement, pas l'accueil",
          body: "Lancez Google PageSpeed Insights sur trois pages de traitement dans chaque langue, onglet mobile. Notez le Largest Contentful Paint (bon : 2,5 secondes ou moins), l'Interaction to Next Paint (200 millisecondes ou moins) et le Cumulative Layout Shift (0,1 ou moins). Reportez les chiffres dans le journal ci-dessous.",
        },
        {
          title: "Réduisez chaque image",
          body: "Exportez les photos en WebP, à la largeur d'affichage réelle, et gardez chacune sous environ 200 Ko. L'image d'accueil sur un téléphone n'a pas besoin de 2 000 pixels de large. Donnez à chaque image une largeur et une hauteur pour que la page ne saute pas pendant le chargement.",
        },
        {
          title: "Supprimez la vidéo d'accueil et les carrousels",
          body: "Une vidéo de fond coûte des mégaoctets et ne montre rien dont le patient ait besoin. Remplacez-la par une seule bonne photo. Remplacez les carrousels par la meilleure image : personne n'attend la troisième diapositive.",
        },
        {
          title: "Retirez les scripts que vous n'utilisez pas",
          body: "Listez chaque script tiers : widgets de chat, cartes de chaleur, anciens pixels, polices de trois fournisseurs. Gardez l'outil d'analyse que vous lisez, le pixel publicitaire que vous utilisez et un seul outil de chat. Chargez le reste après l'affichage de la page, ou supprimez-le.",
        },
        {
          title: "Activez le cache et un CDN",
          body: "Demandez à votre développeur d'activer le cache navigateur, la compression et un réseau de diffusion de contenu, pour qu'un patient à Djeddah ou à Paris soit servi depuis un serveur proche. Chez la plupart des hébergeurs, c'est un réglage, pas un projet.",
        },
        {
          title: "Testez sur un vrai téléphone",
          body: "Ouvrez les pages sur un Android milieu de gamme en 4G, pas sur le Wi-Fi du cabinet. Si le bouton WhatsApp est visible et cliquable en trois secondes, c'est bon. Retestez après chaque changement de contenu ; les nouvelles images sont la régression habituelle.",
        },
      ],
      checklist: [
        "Test mobile lancé sur trois pages de traitement par langue, chiffres notés",
        "LCP 2,5 s ou moins, INP 200 ms ou moins, CLS 0,1 ou moins sur ces pages",
        "Toutes les images en WebP, à la largeur d'affichage, sous environ 200 Ko",
        "Pas de vidéo de fond, pas de carrousel sur les pages de traitement",
        "Scripts tiers listés ; les inutiles supprimés",
        "Cache, compression et CDN activés",
        "Pages vérifiées sur un vrai téléphone en données mobiles",
        "Retest mensuel dans l'agenda, avec un responsable nommé",
      ],
      templates: [
        {
          id: "speed-log",
          title: "Journal de vitesse mensuel",
          kind: "table",
          note: "Une ligne par page et par mois. Si un chiffre se dégrade, le dernier changement de contenu est la cause habituelle.",
          body: `| Date | Page (URL) | Langue | LCP (s) | INP (ms) | CLS | Poids (Mo) | Ce qui a changé depuis le mois dernier | Responsable |
|---|---|---|---|---|---|---|---|---|
| 2026-01-05 | /fr/implants-dentaires | FR | 2,1 | 140 | 0,03 | 1,2 | Vidéo d'accueil supprimée | Développeur |
| 2026-01-05 | /ar/dental-implants | AR | 2,4 | 150 | 0,05 | 1,3 | Images converties en WebP | Développeur |`,
        },
      ],
      mistakes: [
        "Tester la page d'accueil sur le Wi-Fi du cabinet et déclarer le site rapide",
        "Téléverser les photos du téléphone en pleine taille, directement depuis l'appareil",
        "Garder une vidéo d'accueil parce que « ça fait haut de gamme »",
        "Ajouter un deuxième widget de chat sans retirer le premier",
      ],
      done: "Trois pages de traitement par langue sont au vert au test mobile, et le bouton WhatsApp est cliquable en trois secondes sur un vrai téléphone.",
    },
    {
      id: "treatments",
      title: "Des pages de traitement qui répondent au prix et à la convalescence",
      promise: "Après ce chapitre, chaque traitement aura sa propre page avec un prix « à partir de », ce qui est inclus, les jours à Istanbul et le jour du retour, écrite pour que le premier message du patient soit une question de réservation plutôt qu'une question de prix.",
      minutes: 8,
      why: [
        "Le prix et le temps de convalescence sont les deux questions que tout patient se pose avant d'écrire. Les cacher n'évite pas la discussion sur le prix ; cela la déplace chez un concurrent qui répond ouvertement, et cela remplit votre WhatsApp de « combien ? » envoyés par des gens qui n'allaient jamais voyager.",
        "Une page qui répond aux deux reçoit moins de demandes de chasseurs de prix et plus de patients qui acceptent déjà la fourchette. C'est la différence entre un coordinateur qui passe la journée à chiffrer et un coordinateur qui passe la journée à réserver.",
        "Les patients lisent aussi les prix comme un signal. Un prix « à partir de » avec ce qui est inclus fait professionnel. Un prix très en dessous du marché fait peur.",
      ],
      steps: [
        {
          title: "Une page par traitement, dans chaque langue",
          body: "Pas une page « Services » avec douze paragraphes. Implants dentaires, All-on-4, facettes, greffe de cheveux, rhinoplastie : chacun reçoit une URL, un titre et une page capable de servir seule de page d'atterrissage pour une annonce.",
        },
        {
          title: "Suivez une seule structure pour toutes les pages",
          body: "Ce que c'est et pour qui, comment c'est fait ici, jours à Istanbul et séjours, quand vous rentrez, prix à partir de et ce qui est inclus, matériaux et marques utilisés, médecins qui le pratiquent, cas avant-après, FAQ, bouton WhatsApp. Le plan ci-dessous contient des textes types.",
        },
        {
          title: "Donnez un prix « à partir de » et dites ce qu'il comprend",
          body: "Choisissez le prix le plus bas honnête pour un cas simple typique et listez ce qu'il couvre : consultation, matériaux, nuits d'hôtel, transferts, médicaments, suivi. Dites ce qui n'est pas inclus. Nommez les marques d'implants ou de matériaux que vous utilisez vraiment ; les patients demandent, et une réponse écrite crée la confiance.",
        },
        {
          title: "Indiquez clairement les jours et la convalescence",
          body: "Jours à Istanbul, nombre de séjours, quand le patient peut reprendre l'avion, quand il peut retravailler, et à quoi ressemble la première semaine à la maison. Les fourchettes sont acceptables ; le flou ne l'est pas.",
        },
        {
          title: "Ajoutez les cinq vraies questions",
          body: "Prenez les cinq questions que les coordinateurs traitent le plus pour ce traitement et écrivez des réponses honnêtes, y compris aux questions gênantes : la douleur, les taux d'échec en mots simples, ce qui se passe si quelque chose tourne mal à la maison.",
        },
        {
          title: "Terminez par une seule action",
          body: "La page se termine par le bouton WhatsApp pré-rempli pour ce traitement et un formulaire pour les patients qui le préfèrent. Rien d'autre ne doit disputer l'attention en bas de page.",
        },
      ],
      checklist: [
        "Chaque traitement que vous vendez a sa page et son URL dans chaque langue",
        "Prix « à partir de » affiché avec une liste claire de ce qui est inclus et exclu",
        "Matériaux et marques nommés",
        "Jours à Istanbul, nombre de séjours et jour du retour indiqués",
        "Calendrier de convalescence pour la première semaine à la maison",
        "Cinq vraies questions avec des réponses honnêtes",
        "Médecins qui le pratiquent reliés par leur nom",
        "Bouton WhatsApp pré-rempli et formulaire court en fin de page",
      ],
      templates: [
        {
          id: "treatment-page",
          title: "Plan de page de traitement avec texte type (implants dentaires)",
          kind: "outline",
          note: "Remplacez les chiffres par les vôtres. La structure vaut pour tout traitement ; gardez l'ordre des sections.",
          body: `H1 : Implants dentaires à Istanbul

Introduction (2 lignes)
« Remplacez une dent ou une arcade complète par des implants en titane posés par le [Dr Nom], qui a posé [nombre] implants en [années] ans. Deux séjours à Istanbul, un plan écrit avant de partir. »

Ce que c'est et pour qui
« Un implant est une vis en titane placée dans l'os de la mâchoire qui porte une couronne, un bridge ou une arcade complète. Il convient aux patients à qui il manque une ou plusieurs dents et qui ont assez d'os, ou qui acceptent une greffe osseuse au préalable. Déconseillé en cas de maladie des gencives non traitée ou de diabète non contrôlé ; nous le vérifions à la consultation. »

Comment c'est fait ici
« Séjour 1 (5 à 7 jours) : examen, scanner 3D, pose des implants, dents provisoires. Séjour 2 (3 à 6 mois plus tard, 5 à 7 jours) : pose et réglage des couronnes définitives ou du bridge. »

Jours à Istanbul et retour
« Deux séjours de 5 à 7 jours. Vous pouvez reprendre l'avion 48 heures après la pose. La plupart des patients reprennent un travail de bureau le lendemain de leur retour. »

Prix à partir de
« À partir de [montant] par implant, à partir de [montant] pour une arcade complète (All-on-4). »
Inclus : consultation et scanner 3D, implant et pilier ([marque]), dents provisoires, couronnes définitives ([matériau]), [n] nuits d'hôtel par séjour, transferts aéroport et clinique, médicaments, suivi depuis chez vous.
Non inclus : vols, greffe osseuse si nécessaire ([montant]), nuits supplémentaires.

Matériaux
« [Marque d'implant, pays de fabrication], [matériau des couronnes]. Garantie à vie sur l'implant, [années] sur la couronne, conditions détaillées dans votre plan. »

Votre médecin
« [Dr Nom], [diplôme], [années] ans de chirurgie implantaire, membre de [association]. » [lien vers le profil]

Résultats
[3 à 6 cas avant-après, même angle, avec tranche d'âge, ce qui a été fait et nombre de jours]

FAQ
- Est-ce douloureux ? « La pose se fait sous anesthésie locale ; la plupart des patients décrivent 2 à 3 jours de gêne contrôlée par les médicaments que nous fournissons. »
- Et si un implant échoue ? « [Votre vraie politique : conditions de remplacement, ce qui est couvert, ce que paie le patient.] »
- Mon dentiste peut-il assurer le suivi ? « Oui. Vous recevez votre dossier complet et vos scanners ; nous parlons directement à votre dentiste si nécessaire. »
- Est-ce possible en un seul séjour ? « La mise en charge immédiate est possible pour certains cas ; le médecin décide après le scanner. »
- Comment payer ? « [Moyens], [acompte] à la confirmation, solde au premier séjour. »

Fin de page
« Envoyez une photo ou une radio sur WhatsApp et recevez votre plan écrit sous [24 heures]. » [bouton WhatsApp pré-rempli] [formulaire court]`,
        },
        {
          id: "price-table",
          title: "Tableau de fourchettes de prix",
          kind: "table",
          note: "Un tableau par page de traitement ou une page prix. Prix « à partir de » seulement ; le plan donne le chiffre exact.",
          body: `| Traitement | Prix à partir de | Fourchette habituelle | Jours à Istanbul | Séjours | Inclus | Non inclus |
|---|---|---|---|---|---|---|
| Implant dentaire unitaire | [montant] | [fourchette] | 5 à 7 par séjour | 2 | Scanner, implant, couronne, [n] nuits d'hôtel, transferts | Vols, greffe osseuse |
| All-on-4 (par mâchoire) | [montant] | [fourchette] | 5 à 7 par séjour | 2 | Scanner, 4 implants, bridge provisoire et définitif, hôtel, transferts | Vols, extractions au-delà de [n] |
| Facettes (par dent) | [montant] | [fourchette] | 5 à 7 | 1 | Smile design, facettes ([matériau]), hôtel, transferts | Vols, blanchiment |
| Greffe de cheveux (FUE) | [montant] | [fourchette] | 3 | 1 | Jusqu'à [n] greffons, médicaments, hôtel, transferts | Vols, séances PRP |
| Rhinoplastie | [montant] | [fourchette] | 7 | 1 | Chirurgie, 1 nuit à l'hôpital, hôtel, transferts | Vols, chirurgie de reprise |`,
        },
      ],
      mistakes: [
        "Une seule page « Nos services » sans prix, sans jours et sans médecin",
        "« Contactez-nous pour le prix » sur chaque page, ce qui envoie ailleurs les patients sensibles au prix et garde les chasseurs de prix dans votre WhatsApp",
        "Un prix « à partir de » si bas qu'il ne correspond à aucun cas réel",
        "Décrire les matériaux comme « premium » sans nommer de marque",
      ],
      done: "Un patient peut lire une page et connaître le traitement, le prix à partir de avec ce qui est inclus, les jours, le jour du retour et qui l'opère, puis écrire avec une date au lieu d'un « combien ».",
    },
    {
      id: "credentials",
      title: "Des références qu'un patient peut vérifier",
      promise: "Après ce chapitre, chaque médecin aura une page de profil qu'un patient peut vérifier, et les accréditations de la clinique seront affichées là où elles lèvent le doute au lieu de décorer le pied de page.",
      minutes: 5,
      why: [
        "Un patient qui prend l'avion pour un autre pays a besoin d'une raison de vous faire confiance avant d'écrire. Noms, diplômes, affiliations, années, nombre d'interventions : voilà ce qui la donne. Les photos de banque d'images et « équipe d'experts » ne la donnent pas, et le doute reste jusqu'à ce qu'un concurrent le lève.",
        "Les patients ont lu les mises en garde sur les cliniques à l'étranger. Ils cherchent le nom du médecin et le tapent dans Google. Si la recherche ne donne rien, ou donne une autre clinique, vous perdez un patient qui était prêt.",
        "Ce chapitre coûte un photographe pour une matinée et une heure par médecin. Il rapporte sur chaque page.",
      ],
      steps: [
        {
          title: "Une page de profil par médecin",
          body: "Nom réel tel qu'enregistré, photo professionnelle prise à la clinique, titre, spécialité, années de pratique et traitements pratiqués. Reliez le profil depuis chaque page de traitement où il apparaît, et dans l'autre sens.",
        },
        {
          title: "Listez ce qui peut être vérifié",
          body: "Université et année, formation de spécialité, numéro d'inscription professionnelle le cas échéant, affiliations à des associations nommées, et nombre approximatif d'interventions. Chaque élément doit pouvoir être vérifié par un patient ou son médecin local.",
        },
        {
          title: "Montrez les accréditations là où elles comptent",
          body: "Placez les licences et accréditations de la clinique sur la page à propos et dans la ligne de confiance de chaque page de traitement, chacune avec l'organisme émetteur nommé et relié. Si l'autorisation turque de tourisme de santé international vous concerne, affichez-la ; les patients des marchés réglementés la cherchent.",
        },
        {
          title: "Retirez ce qui ne peut pas être prouvé",
          body: "« Meilleure clinique de Turquie », « de classe mondiale », « numéro un ». Remplacez chacun par un fait : années, chiffres, noms. Un fait invite à vérifier ; un slogan invite à douter.",
        },
        {
          title: "Ajoutez les personnes que les patients rencontreront vraiment",
          body: "Les coordinateurs avec photos, noms et langues. Le premier contact du patient est un coordinateur, pas un chirurgien, et un visage avec un nom rend le premier message plus facile à envoyer.",
        },
        {
          title: "Tenez à jour",
          body: "Quand un médecin arrive ou part, mettez à jour les profils et les pages de traitement la même semaine dans chaque langue. Un profil de médecin parti est une réclamation en attente.",
        },
      ],
      checklist: [
        "Page de profil par médecin avec une vraie photo prise à la clinique",
        "Diplômes, inscription, affiliations et années listés et vérifiables",
        "Nombre approximatif d'interventions par traitement principal",
        "Profils reliés depuis et vers les pages de traitement",
        "Accréditations affichées avec organisme émetteur nommé et relié",
        "Superlatifs invérifiables retirés de chaque page",
        "Coordinateurs présentés avec noms, photos et langues",
        "Profils mis à jour dans toutes les langues quand l'équipe change",
      ],
      templates: [
        {
          id: "doctor-profile",
          title: "Modèle de profil de médecin",
          kind: "text",
          note: "Un par médecin. Gardez les faits vérifiables ; ne mettez rien que vous ne voudriez pas qu'un patient cherche.",
          body: `Nom : Dr [Prénom Nom], [chirurgien-dentiste / médecin / titre de spécialiste]
Rôle à la clinique : [par ex. chirurgien implantologue, responsable de l'équipe implants]
Langues : [turc, anglais ; consultations en français avec un coordinateur]
Années de pratique : [n]
Interventions : [par ex. environ n implants par an ; n arcades complètes depuis année]

Formation
- [Université], [diplôme], [année]
- [Formation de spécialité ou internat], [établissement], [année]
- [Fellowship ou formation avancée], [établissement], [année]

Inscription et affiliations
- [Ordre professionnel ou registre], n° [numéro]
- [Nom de l'association], membre depuis [année]

Traitements pratiqués ici
- [Traitement 1] [lien]
- [Traitement 2] [lien]

En ses mots (2 à 3 phrases, simples)
« [Comment il planifie un cas, ce qu'il dit aux patients avant le voyage, ce qu'il refuse de faire.] »

Avis de patients
[2 citations courtes avec prénom, pays et traitement, tirées d'avis que vous pouvez relier]

[Bouton WhatsApp : Poser une question au Dr [Nom]]`,
        },
      ],
      mistakes: [
        "Photos de banque d'images de mannequins en blouse blanche",
        "« Notre équipe d'experts » sans aucun nom, donc rien ne peut être recherché",
        "Logos d'accréditation dans le pied de page sans lien vers l'organisme",
        "Des profils qui affichent encore un médecin parti l'an dernier",
      ],
      done: "Un patient peut chercher le nom de chaque médecin et trouver les mêmes faits que sur votre page de profil, et cliquer vers chaque organisme d'accréditation.",
    },
    {
      id: "gallery",
      title: "Des résultats avant-après avec consentement",
      promise: "Après ce chapitre, vous aurez une galerie classée par traitement, photographiée de la même façon à chaque fois, avec un consentement écrit archivé pour chaque cas, pour que les patients vous comparent sur les résultats plutôt que sur le prix.",
      minutes: 5,
      why: [
        "Les résultats sont votre preuve la plus forte. Sans eux, le patient vous compare sur le prix, et sur le prix il y a toujours moins cher. Six bons cas par traitement font plus que n'importe quel paragraphe.",
        "Sans consentement, vous êtes à une réclamation près de devoir retirer toute la galerie, et un patient qui découvre son visage sur votre site sans avoir accepté est un avis dont vous ne vous remettrez pas.",
        "Les règles sont simples : même angle, même lumière, une légende courte, un consentement écrit. Le plus dur, c'est de créer l'habitude.",
      ],
      steps: [
        {
          title: "Fixez la prise de vue standard par traitement",
          body: "Pour les dents : sourire avec écarteur et sourire naturel de face, même distance, même lumière. Pour les cheveux : face, dessus et les deux côtés, cheveux secs, même fond. Pour le visage : face et profil, sans maquillage, expression neutre. Écrivez-le sur une fiche dans la salle de soins.",
        },
        {
          title: "Prenez la photo avant, à chaque fois",
          body: "À la première visite, avant tout geste, en suivant la fiche. La photo après au contrôle final, puis au suivi quand le résultat est stabilisé. L'habitude, c'est toute la méthode.",
        },
        {
          title: "Obtenez le consentement par écrit, dans la langue du patient",
          body: "Un formulaire d'une page qui dit ce qui sera montré, où, pendant combien de temps, si le visage est masqué, et que le patient peut se rétracter. Conservez-le avec le dossier. Ceci n'est pas un conseil juridique ; faites vérifier le formulaire par votre avocat selon le droit qui s'applique à vous.",
        },
        {
          title: "Légendez chaque cas avec trois faits",
          body: "Tranche d'âge, ce qui a été fait, nombre de jours à Istanbul. Pas de nom. Par exemple : « 40 ans et plus, All-on-4 haut et bas, 2 séjours de 6 jours. » C'est ce qu'un patient qui compare veut savoir.",
        },
        {
          title: "Classez par traitement et placez les cas sur la page de traitement",
          body: "Une page galerie, c'est bien ; trois à six cas sur la page de traitement elle-même, c'est mieux, car c'est là que le patient décide. Montrez l'avant et l'après côte à côte, à la même taille.",
        },
        {
          title: "Dites ce que vous ne montrez pas",
          body: "Si un résultat varie, dites-le sous la galerie en une phrase. Si des visages sont masqués, dites que c'est à la demande du patient. L'honnêteté sur les limites rend les résultats montrés crédibles.",
        },
      ],
      checklist: [
        "Une prise de vue standard écrite par traitement, visible dans la salle de soins",
        "Photo avant prise à la première visite pour chaque patient",
        "Photo après au contrôle final et au suivi",
        "Formulaire de consentement signé dans la langue du patient, archivé avec le dossier",
        "Légende avec tranche d'âge, traitement et jours pour chaque cas",
        "Trois à six cas sur chaque page de traitement, même taille côte à côte",
        "Visages masqués à la demande, et indiqué comme tel",
        "Une phrase sous la galerie sur la variabilité des résultats",
      ],
      templates: [
        {
          id: "consent-checklist",
          title: "Liste de contrôle du consentement avant-après (pas un conseil juridique)",
          kind: "text",
          note: "Un point de départ pour votre avocat, pas un remplacement. Les lois diffèrent selon les pays, et les patients de l'UE, du Royaume-Uni et du Golfe n'ont pas les mêmes attentes.",
          body: `Avant la photo
- Le patient sait que les photos servent d'abord à son dossier médical ; la publication est une décision séparée et facultative
- Angles et lumière standard, aucun élément identifiant (bijoux, tatouages) sauf accord du patient

Le formulaire de consentement doit préciser
- Le nom de la clinique et le nom complet du patient
- Exactement ce qui sera publié : photos avant et après de [zone], visage visible / yeux masqués / visage recadré
- Où : site de la clinique, comptes de réseaux sociaux (les nommer), supports imprimés
- Pour combien de temps, et que le patient peut retirer son consentement à tout moment par e-mail ou WhatsApp, après quoi les images sont retirées sous [n] jours
- Qu'aucun nom, nationalité ou autre détail personnel ne sera affiché sans accord séparé
- Que le patient ne reçoit aucune contrepartie, ou laquelle
- Date, signature, et une copie pour le patient dans sa langue

Conservation
- Formulaire signé conservé avec le dossier du patient, relié aux fichiers image par numéro de cas
- Une liste (tableur) des cas publiés : numéro de cas, traitement, lieu de publication, date du consentement, date de retrait le cas échéant

Avant de publier
- Vérifier que le formulaire est signé et correspond à ce que vous allez publier
- Vérifier que la légende ne contient ni nom ni âge exact
- Vérifier que la photo après montre un résultat stabilisé, pas le jour du traitement

À demander à votre avocat
- La loi sur les données personnelles qui s'applique au pays du patient, pas seulement au vôtre
- Les mineurs et les patients qui ne peuvent pas consentir eux-mêmes
- Les règles de votre ordre professionnel sur la publicité des résultats`,
        },
      ],
      mistakes: [
        "Angle et lumière différents entre l'avant et l'après, ce qui ressemble à une tromperie",
        "Consentement oral seulement, ou une ligne cachée dans le contrat de soins général",
        "Une galerie sans légendes, donc le patient ne sait pas ce qui a été fait",
        "Montrer le résultat le jour du traitement, avant que le gonflement ait disparu",
      ],
      done: "Chaque page de traitement montre au moins trois cas légendés photographiés selon le même standard, et vous pouvez sortir le consentement signé de n'importe lequel en une minute.",
    },
    {
      id: "booking",
      title: "Un chemin clair de l'intérêt à la consultation réservée",
      promise: "Après ce chapitre, un patient pourra demander une consultation depuis n'importe quelle page en moins d'une minute, recevoir une confirmation immédiate et savoir exactement ce qui se passe ensuite.",
      minutes: 5,
      why: [
        "Certains patients préfèrent un formulaire à WhatsApp, surtout en Europe et au Royaume-Uni, et surtout le proche qui fait les recherches pour quelqu'un d'autre. Si la seule option est un chat, ils remettent à plus tard, et plus tard veut dire perdu.",
        "Un formulaire qui pose onze questions, ou qui envoie le patient vers une page de remerciement muette, perd même ceux qui l'ont rempli. Le patient ne sait pas si quelque chose s'est passé. Le lendemain, il écrit à quelqu'un d'autre.",
        "La solution : un formulaire court, une page de remerciement qui dit la suite, et un message de confirmation en quelques minutes.",
      ],
      steps: [
        {
          title: "Demandez cinq choses, pas quinze",
          body: "Nom, pays, WhatsApp ou téléphone, traitement souhaité, mois de voyage envisagé. Tout le reste peut être demandé dans la première réponse. Un envoi de photo facultatif est utile pour le dentaire et les cheveux ; gardez-le facultatif.",
        },
        {
          title: "Placez le formulaire là où la décision se prend",
          body: "En bas de chaque page de traitement, après le prix et la FAQ, à côté du bouton WhatsApp. Aussi sur une page consultation dédiée, reliée depuis l'en-tête, pour les patients qui la cherchent.",
        },
        {
          title: "Faites travailler la page de remerciement",
          body: "Après l'envoi : « Merci, [coordinateur] vous répondra sur WhatsApp sous [délai]. En attendant, voici à quoi ressemble le voyage », avec un lien vers la page parcours et le profil du médecin. C'est aussi sur cette page que vous comptez les conversions.",
        },
        {
          title: "Envoyez une confirmation en quelques minutes",
          body: "Un e-mail et, si possible, un message WhatsApp depuis le numéro de la clinique, dans la langue du patient, avec le nom du coordinateur et les trois questions de qualification. Le modèle ci-dessous donne le message.",
        },
        {
          title: "Dirigez la demande vers une personne nommée",
          body: "Chaque envoi de formulaire va au coordinateur de cette langue, avec un remplaçant, et est consigné dans votre suivi (chapitre 9). Une boîte de réception sans responsable, c'est là que les demandes meurent.",
        },
        {
          title: "Proposez un créneau, pas un « nous vous contacterons »",
          body: "Pour les consultations vidéo, laissez le patient choisir un créneau ou proposez deux options dans la première réponse. Un horaire concret transforme une demande en rendez-vous.",
        },
      ],
      checklist: [
        "Formulaire à cinq champs, traitement et mois de voyage compris",
        "Formulaire en bas de chaque page de traitement et sur une page consultation",
        "Fonctionne dans chaque langue, erreurs affichées dans cette langue",
        "La page de remerciement indique le délai de réponse et relie la page parcours",
        "E-mail et WhatsApp de confirmation envoyés automatiquement en quelques minutes",
        "Demande dirigée vers un coordinateur nommé avec un remplaçant",
        "Créneau de consultation vidéo proposé dans la première réponse",
        "Envois de formulaire comptés comme conversion dans l'outil d'analyse",
      ],
      templates: [
        {
          id: "inquiry-form",
          title: "Champs du formulaire de consultation et page de remerciement",
          kind: "text",
          note: "Libellés des champs et texte de remerciement. Gardez l'ordre ; la liste des traitements doit correspondre à vos pages de traitement.",
          body: `Titre du formulaire : Recevez votre plan écrit

Champs
1. Votre nom (texte, obligatoire)
2. Pays (liste, obligatoire)
3. Numéro WhatsApp ou téléphone (tel, obligatoire) avec indicatif
4. Traitement (liste, obligatoire) : Implants dentaires / All-on-4 / Facettes / Greffe de cheveux / Rhinoplastie / Autre
5. Quand pourriez-vous venir ? (liste, obligatoire) : Sous 1 mois / 1 à 3 mois / 3 à 6 mois / Pas encore sûr
6. Photo ou radio (fichier, facultatif, jusqu'à 3 fichiers)
7. Ce que vous voulez que le médecin sache (texte, facultatif)
Ligne de consentement : « J'accepte que [Clinique] me contacte au sujet de ma demande. » (case à cocher, obligatoire)
Bouton : Envoyer ma demande

Champs cachés (pour le suivi, chapitre 9) : URL de la page, langue, utm_source, utm_medium, utm_campaign, gclid

Page de remerciement
Titre : Merci, [prénom]. Votre demande est arrivée chez [coordinateur].
Texte : « Vous aurez de nos nouvelles sur WhatsApp sous [15 minutes, de 9 h à 20 h heure d'Istanbul]. [Coordinateur] vous demandera une photo si vous n'en avez pas joint, et notre médecin préparera votre plan écrit sous [24 heures]. »
Liens : À quoi ressemble votre voyage [page parcours] / Rencontrez le [Dr Nom] [profil]
Secondaire : « Vous préférez parler maintenant ? Écrivez-nous sur WhatsApp. » [bouton]`,
        },
        {
          id: "booking-confirmation",
          title: "Message de confirmation après l'envoi du formulaire",
          kind: "message",
          note: "Envoyé automatiquement depuis le numéro WhatsApp de la clinique ou par e-mail en quelques minutes, puis suivi par un humain.",
          body: `WhatsApp (FR) :
Bonjour [prénom], ici [coordinateur] de [Clinique]. J'ai bien reçu votre demande concernant [traitement]. Pour préparer votre plan avec notre médecin, pouvez-vous m'envoyer une photo [ou une radio] et me dire ce qui vous gêne le plus aujourd'hui ? Vous recevrez un plan écrit avec le prix et le nombre de jours sous [24 heures].

Objet de l'e-mail (FR) : Votre demande est bien arrivée chez [Clinique]

Corps de l'e-mail (FR) :
Bonjour [prénom],
Merci pour votre demande concernant [traitement]. Je suis [coordinateur] et je m'occupe de votre dossier.
Les prochaines étapes :
1. Je vous écris sur WhatsApp au [numéro] sous [délai].
2. Notre médecin étudie votre photo et prépare un plan écrit : traitements, prix, jours à Istanbul, ce qui est inclus.
3. Si le plan vous convient, nous proposons des dates et vous réservez vos vols. Nous nous occupons du reste.
En attendant, cette page explique tout le voyage : [lien parcours]
Cordialement,
[coordinateur], [Clinique]
[numéro WhatsApp] / [adresse de la clinique]

WhatsApp (EN) :
Hello [name], this is [coordinator] from [Clinic]. I received your request about [treatment]. To prepare your plan with our doctor, could you send me a photo [or X-ray] and tell me what bothers you most today? You will have a written plan with the price and the number of days within [24 hours].`,
        },
      ],
      mistakes: [
        "Un formulaire à douze champs obligatoires sans liste de traitements",
        "Une page de remerciement qui dit « Message envoyé » et rien d'autre",
        "Des demandes qui tombent dans une boîte partagée dont personne n'est responsable",
        "Une première réponse le jour ouvré suivant, quand le patient a déjà trois autres devis",
      ],
      done: "Envoyez une demande test depuis un téléphone dans chaque langue ; une confirmation arrive en quelques minutes, et un coordinateur nommé voit la demande dans le suivi avec sa source.",
    },
    {
      id: "tracking",
      title: "Savoir quelle page et quelle annonce a amené chaque patient",
      promise: "Après ce chapitre, chaque clic WhatsApp, appel et formulaire sera compté, chaque demande portera sa source, et vous pourrez renvoyer les patients réservés vers Google Ads pour que le budget suive les annonces qui remplissent la clinique.",
      minutes: 9,
      why: [
        "Sans suivi, chaque décision sur le site et les annonces est une supposition. Vous connaissez la dépense totale et le nombre de patients, mais pas quelle campagne, quelle langue ou quelle page les a produits. Alors le budget continue d'aller là où une agence rapporte des « clics ».",
        "Le manque coûte dans les deux sens : vous continuez de payer des campagnes qui produisent des conversations mais pas de réservations, et vous coupez des campagnes qui produisent discrètement les meilleurs patients parce que leurs clics paraissaient chers.",
        "Ce chapitre est le plus technique, et le plus rentable. Le tableur de suivi seul, tenu honnêtement pendant un mois, change votre façon de dépenser.",
      ],
      steps: [
        {
          title: "Installez un seul outil d'analyse, proprement",
          body: "Google Analytics 4 via Google Tag Manager, sur chaque page dans chaque langue, avec la bannière de consentement reliée pour respecter le choix du patient. Une propriété, un conteneur. Retirez les anciens pixels et les balises en double.",
        },
        {
          title: "Comptez les actions qui comptent",
          body: "Créez des événements de clic pour le bouton WhatsApp, les liens téléphone et l'envoi du formulaire (ou l'affichage de la page de remerciement). Marquez-les comme événements clés dans GA4. Transmettez la page, la langue et le traitement en paramètres pour voir quelles pages produisent des conversations.",
        },
        {
          title: "Nommez vos liens de campagne toujours de la même façon",
          body: "Chaque annonce, e-mail et lien social reçoit des paramètres UTM selon un seul modèle en minuscules : utm_source, utm_medium, utm_campaign, utm_content. La convention ci-dessous suffit. Un lien écrit de trois façons devient trois lignes dans vos rapports.",
        },
        {
          title: "Tenez un suivi des demandes",
          body: "Un tableur, une ligne par demande, avec les colonnes du modèle, rempli par le coordinateur qui la traite. Les colonnes « source » et « réservé ? » sont les deux qui paient tout l'effort. La colonne « statut » est ce que vous revoyez chaque lundi.",
        },
        {
          title: "Capturez l'identifiant de clic Google sur chaque demande",
          body: "Avec le marquage automatique activé dans Google Ads, chaque clic sur une annonce ajoute un paramètre gclid à l'URL de la page d'atterrissage. Stockez-le dans un champ caché du formulaire, et pour les demandes WhatsApp, notez la page et la campagne d'origine. Enregistrez-le sur la ligne de la demande.",
        },
        {
          title: "Renvoyez les patients réservés vers Google Ads",
          body: "Une fois par semaine, importez les demandes devenues réservations, avec leur identifiant de clic, l'heure et la valeur, comme conversions hors ligne. Les étapes ci-dessous sont standard. Après quelques semaines, Google peut optimiser pour les patients réservés plutôt que pour les clics.",
        },
        {
          title: "Revoyez une page de chiffres chaque semaine",
          body: "Demandes par source, par langue et par traitement ; réservations selon les mêmes axes ; coût par patient réservé par campagne. Quinze minutes le lundi. Coupez ce qui ne réserve pas, déplacez le budget vers ce qui réserve.",
        },
      ],
      checklist: [
        "GA4 via Tag Manager sur chaque page et chaque langue, consentement respecté",
        "Événements de clic pour WhatsApp, téléphone et formulaire, marqués comme événements clés",
        "Les événements portent la page, la langue et le traitement en paramètres",
        "Une convention UTM écrite et utilisée sur chaque lien de campagne",
        "Tableur de suivi avec une ligne par demande, tenu par les coordinateurs",
        "Marquage automatique Google Ads activé ; gclid stocké avec chaque demande par formulaire",
        "Import hebdomadaire des conversions hors ligne pour les patients réservés",
        "Revue hebdomadaire de 15 minutes des demandes et réservations par source",
      ],
      templates: [
        {
          id: "lead-tracker",
          title: "Suivi des demandes (CSV)",
          kind: "csv",
          note: "À coller dans une nouvelle feuille. En-têtes en anglais pour rester compatibles avec les imports. Valeurs de statut : new, replied, plan sent, booked, arrived, lost. La valeur est le total du plan dans votre devise.",
          body: `date,name,country,language,source,campaign,treatment,channel,status,booked,value,notes,gclid
2026-01-12,Sara M.,Arabie saoudite,ar,google,ar-dental-implants-search,All-on-4,whatsapp,plan sent,no,,A demandé l'hôtel pour un accompagnant ; relancer jeudi,
2026-01-13,Thomas L.,France,fr,meta,fr-hair-transplant-video,Greffe de cheveux FUE,form,booked,yes,2900,Voyage le 3 mars ; acompte payé,CjwKCA-exemple`,
        },
        {
          id: "ga4-events",
          title: "Liste de contrôle des événements GA4",
          kind: "table",
          note: "Créez chacun dans Tag Manager, puis marquez les trois événements clés dans GA4 sous Admin > Événements. Testez en mode aperçu avant de publier.",
          body: `| Nom de l'événement | Se déclenche quand | Paramètres | Événement clé ? |
|---|---|---|---|
| whatsapp_click | Clic sur un lien vers wa.me ou api.whatsapp.com | page_path, language, treatment, button_position | Oui |
| call_click | Clic sur un lien tel: | page_path, language, treatment | Oui |
| form_submit | Formulaire de consultation envoyé avec succès (ou page de remerciement affichée) | page_path, language, treatment, form_id | Oui |
| form_start | Premier champ du formulaire rempli | page_path, language, treatment | Non |
| language_switch | Sélecteur de langue utilisé | from_language, to_language | Non |
| treatment_view | Page de traitement affichée | treatment, language | Non |`,
        },
        {
          id: "utm-convention",
          title: "Convention de nommage UTM",
          kind: "text",
          note: "Minuscules, sans espaces, tirets à l'intérieur des valeurs. Écrivez-la une fois, partagez-la avec tous ceux qui créent un lien.",
          body: `utm_source  = d'où vient le clic : google, meta, instagram, tiktok, youtube, email, whatsapp, nom-partenaire
utm_medium  = type de trafic : cpc, paid-social, organic-social, email, referral
utm_campaign = langue-traitement-marché-objectif, par ex. ar-dental-implants-gulf-leads, fr-hair-transplant-fr-leads
utm_content = l'annonce ou l'emplacement précis, par ex. video-01, carousel-before-after, story-doctor
utm_term    = groupe de mots-clés pour les annonces de recherche seulement, par ex. implants-prix

Exemple :
https://clinique.com/fr/implants-dentaires?utm_source=google&utm_medium=cpc&utm_campaign=fr-dental-implants-fr-leads&utm_content=rsa-01

Règles
- Ne changez jamais un nom de campagne en cours de route ; créez-en une nouvelle
- Tenez une feuille de chaque lien créé, avec la date et l'auteur
- Le traitement dans utm_campaign doit correspondre à la page de traitement d'arrivée`,
        },
        {
          id: "offline-import",
          title: "Import de conversions hors ligne dans Google Ads, pas à pas",
          kind: "text",
          note: "Procédure standard de Google Ads. Votre développeur ou gestionnaire de campagnes fait les étapes 1 à 3 une fois ; un coordinateur peut faire l'étape 4 chaque semaine.",
          body: `1. Activez le marquage automatique
Google Ads > Admin > Paramètres du compte > Marquage automatique : activé. Chaque clic sur une annonce ajoute désormais ?gclid=... à l'URL de votre page d'atterrissage.

2. Capturez l'identifiant de clic sur le site
Ajoutez un champ caché nommé gclid à chaque formulaire. Un petit script lit gclid dans l'URL à l'arrivée, le stocke (cookie ou stockage local, 90 jours) et remplit le champ caché à l'envoi. Pour les demandes WhatsApp, notez plutôt la page d'arrivée et la campagne sur la ligne de la demande, et demandez à votre développeur les conversions améliorées pour les prospects (e-mail ou téléphone hachés) comme option à plus long terme.

3. Créez l'action de conversion
Google Ads > Objectifs > Conversions > Résumé > Nouvelle action de conversion > Importer > CRM, fichier ou autre source de données > Suivre les conversions issues des clics. Nommez-la « Patient réservé ». Catégorie : Prospect qualifié ou Prospect converti. Valeur : utiliser des valeurs différentes par conversion. Comptage : une. Fenêtre de conversion : 90 jours.

4. Importez chaque semaine
Exportez du suivi des demandes les lignes avec booked = yes et un gclid, dans une feuille avec exactement ces colonnes :
Google Click ID | Conversion Name | Conversion Time | Conversion Value | Conversion Currency
Format de Conversion Time : aaaa-mm-jj hh:mm:ss, avec votre fuseau horaire (par ex. « 2026-01-20 14:35:00 Europe/Istanbul »).
Google Ads > Objectifs > Conversions > Importations > importez le fichier (ou planifiez une feuille Google Sheets). Corrigez les lignes que l'aperçu rejette.

5. Laissez du temps
Après 3 à 4 imports hebdomadaires avec de vraies réservations, passez les campagnes en enchères sur « Patient réservé » au lieu des clics ou des prospects bruts. Suivez le coût par patient réservé, pas le coût par clic.`,
        },
      ],
      mistakes: [
        "Rapporter des « clics » et des « prospects » mais jamais des « réservés », donc les annonces s'optimisent pour des conversations qui ne voyagent jamais",
        "Trois balises d'analyse de trois agences, chacune comptant différemment",
        "Des liens UTM tapés à la main avec des majuscules et des espaces",
        "Un suivi des demandes rempli uniquement par l'agence, donc les réservations ne reviennent jamais vers les annonces",
      ],
      done: "Le lundi, vous pouvez dire, depuis une seule feuille, combien de demandes et de réservations chaque langue et chaque campagne a produites la semaine dernière, et Google Ads affiche les patients réservés comme conversion.",
    },
    {
      id: "feedback",
      title: "Des avis et un suivi qui amènent le patient suivant",
      promise: "Après ce chapitre, vous aurez une routine simple qui demande un avis à chaque patient satisfait au bon moment, répond à chaque avis et garde le contact après le retour, pour que la preuve sur le site grandisse chaque mois ; et le plan 30 jours en fin de chapitre transforme tout cela en calendrier.",
      minutes: 7,
      why: [
        "Un patient qui compare des cliniques à l'étranger lit les avis avant de lire vos pages. Dix avis récents qui nomment le traitement, sur une fiche où vous répondez, pèsent plus que cent avis anciens. Un avis de la semaine dernière prouve que la clinique est vivante et travaille encore.",
        "Le suivi après le retour est la source des recommandations. Les patients qui ont des nouvelles de la clinique à une semaine, un mois et six mois en parlent à leurs amis. Ceux qui n'entendent plus rien après le paiement racontent une autre histoire.",
        "Rien de tout cela n'exige de logiciel. Il faut un moment choisi à l'avance, un message enregistré, et quelqu'un dont c'est le travail.",
      ],
      steps: [
        {
          title: "Choisissez le moment",
          body: "Demandez au dernier rendez-vous à Istanbul, quand le résultat est visible et que le coordinateur est dans la pièce, ou dans le message de suivi à une semaine. Pas le premier jour, pas trois mois plus tard.",
        },
        {
          title: "Faites-en un lien à un clic",
          body: "Envoyez le lien direct vers le formulaire d'avis de votre fiche Google Business Profile, ou la plateforme qu'utilise votre marché. Demandez de mentionner le traitement et le pays ; c'est ce que cherche le prochain patient du même pays.",
        },
        {
          title: "Répondez à chaque avis sous une semaine",
          body: "Remerciez par le prénom, nommez le traitement, une ligne personnelle. Pour les avis négatifs : excusez-vous, dites ce que vous avez fait, déplacez la conversation sur WhatsApp, et ne discutez jamais en public. Les futurs patients lisent les réponses plus que les étoiles.",
        },
        {
          title: "Mettez de vrais avis sur les pages de traitement",
          body: "Deux ou trois par traitement, avec prénom, pays et traitement, reliés à l'original pour que les patients puissent vérifier. Renouvelez-les chaque trimestre.",
        },
        {
          title: "Suivez le calendrier de relance",
          body: "Une semaine : comment allez-vous, une douleur, rappel des consignes. Un mois : court contrôle, demande d'avis si pas encore fait. Six mois : demande d'une photo récente et si un proche envisage un traitement. Messages enregistrés, envoyés par le coordinateur, consignés dans le suivi.",
        },
        {
          title: "Bouclez la boucle sur le site",
          body: "Chaque mois, ajoutez les nouveaux cas à la galerie, les nouveaux avis aux pages, et les questions posées par les patients à la FAQ. C'est ainsi qu'un bon site devient meilleur sans refonte.",
        },
      ],
      checklist: [
        "Moment de la demande d'avis décidé et inscrit dans la liste du coordinateur",
        "Lien d'avis à un clic enregistré en réponse rapide dans chaque langue",
        "Chaque avis reçoit une réponse sous une semaine, avec prénom et traitement",
        "Avis négatifs traités calmement et déplacés sur WhatsApp",
        "Deux ou trois avis reliés sur chaque page de traitement",
        "Messages de suivi à une semaine, un mois et six mois enregistrés et envoyés",
        "Relances consignées dans le suivi des demandes",
        "Mise à jour mensuelle de la galerie, des avis et de la FAQ sur le site",
      ],
      templates: [
        {
          id: "review-request",
          title: "Demande d'avis et messages de suivi",
          kind: "message",
          note: "À envoyer depuis le numéro WhatsApp de la clinique. Remplacez le lien par votre lien d'avis direct.",
          body: `Demande d'avis, dernier rendez-vous ou une semaine après (FR) :
Bonjour [prénom], ce fut un plaisir de vous accompagner. Si vous êtes satisfait de votre [traitement], un court avis aide les patients de [pays] qui hésitent en ce moment. Cela prend une minute : [lien d'avis]. Si possible, mentionnez le traitement et d'où vous êtes venu. Merci, [coordinateur].

Suivi à une semaine (FR) :
Bonjour [prénom], une semaine depuis votre retour. Comment vous sentez-vous ? Une douleur, un gonflement, une question sur les consignes ? Répondez ici à tout moment ; le [Dr Nom] voit vos messages le jour même.

Suivi à un mois (FR) :
Bonjour [prénom], déjà un mois. Tout se stabilise bien ? Si vous avez un instant, une photo aide le médecin à vérifier d'ici. Et si vous n'avez pas eu le temps pour l'avis, le lien est ici : [lien d'avis].

Suivi à six mois (FR) :
Bonjour [prénom], six mois depuis votre [traitement]. Nous aimerions une photo récente pour votre dossier. Si un ami ou un proche envisage un traitement à Istanbul, nous préparons volontiers un plan pour lui aussi ; il suffit de lui transmettre ce numéro.

Réponse à un avis positif (FR) :
Merci, [prénom]. Ce fut un plaisir de prendre soin de votre [traitement], et nous espérons que le retour d'Istanbul s'est bien passé. L'équipe vous salue, et nous attendons votre photo des six mois.

Réponse à un avis négatif (FR) :
[Prénom], merci de nous l'avoir dit, et je suis désolé que cela ait été votre expérience. J'ai consulté votre dossier et [ce que vous avez fait ou allez faire]. Je souhaite régler cela correctement ; écrivez-moi directement au [numéro] pour que je puisse vous aider. [Nom, fonction].

Demande d'avis (EN) :
Hello [name], it was a pleasure to look after you. If you are happy with your [treatment], a short review helps patients from [country] who are deciding now. It takes a minute: [review link]. Thank you, [coordinator].`,
        },
        {
          id: "plan-30-days",
          title: "Le plan 30 jours (et la version 2 heures par semaine)",
          kind: "text",
          note: "Quatre semaines, dans l'ordre qui fait bouger les demandes le plus vite. La version courte est pour un responsable qui ne peut donner que deux heures par semaine.",
          body: `Semaine 1 : Capter (chapitres 3 et 8)
- Numéro WhatsApp Business, profil, horaires, message d'absence dans chaque langue
- Bouton pré-rempli sur chaque page de traitement, fixé en bas sur téléphone
- Scripts de première réponse enregistrés ; délai de réponse écrit sur le site
- Formulaire réduit à cinq champs ; page de remerciement et message de confirmation en ligne
- Suivi des demandes commencé aujourd'hui, même sur papier

Semaine 2 : Répondre (chapitres 5 et 2)
- Une page de traitement refaite selon le plan : prix à partir de, inclusions, jours, médecin, FAQ
- Tableau des prix ajouté
- Page parcours écrite à partir des dix questions des coordinateurs
- Résumé en trois lignes du parcours sur chaque page de traitement

Semaine 3 : Rassurer (chapitres 6, 7 et 10)
- Profils de médecins avec faits vérifiables ; superlatifs retirés
- Fiches de prise de vue standard dans les salles de soins ; formulaire de consentement chez l'avocat
- Lien d'avis enregistré ; chaque avis en attente traité ; messages de suivi enregistrés

Semaine 4 : Mesurer et accélérer (chapitres 9, 4 et 1)
- Événements GA4 pour WhatsApp, appel et formulaire ; convention UTM partagée
- Marquage automatique activé ; gclid capturé ; premier import hors ligne fait
- Images compressées, vidéo et carrousels retirés, journal de vitesse commencé
- Brief de traduction envoyé pour la première langue ; le reste des pages planifié

Si vous n'avez que 2 heures par semaine
- Semaine 1 : bouton WhatsApp pré-rempli sur chaque page de traitement ; script de première réponse
- Semaine 2 : refaire une page de traitement (votre traitement le plus vendu) avec prix, jours et FAQ
- Semaine 3 : commencer le suivi des demandes ; demander un avis à chaque patient qui repart
- Semaine 4 : compresser les images et retirer la vidéo d'accueil ; réserver votre développeur pour les événements GA4
Tout le reste passe au deuxième mois, un chapitre par semaine, la réponse d'audit la plus faible en premier.`,
        },
      ],
      mistakes: [
        "Demander les avis par e-mail un mois plus tard, quand le moment est passé",
        "Laisser les avis négatifs sans réponse, ou y répondre par une dispute",
        "Des témoignages sur le site sans nom, pays ni lien, qui semblent inventés",
        "Aucun contact après le paiement, donc le patient qui aurait recommandé trois amis n'en recommande aucun",
      ],
      done: "Chaque patient reparti le mois dernier s'est vu demander un avis au moment convenu, chaque avis a une réponse, et le suivi à une semaine est parti à l'heure.",
    },
  ],
  quickWins: [
    "Ajoutez un bouton WhatsApp pré-rempli, fixé en bas sur téléphone, à votre page de traitement la plus visitée",
    "Écrivez et enregistrez le script de première réponse avec trois questions de qualification dans chaque langue",
    "Définissez les horaires WhatsApp Business et un message d'absence qui demande une photo et le pays",
    "Mettez un prix « à partir de » avec trois inclusions sur votre page de traitement la plus vendue",
    "Ajoutez trois lignes à chaque page de traitement : jours à Istanbul, jour du retour, ce qui est inclus",
    "Remplacez « meilleure clinique » et « de classe mondiale » par un fait vérifiable chacun",
    "Compressez les dix images les plus lourdes en WebP sous 200 Ko",
    "Retirez la vidéo d'accueil et remplacez-la par une seule photo",
    "Réduisez le formulaire de contact à cinq champs et écrivez une page de remerciement qui indique le délai de réponse",
    "Ouvrez un tableur avec les colonnes du suivi des demandes et consignez les demandes d'aujourd'hui",
  ],
  summary: [
    "Les patients à l'étranger présélectionnent sur les sites, sur un téléphone, dans leur langue, avant de contacter qui que ce soit.",
    "Le premier message arrive presque toujours par WhatsApp depuis une page de traitement ; mettez le bouton là, pré-rempli.",
    "Répondez en quelques minutes avec trois questions, pas avec « comment pouvons-nous vous aider ».",
    "Répondez au prix et aux jours ouvertement : un prix à partir de avec ce qui est inclus, les jours à Istanbul, le jour du retour.",
    "Une page explique tout le voyage, dans l'ordre du patient, avec une personne nommée à chaque étape.",
    "La confiance se construit avec des faits vérifiables : médecins nommés, accréditations reliées, résultats légendés avec consentement.",
    "La vitesse protège tout le reste : pages de traitement sous 2,5 secondes sur un vrai téléphone.",
    "Mesurez les clics, consignez chaque demande avec sa source, renvoyez les patients réservés vers Google Ads chaque semaine.",
    "Demandez l'avis au dernier rendez-vous ; relancez à une semaine, un mois, six mois.",
    "Si vous préférez le faire faire : le pack Site Clinique construit les chapitres 1 à 8, et le Système de Croissance Clinique ajoute le suivi, le CRM et la liaison avec les annonces des chapitres 9 et 10.",
  ],
};
