# FEBADCO — cahier des charges et suivi

## Référence et périmètre

Demande du 5 novembre 2026, dépôt réel `C:/Projets/SNDS-RDC/data/monosport/febadco-managment`. Branche `main` sans commit ni remote au début du lot. Tous les fichiers applicatifs sont non suivis. Les modifications antérieures d'identité/logo sont préservées. Les anciennes instructions FEACO/athlétisme et matrices historiques ne définissent plus le métier : la demande FEBADCO badminton prévaut.

Quatre blocs : Acteurs, Compétitions, Activités, Documents. Extension validée explicitement par l'utilisateur le 6 novembre 2026 : tableau de bord agrégé connecté à ces quatre blocs. Restent exclus : utilisateurs, territoire, transferts, licences saisonnières et module autonome équipes nationales. Références futures : FEBACO pour les interfaces, FEVOCO pour les optimisations réutilisables, COC pour les résultats internationaux et relations ; aucun autre dépôt modifié ni nouveau portage métier dans le lot 1.

Acteurs affiliés directement à la fédération, date dans la fiche ; identifiant permanent servant de licence gratuite à vie, référence BWF facultative. Aucun club/saison ni renouvellement. Compétitions internationales saisies manuellement : simples, paires et équipes, composition explicite, résultats et sets liés par id_resultat, rencontres par équipes comptées en matchs, distinctions officielles. Aucune programmation, qualification ou ranking automatique.

Interfaces : tableaux/recherche/filtres/tri/pagination/taille de page, panneaux latéraux, sections pertinentes, états distincts, conservation de saisie en erreur et prévention des doubles soumissions ; mobile et ordinateur. Champs inconnus vides. Passeports privés et absents des réponses de liste. Chaque lot doit vérifier les autorisations et relations avant toute mutation.

## Rapport d'écart du socle

| Écart constaté | Priorité / traitement |
|---|---|
| Démonstration issue du modèle FEACO/volleyball, anciennes règles sportives | Les cinq schémas réels sont inspectés avant les lots métier ; ne pas brancher les anciens mappers sur les données FEBADCO |
| Aucun mécanisme authentification/autorisation dans cette copie | Blocage d'exposition des données réelles et des écritures tant que le contrôle d'accès n'est pas défini ; pas de bloc Utilisateurs ajouté |
| Navigation expose territoire/licences/équipes/dashboard/paramètres | Retirés de la navigation ; clic sur l'identité vers Athlètes ; anciennes routes conservées, non sécurisées par le masquage |
| Lectures toujours locales et mutations HTTP 409 | Conservées en démonstration étiquetée ; nouveau socle de lecture distinct, uniquement utilisé par le contrôle local explicite |
| Anciens identifiants fictifs territorial/affiliations/licences/national | Vidés, aucun repli vers des classeurs archivés ; sources des futurs lots par variables FEBADCO |
| .gitignore ne protège pas .env et .env.production | Exclusions ajoutées, .env.example autorisé avec valeurs fictives |
| Scripts navigateur ancrés à l'ancien workspace | Ne pas annoncer leurs anciennes preuves comme actuelles ; contrôle ciblé du lot 1 avec installation Playwright déjà disponible |
| Aucun commit/historique de référence | Aucun reset, clean, commit ni push ; retour arrière manuel limité aux fichiers du lot |

## Tâches suivies

États : à faire → en cours → vérifié → validé par l'utilisateur. « Vérifié » technique ne vaut pas validation utilisateur.

