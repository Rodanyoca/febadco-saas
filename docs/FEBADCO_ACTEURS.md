# Raccordement des pages Acteurs — 6 novembre 2026

## Périmètre effectivement raccordé

Demande explicite utilisateur : six pages réelles, sans authentification définie pour le moment. ATHLETES, COACHS, ARBITRES, OFFICIELS, MEDECINS et AUTRES sont lus dans le classeur FEBADCO configuré. Aucune modification d'un autre dépôt, aucune migration ni écriture métier. La consultation est raccordée ; création, modification, attribution d'identifiants et médias ne sont pas déclarés implémentés. Le verrou HTTP 409 des écritures reste conservé. Ce lot ne prétend pas satisfaire l'ensemble du lot Acteurs initial sur les mutations et l'allocation concurrente d'identifiants.

Les instructions historiques FEACO/athlétisme ne déterminent plus le profil badminton. L'utilisateur a confirmé de ne pas ajouter d'authentification dans cette intervention ; aucun champ de passeport ni fichier privé n'est renvoyé par les nouveaux lecteurs. Les coordonnées ordinaires sont accessibles uniquement à la demande de consultation via la nouvelle route, sans authentification conformément au choix utilisateur. Il n'y a aucun contrôle d'accès inventé ou permission implicite annoncée.

## Écarts corrigés

Avant : pages encore liées à lib/data et actor-records, références volleyball et appels clubs/équipes/affiliations/licences ; lecteurs de démonstration désactivés, donc parcours non raccordés. Date de naissance athlète attendue sous date_de_naissance, incompatible avec date_naissance FEBADCO. Champs FIVB/national sans équivalent métier.

Après : six pages fines utilisent FebadcoActorsPage et le même client de consultation. Identifiant fédéral permanent affiché en Licence, référence BWF externe facultative, date d'affiliation directe, statut et champs de catégorie. Aucun historique club, transfert ou licence saisonnière chargé. Aucun contenu fictif applicatif, aucun repli démo si la source échoue. Le composant ActorTable et les primitives existantes sont réutilisés, avec ID BWF et icône de personne en l'absence de photo. Les anciens fichiers et routes héritées sont conservés sans être utilisés par ces pages ; ils ne sont pas annoncés raccordés.

## Mapping

Commun : clé propre à la feuille → id, nom_complet → name, id_bwf → bwf lorsqu'il existe, id_sexe → SEXES.nom_sexe, date_naissance → birth, nationalite → nationality, date_affiliation → affiliation, statut → STATUTS_ACTEURS.nom_statut_acteur. Champs manquants facultatifs vides ; aucun identifiant ou date inventé. Identifiant vide exclu, identifiant dupliqué conservé une seule fois avec alerte d'anomalie ; aucune fusion ni correction distante.

| Feuille | Clé | Champ particulier / référentiel |
|---|---|---|
| ATHLETES | id_athlete | Aucun |
| COACHS | id_coach | id_niveau → NIVEAU_COACH(id_niveau, nom_niveau) |
| ARBITRES | id_arbitre | id_grade_arbitre → GRADES_ARBITRES(id_grade_arbitre, nom_grade_arbitre) |
| OFFICIELS | id_officiel | Aucun |
| MEDECINS | id_medecin | id_specialite → SPECIALITES_MEDECIN(id_specialite, nom_specialite) |
| AUTRES | id_autre_acteur | id_type_autre_acteur → TYPES_AUTRES_ACTEURS(id_type_autre_acteur, nom_type_autre_acteur) |

Les quatre référentiels spécifiques ont été inspectés en lecture seule (en-têtes, valeurs administratives et notes). Leur présence ne certifie pas une qualification. Une valeur absente du référentiel reste « Non référencé (identifiant) », sans catégorie inventée.

Coordonnées à l'ouverture : lieu_naissance, telephone, email, adresse, observations uniquement lorsqu'ils existent. Le serveur recherche d'abord l'identifiant dans sa colonne, refuse un inconnu ou un doublon puis lit seulement les cellules de la ligne ciblée. Aucune lecture du numéro de passeport, de ses dates ou des identifiants/liens Drive. La route GET /api/febadco/actors/[kind]/[id] valide la catégorie, répond 404/409/503 sans erreur Google brute et impose Cache-Control private,no-store.

## Google, CPU et états

Liste : 4 batchGet, soit en-têtes puis colonnes projetées dans Acteurs et Référentiel, les deux classeurs lus en parallèle. Référentiels inutilisés ignorés ; index Map pour les libellés ; projection des seules colonnes nécessaires. Tri via comparateur français partagé. Recherche nom/licence/BWF, filtres sexe/statut/qualification, tri, pagination et taille de page sont locaux, sans requête réseau. Taille 10/25/50/100, changement de filtre/recherche/tri/taille revient page 1 sans perdre les autres critères ; zéro résultat affiche 0–0 sur 0.

