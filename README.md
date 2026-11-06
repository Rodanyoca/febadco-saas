# FEBADCO — Système de gestion

Profil badminton simplifié : Acteurs, Compétitions, Activités et Documents. Voir le [cahier des charges et les tâches](docs/FEBADCO_IMPLEMENTATION.md), la [configuration du lot 1](docs/FEBADCO_CONFIGURATION.md) et les [schémas inspectés](docs/FEBADCO_SCHEMAS.md). Les documents FEACO ci-dessous sont historiques ; leurs règles athlétisme, territoire et licences saisonnières ne s'appliquent plus au profil demandé. Les anciennes pages restent en démonstration explicite, sans connexion réelle. Le nouveau contrôle de connexion est indépendant et attend la saisie manuelle des variables.

Base locale créée depuis les interfaces réelles et l’état local courant de FEVOCO. Dépôt indépendant, aucun remote, secret ou service de production repris.

```powershell
npm ci
npm run dev
```

Ouvrir http://localhost:3006. Aucun compte nécessaire; cette duplication n’ajoute pas d’authentification. Les fiches sont fictives. Les formulaires et annulations sont explorables; sauvegardes, suppressions et uploads explicitement refusés sans succès simulé.

Voir [matrice](docs/FEACO_INTERFACE_MATRIX.md), [écarts](docs/FEACO_BUSINESS_GAPS.md), [suivi](docs/FEACO_STATUS.md), [validation](docs/FEACO_VALIDATION.md). Logo circulaire neutre. Référentiels et connexions FEACO restent à fournir. Aucun push, merge ni déploiement.
