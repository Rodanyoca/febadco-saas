# Configuration FEBADCO — lot 1

Renseigner manuellement `C:/Projets/SNDS-RDC/data/monosport/febadco-managment/.env.local` ; ne jamais transmettre une clé dans la conversation. `.env.example` est un modèle fictif uniquement. Le code du contrôle charge `.env.local` avec @next/env et ne journalise aucune valeur. Aucun fichier local privé n'est créé ou rempli automatiquement.

## Sept variables nécessaires maintenant

| Nom exact | Rôle / valeur à renseigner soi-même |
|---|---|
| GOOGLE_CLIENT_EMAIL | client_email du compte de service Google dédié/autorisé FEBADCO |
| GOOGLE_PRIVATE_KEY | private_key du même compte, entre guillemets, retours sous forme de \n |
| FEBADCO_REFERENTIELS_SPREADSHEET_ID | 1B8-cgHcXKHUkVBu4VAPLfx0uxyEyZ2iaJ1PRg9Y7kJQ |
| FEBADCO_ACTEURS_SPREADSHEET_ID | 1aerzcCZCX1eYuiOOI6dez6doC8C591NdXp8X6GYWi6o |
| FEBADCO_COMPETITIONS_SPREADSHEET_ID | 1Mo9dvMT6oGY3pKAX4xZyWIWP8xwpJBI_GKX1JMNG6Wg |
| FEBADCO_ACTIVITES_SPREADSHEET_ID | 1V2PrlsxJccWOgJGsJCYnFuufq7YLPT6Sp4Ge3_SJkdA |
| FEBADCO_DOCUMENTS_SPREADSHEET_ID | 1tfOSVe5MFK1JGA_Kt-NkmyeiYYukuRBUVycBYk4qRjM |

Partager chacun de ces cinq classeurs avec l'adresse GOOGLE_CLIENT_EMAIL au rôle **Lecteur** pour le lot 1. Activer l'API Google Sheets dans le projet du compte de service. Le script demande uniquement spreadsheets.readonly ; aucune permission IAM globale ni accès aux anciens classeurs n'est requis. Les droits Éditeur ne seront nécessaires qu'après validation des mutations métier dans un lot ultérieur. L'accès du connecteur utilisateur ne démontre pas l'accès du compte de service.

Après confirmation de saisie seulement : `npm run check:google`. Attendu : cinq blocs OK, dix lectures maximum sans retry (5 métadonnées + 5 batchGet d'en-têtes), aucune ligne métier ni écriture. Le script vérifie le nom FEBADCO, les feuilles attendues et les en-têtes ; il ne valide pas encore tous les référentiels ni les mappings futurs. Configuration absente → arrêt avant appel ; panne/permission → échec, aucun repli vers la démonstration dans ce script.

## Variables préparées pour plus tard, facultatives au lot 1

GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN : OAuth Drive d'un compte dédié/autorisé FEBADCO ; à saisir seulement avant activation des médias. GOOGLE_DRIVE_ROOT_FOLDER_ID : dossier privé d'avatars selon le mécanisme existant ; GOOGLE_DRIVE_PASSPORTS_FOLDER_ID : dossier privé distinct prévu pour les passeports ; GOOGLE_DRIVE_DOCUMENTS_FOLDER_ID : pièces documentaires. Ces dossiers et leurs droits restent à inspecter avant utilisation ; aucun dossier créé ou lien public ajouté. L'application n'active pas les médias par la seule présence de ces variables. Donner au compte OAuth uniquement l'accès aux dossiers requis, lecture pour consultation puis édition pour les uploads validés. Ne pas confondre cet accès OAuth avec le compte de service Sheets.

Aucune variable de territoire, affiliation historique, licence saisonnière ou équipe nationale. Aucun secret d'authentification factice : l'intégration d'une protection réelle des données reste à clarifier avant exposition des pages privées.
