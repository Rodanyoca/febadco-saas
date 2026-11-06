# Lot 1 — preuves et limites

## Connexion réelle vérifiée le 6 novembre 2026

Après confirmation utilisateur de saisie des variables, `npm run check:google` s'est terminé avec le code 0. Le compte de service a lu les métadonnées et les en-têtes sélectionnés des cinq classeurs : référentiel (2 feuilles), acteurs (6), compétitions (4), activités (3), documents (3). Tous les blocs et en-têtes contrôlés sont OK. Total : 10 lectures Google, 0 écriture, 0 ligne métier lue. Aucune valeur de configuration ni donnée personnelle affichée. Cette vérification remplace l'attente de connexion mentionnée dans le bilan initial ci-dessous ; les autres limites demeurent (Drive, mappings métier complets, autorisations et données réelles dans les interfaces). Le lot 1 reste à valider explicitement par l'utilisateur ; Acteurs non commencé.

## Résultats obtenus

- 23 tests ciblés réussis : 18 tests du socle existant et 5 tests du lecteur/configuration (concurrence, erreur, absence, en-têtes, zéros initiaux). La spécification du test navigation a été adaptée à la suppression des licences et autres blocs exclus, sans masquer un échec préexistant.
- TypeScript `tsc --noEmit --incremental false` réussi.
- Build normal `npm run build` réussi avec Next.js 16.2.9, TypeScript strict, génération des pages et proxy. Aucun ignoreBuildErrors ajouté.
- Chromium local : /athletes HTTP 200 à 1440×900 et 390×844 ; neuf liens dans la navigation, aucun territoire/licence/équipe/dashboard/paramètres. Titre FEBADCO préservé. Captures docs/performance/lot1/navigation-*.png.
- POST local /api/athletes vide : 409 confirmé avant toute fonction de mutation. Aucun compte ni acteur créé, aucune écriture Google. Ceci teste le verrou du mode démonstration, pas des autorisations utilisateur inexistantes.
- Métadonnées et en-têtes/notes Google lus via connecteur ; références administratives bornées. Les lignes métier n'ont pas été lues. Le schéma détaillé est dans FEBADCO_SCHEMAS.md.

## Mesure synthétique reproductible

Commande : `node --experimental-strip-types scripts/benchmark-febadco-socle.mjs` ; résultats bruts docs/performance/lot1/synthetic.json. Base commune de 1 000 lignes fictives, cinq paires d'échauffement puis huit paires alternées. La référence compare deux lectures indépendantes au nouveau lecteur dédupliqué ; ce n'est pas un benchmark avant/après de l'application, qui reste en démonstration.

| Indicateur | Indépendant | Dédupliqué |
|---|---:|---:|
| Lectures simulées pour deux consommateurs simultanés | 2 | 1 |
| Lignes source copiées | 2 000 | 1 000 |
| Lignes rendues aux deux consommateurs au total | 2 000 | 2 000 |
| Taille de la matrice renvoyée à un consommateur | 28 904 octets | 28 904 octets |
| Durée médiane écoulée locale | 0,4753 ms | 0,2396 ms |
| CPU médiane du processus | 0 ms | 0 ms |
| CPU maximale échantillonnée | 0 ms | 16 ms |

Toutes les réponses sont équivalentes à la base. Aucune requête Google ou Drive dans cette mesure, aucune attente réseau. Le compteur CPU Windows est trop grossier pour cette durée : le pic défavorable de 16 ms côté dédupliqué est conservé, aucune économie CPU n'est démontrée. Les durées ne prédisent ni la latence Google ni le coût Vercel. Les mocks ne prouvent pas le débit ou la fraîcheur d'une source réelle. Le lecteur ne conserve les promesses qu'en cours et libère les rejets ; pas de cache persistant ni retry automatique.

## Limites et attente explicite

L'accès du compte de service n'a pas été testé : saisie et confirmation des sept variables attendues. `npm run check:google` ne doit être exécuté qu'après cette confirmation ; il ne lit que les en-têtes. Aucun dossier Drive ni droit OAuth vérifié. Aucun accès réel aux pages activé, aucune permission utilisateur inventée. Les routes historiques restent accessibles avec leurs données fictives ; retirer un lien n'est pas un contrôle d'accès. Aucun parcours métier réel n'est déclaré terminé.

L'avertissement Node MODULE_TYPELESS_PACKAGE_JSON existe sur les tests TS et reste visible ; il n'a pas été masqué par un changement global du système de modules. Le premier lint ciblé des nouveaux scripts a révélé 14 globals Node non déclarés ; les environnements/globals et l'import performance ont été précisés. Le lint complet final réussit. Le build a régénéré next-env.d.ts selon Next ; aucune configuration de validation n'a été affaiblie.

## Fichiers du lot

Modifiés : .gitignore, .env.example, README.md, package.json (deux commandes), lib/navigation.ts, lib/navigation.test.ts, lib/env.ts (identifiants fictifs des blocs exclus vidés), components/dashboard/sidebar.tsx (lien d'identité vers Acteurs). Ajoutés : lib/febadco/{config.ts,read-client.ts,read-client.test.ts}, scripts/check-febadco-readonly.mjs, scripts/benchmark-febadco-socle.mjs, docs/FEBADCO_{IMPLEMENTATION,CONFIGURATION,SCHEMAS,LOT1_VALIDATION}.md et preuves docs/performance/lot1. Les modifications d'identité des interventions précédentes sont conservées.

`git diff --stat` : vide car aucun fichier n'est encore suivi. `git status --short` : tous les fichiers applicatifs non suivis sur main sans commit, dont les dossiers app/, components/, docs/, lib/, scripts/ et les configurations. Aucun indexage, commit, push, déploiement ou modification d'un autre dépôt.

La procédure de retour arrière ciblé et les tâches sont dans FEBADCO_IMPLEMENTATION.md. Lot 1 non validé par l'utilisateur ; lot 2 non commencé.
