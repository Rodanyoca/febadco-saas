# Tableau de bord FEBADCO — 6 novembre 2026

## Périmètre autorisé

L'utilisateur a explicitement ajouté le tableau de bord au périmètre et demandé de retirer ses données de démonstration. Seule cette page est raccordée aux données réelles ; les interfaces des quatre blocs ne sont pas déclarées raccordées. Aucun portage du bloc Utilisateurs ou des autres modules exclus. Les travaux antérieurs sont conservés sur main sans historique ni remote ; aucun commit ou push.

## Rapport d'écart et correction

Avant : app/page.tsx lançait 25 collecteurs de démonstration, incluant territoire, affiliations, licences saisonnières et équipes nationales. Les erreurs étaient remplacées par des tableaux vides, donc des zéros ambigus. Les autres acteurs n'étaient pas comptés et la complétude reposait sur des règles héritées.

Après : quatre blocs agrégés, six catégories d'acteurs incluses, données exclusivement lues par le compte de service FEBADCO. Aucun import de local-demo, lib/data, actor-records ou moteur volleyball dans le nouveau parcours. Les indicateurs territoriaux, renouvellements et complétudes arbitraires sont retirés. Aucun graphique de ranking ou qualification. Lien Tableau de bord restauré dans la navigation et sur le logo.

## Mapping réel

Les en-têtes inspectés dans FEBADCO_SCHEMAS.md sont relus à chaque chargement pour localiser les colonnes par nom, sans supposer leur position.

| Source | Clé comptée | Autre colonne lue |
|---|---|---|
| ATHLETES | id_athlete | statut |
| COACHS | id_coach | statut |
| ARBITRES | id_arbitre | statut |
| OFFICIELS | id_officiel | statut |
| MEDECINS | id_medecin | statut |
| AUTRES | id_autre_acteur | statut |
| COMPETITIONS | id_competition | statut |
| ACTIVITES | id_activite | statut |
| DOCUMENTS | id_document | statut |

Les identifiants sont traités comme texte. Compteur = identifiants distincts non vides par feuille ; catégorie d'acteur distincte, pas de déduplication d'une personne entre professions. Doublon : première ligne retenue, anomalie signalée, aucune fusion ni écriture. Ligne de statut sans identifiant : exclue et signalée. Les lignes entièrement vides sont ignorées. Zéro est réservé à une lecture réussie ne retournant aucun identifiant. Les statuts acteurs ACTIF/ACTIVE, INACTIF/INACTIVE et SUSPENDU/SUSPENDUE sont comptés séparément ; autres valeurs non vides et non renseignées restent distinctes, aucune déduction sportive.

Les champs nom, téléphone, email, naissance, passeport, dates d'affiliation et fichiers ne sont jamais lus pour ces indicateurs. Seuls des agrégats sont rendus au navigateur. Aucun accès Drive, aucun contenu binaire, aucun référentiel inutilisé. Le socle ne possède toujours pas de session/droits utilisateur : cette extension ne les invente pas et n'expose aucune fiche privée. Le raccordement des futurs détails et mutations reste conditionné aux protections appropriées.

## Lectures et fraîcheur

Pour chaque bloc : un batchGet des en-têtes, puis un batchGet des colonnes utiles, regroupant les six feuilles Acteurs. Nominal : 8 appels Sheets, 0 Drive. Les blocs sont parallèles, les requêtes strictement identiques en cours sont dédupliquées par le lecteur existant. Aucun cache persistant, aucune lecture de droits périmés, timeout 15 s par appel, retry désactivé. Une erreur/schema manquant/refus source rend uniquement le bloc concerné indisponible ; les autres sont conservés. Aucun retour aux exemples locaux.

Rendu dynamique à l'ouverture ; bouton Actualiser existant avec état pending et double clic bloqué. Pas de polling ni rafraîchissement automatique ajouté. L'heure affichée est celle de fin de la tentative de lecture, en fuseau Kinshasa. Les pages clientes reçoivent des agrégats, jamais la matrice source. Les en-têtes et projections sont deux lectures séparées : un changement simultané du schéma pendant leur exécution reste une limite, sans promesse de snapshot transactionnel Google.