| Lot / tâche | État | Critère |
|---|---|---|
| Extension — tableau de bord agrégé réel | vérifié | 16 tests ciblés, TypeScript, lint et build normal réussis ; navigateur ordinateur/mobile ; attend validation utilisateur |
| 1 — inventaire ciblé, audit sources et schémas | vérifié | Métadonnées/en-têtes/notes et références bornées, sans lignes métier |
| 1 — navigation des quatre blocs et protection Git | vérifié | Aucun lien vers les blocs exclus ; secrets et builds ignorés |
| 1 — modèle de variables et lecteur groupé sans persistance | vérifié | Configuration fermée si absente, déduplication en cours, tests |
| 1 — vérifications techniques et visuelles | vérifié | 23 tests, TypeScript, lint et build réussis ; navigation Chromium ordinateur/mobile, HTTP 409 local |
| 1 — saisie manuelle des sept variables par l'utilisateur | vérifié | Confirmation utilisateur puis configuration chargée sans valeur affichée le 6 novembre 2026 |
| 1 — contrôle local Google en lecture seule | vérifié | npm run check:google réussi : cinq blocs OK, dix lectures, zéro écriture et zéro ligne métier lue |
| 1 — validation utilisateur | à faire | « oui » explicite avant Acteurs |
| 2 — Acteurs : consultation réelle des six catégories | vérifié | Mappings, listes/filtres/tri/pagination/fiches et coordonnées à la demande ; 22 tests ciblés, TypeScript, lint et build ; voir FEBADCO_ACTEURS.md |
| 2 — Acteurs : création/modification/identifiants/médias | à faire | Non activés dans le raccordement des pages demandé ; dossiers/OAuth manquants pour les médias |
| 3 — Compétitions : unités/composition/intervenants/phases/résultats/sets/distinctions | à faire | Aucun moteur volleyball, références cohérentes et suppressions protégées |
| 4 — Activités : fiches/participants/organisations nécessaires/documents | à faire | Aucun rattachement territorial obligatoire ; participation ≠ qualification |
| 5 — Documents : fiches/pièces/relations/prévisualisation/téléchargement | à faire | Accès privé, formats/tailles, remplacement sans suppression silencieuse |
| 6 — vérification transversale et livraison locale | à faire | Tests métier, permissions, panne source, mesures séparées CPU/réseau et preuves |

## Connexions et sécurité

Correction du 6 novembre 2026 après signalement utilisateur : le mode démonstration est désactivé globalement. Les lecteurs historiques lib/google-sheets.ts rejettent les parcours non raccordés au lieu de lire local-demo.ts ; le fichier de fixtures reste archivé, sans import applicatif. Le bandeau de démonstration et sa prop Header ont été supprimés. La notice Acteurs indique « Raccordement en cours ». Le tableau de bord conserve son lecteur réel séparé ; les autres parcours ne sont pas déclarés connectés. Les écritures restent refusées, avec un message de module non activé. Une frontière d'erreur commune préserve la navigation en cas de lecture non raccordée. Aucun accès privé supplémentaire ni mutation Google activé.

Voir FEBADCO_CONFIGURATION.md pour les variables et FEBADCO_SCHEMAS.md pour les colonnes réellement observées. Le nouveau lecteur ne contient aucun secret ni identifiant de classeur codé en dur. Il n'est importé par aucune route publique. Les pages restent en démonstration et les écritures sont refusées par proxy et fonctions de persistance. Aucun contrôle d'accès existant n'a été retiré : il n'en existe pas dans cette copie. Avant de raccorder les lectures privées, il faut décider comment recevoir une session et des droits fiables, sans inventer un succès d'authentification ni développer le bloc Utilisateurs.

## Appels Google / CPU

Lot 1 : lecture groupée par classeur, plages identiques triées et dédupliquées ; une promesse par (classeur, ensemble de plages) pendant l'appel ; aucune réutilisation après résolution/rejet, aucun cache d'autorisation. Pas de cache persistant, donc pas d'invalidation après mutation à inventer. Timeout Google 15 s et retries désactivés sur le contrôle explicite ; aucun polling ni Drive. Le mapping respecte les en-têtes et rejette les doublons. Pas de récupération de données personnelles par le contrôle de connexion.

Chaque lot métier devra définir ses projections liste/détail, limites de lecture, enrichissements après filtrage et invalidations, puis comparer les scénarios identiques. Les mesures synthétiques du socle ne prouvent ni une économie Google réelle ni un gain CPU Vercel.

## Arrêts et retour arrière

Arrêt obligatoire à chaque lot pour validation explicite. Variables et connexion du compte de service vérifiées le 6 novembre 2026 ; le lot 1 attend le « oui » de validation avant le lot Acteurs. Aucun achat, migration, écriture métier distante, commit, push ou déploiement.

Retour arrière ciblé : retirer les liens simplifiés et restaurer lib/navigation.ts et son test ; restaurer le lien d'identité dans sidebar ; rétablir lib/env.ts local si nécessaire ; retirer lib/febadco et scripts/check-febadco-readonly.mjs ainsi que leurs commandes npm. Les anciens services de démonstration n'ont pas été remplacés. Conserver les exclusions de secrets. Ne pas utiliser git reset/clean, puisque les fichiers sont non suivis et les travaux antérieurs n'ont pas de commit.