Fiche : données générales déjà présentes, 3 batchGet au maximum pour les seules coordonnées (en-têtes, colonne identifiant, cellules ciblées), 0 Drive et aucun binaire. Chargement des coordonnées distinct, erreur avec Réessayer manuel. AbortController et drapeau d'annulation protègent les changements rapides de fiche et la fermeture. Aucune réponse tardive n'est appliquée à une autre personne. Pas de polling, pas de cache persistant, pas de retry automatique ; timeout Google 15 secondes par requête. Le lecteur partagé déduplique les mêmes requêtes en cours et libère toute réponse ou erreur. Le tableau de bord utilise désormais ce même lecteur ; ses agrégats ne changent pas.

Référence précédente : lecteurs désactivés, 0 appel Google mais aucune donnée réelle. Ce n'est pas une base pertinente pour annoncer une économie CPU. Les 4 batchs de liste et 3 maximum de fiche sont vérifiés dans les tests ; aucun gain CPU Vercel annoncé. Aucun test de charge. Les mesures synthétiques du socle restent dans docs/performance/lot1.

## Variables

GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, FEBADCO_ACTEURS_SPREADSHEET_ID et FEBADCO_REFERENTIELS_SPREADSHEET_ID : présence vérifiée sans valeur affichée. Aucune variable supplémentaire nécessaire pour les lectures. Les cinq classeurs du profil restent exigés par le contrôle de configuration commun, déjà renseignés.

Absentes, uniquement pour une future activation médias : GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_DRIVE_ROOT_FOLDER_ID et GOOGLE_DRIVE_PASSPORTS_FOLDER_ID. Les saisir soi-même dans .env.local ; jamais dans la conversation. L'OAuth doit appartenir à un compte autorisé FEBADCO ayant accès aux seuls dossiers privés concernés. Aucun dossier ni compte Google créé ou partagé automatiquement. Aucune clé fictive d'authentification ajoutée. Le modèle .env.example ne contient que des valeurs fictives ou vides.

## Validation et limites

Six tests du domaine Acteurs couvrent les six catégories, colonnes réordonnées, références résolues/inconnues, zéros, champs facultatifs vides, doublons, données incomplètes, source en panne/refus, projection excluant le passeport et recherche préalable des fiches inconnues/ambiguës. Dix tests du lecteur et du tableau de bord restent réussis. Le premier test d'exclusion du passeport a été corrigé : il interdisait aussi la colonne A des référentiels, pourtant nécessaire à leurs identifiants ; il vérifie désormais uniquement la projection Acteurs. Premier TypeScript : propriétés du composant partagé manquantes dans leur type détectées et ajoutées, sans affaiblir le compilateur. TypeScript indépendant, lint et build normal réussis ; le nouveau endpoint est présent dans la sortie du build.

Le script verify-febadco-actors.mjs monte les vrais composants sur 32 acteurs synthétiques isolés, sans route de démonstration ajoutée au projet ni écriture Google. À 1440×900 et 390×844 : recherche BWF, filtres, pagination, changement de taille revenant page 1, état vide, détail, 0 appel pendant les filtres et 1 appel mock de coordonnées à l'ouverture, aucune erreur JavaScript ni débordement. Le scénario a ensuite été étendu : ouverture rapide de deux autres fiches avec première réponse retardée ; la réponse tardive n'écrase pas la dernière fiche. Total final : 3 appels pour 3 ouvertures, aucun appel de liste. 22 tests ciblés finaux réussis (6 Acteurs, 5 lecteur, 5 dashboard, 6 navigation). Captures synthétiques docs/performance/actors/. Le test utilise uniquement les installations existantes d'esbuild et Playwright du workspace comme outils, sans modifier leurs dépôts ni installer de dépendance.

Les pages réelles ont été contrôlées sans noms ni coordonnées dans les traces. Athlètes, Entraîneurs, Arbitres et Officiels : HTTP 200, recherche présente, aucune alerte de source ni mode démo ; Officiels sans débordement mobile. Plusieurs navigations successives du serveur de développement ont été interrompues par ERR_ABORTED ; une attente networkidle sur Médecins a aussi expiré. Ces interruptions de vérification ne sont pas masquées en succès métier. Les réponses serveur Médecins et Autres acteurs ont ensuite été vérifiées indépendamment du réseau navigateur : HTTP 200, champ de recherche présent, aucune erreur de source ni mode démo. Catégorie API inconnue : 404 avant appel Google. Les fiches réelles ne peuvent être affirmées testées si aucun acteur n'existe ; leur comportement est vérifié sur données synthétiques uniquement. Aucun ajout de personne, aucun upload, aucune écriture production.

Le lint ciblé du nouveau script CommonJS a détecté les imports require interdits et les globals de navigateur ; le script a été converti en module ESM, les globals de la callback navigateur explicités, sans désactiver la règle d'import du projet. Lint ciblé final réussi ; aucune validation TypeScript ou build affaiblie.

Retour arrière ciblé : retirer l'appel FebadcoActorsPage des six pages et restaurer leurs anciens imports uniquement si nécessaire, sans réactiver local-demo ; retirer le client/page et acteurs-domain/endpoint, conserver le lecteur partagé du tableau de bord ou restaurer son lecteur isolé. Ne pas utiliser git reset/clean : ce dépôt n'a toujours aucun commit. Ne pas exposer de fiche privée ni annoncer une mutation persistée lors du rollback.