Comparaison défavorable assumée : l'ancienne démonstration faisait zéro appel Google ; le nouveau tableau connecté en fait huit. Aucun gain Google/CPU n'est annoncé sur cette comparaison. La projection évite les profils complets et les jointures inutiles ; son volume exact dépend des données. Les tests établissent le nombre de batchs et l'absence de champs privés, pas une économie Vercel. Aucune charge ou écriture métier de test.

## Contrôles

16 tests ciblés réussis : 5 nouveaux tests dashboard + 5 lecteur/configuration + 6 navigation. Cas : colonnes réordonnées, en-têtes absents/dupliqués, zéros, doublons, lignes incomplètes, vide, statuts inconnus, refus 403/panne d'un bloc et configuration absente. Huit batchs vérifiés en mode nominal sur fixtures synthétiques ; aucune identité dans la sortie agrégée.

Chromium avec connexion réelle sur localhost:3006 : HTTP 200 en 1440×900 et 390×844, aucun bandeau de démonstration, aucune erreur JavaScript, aucun bloc indisponible et aucun débordement global. Captures : docs/performance/dashboard/1440.png et 390.png, agrégats uniquement. Les quatre compteurs observés sont à zéro à cet instant après lectures réussies. Ceci ne crée ni ne valide aucune fiche métier. Le tri et la pagination des listes ne sont pas concernés par ce tableau agrégé à six catégories fixes.

Premier contrôle TypeScript : annotation @ts-expect-error inutile sur import type détectée et supprimée ; aucune erreur masquée. TypeScript indépendant et lint complet réussis ensuite. Le premier build a compilé mais est resté longtemps en typage ; seuls ses processus de vérification ont été arrêtés, sans arrêter le serveur utilisateur. L'import Google serveur est maintenant limité à googleapis/build/src/apis/sheets au lieu de l'espace global googleapis ; le build normal a été relancé. Aucune option de validation affaiblie, aucune économie CPU chiffrée déduite de cette observation.

Relecture via le SDK ciblé : HTTP 200, zéro alerte initiale, zéro bandeau de démonstration et aucun débordement à 390 px. Clic Actualiser : une seule requête RSC ; une alerte d'indisponibilité source a été observée après ce rafraîchissement. Ce résultat défavorable reste consigné : la connexion Google n'est pas annoncée infaillible, aucun zéro de repli ni donnée périmée n'est substitué. Aucun retry en boucle ajouté.

## Fichiers et retour arrière

Page app/page.tsx ; lib/febadco/dashboard-{domain,server}.ts ; test dashboard-domain.test.ts ; Header (prop demo=false uniquement sur le tableau de bord), navigation et son test, lien d'identité Sidebar ; documentation. Le composant AnalyticsTable et le bouton Actualiser existants sont réutilisés. Aucun changement d'environnement ni de données Google.

Retour arrière ciblé : débrancher loadRealDashboard et retirer les nouveaux fichiers dashboard ; rétablir la page précédente depuis une copie de travail ou l'historique de l'éditeur, ce dépôt n'ayant aucun commit. Retirer le lien dashboard si nécessaire ; conserver les autres travaux et secrets. Aucun git reset/clean. Ne pas substituer silencieusement la démonstration à une source en panne.

Arrêt après présentation pour validation utilisateur ; aucun démarrage du lot Acteurs sans son « oui ».

## Bilan final

Build normal final terminé avec code 0 : compilation 5,1 minutes, TypeScript 7,6 minutes, génération de 17 pages en 9,9 secondes et finalisation réussies. Ces durées de build ne mesurent pas la CPU des requêtes applicatives. TypeScript indépendant, lint et les 16 tests ciblés sont réussis ; les vérifications réelles du navigateur et le défaut transitoire source sur Actualiser restent décrits ci-dessus. Aucun processus de build de ce lot laissé en cours, aucun push ni déploiement.
