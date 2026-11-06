# FEACO — instructions d’harmonisation

Modifier uniquement ce projet. Consulter `docs/FEACO_INTERFACE_MATRIX.md` avant de porter une interface et `docs/FEACO_BUSINESS_GAPS.md` avant de concevoir une règle métier.

FEVOCO local est la référence visuelle exclusive. Conserver composants, styles, dimensions, navigation, sections et modalités d’ouverture observés. Ligue → Entente → Club → Athlète; aucune équipe de club, équipes nationales distinctes. Détail ligue en sections. Reprendre les indicateurs réellement présents, sans en ajouter.

La cible est en démonstration locale : données fictives typées dans `lib/local-demo.ts`, service de lecture dans `lib/google-sheets.ts`. Les connexions futures doivent utiliser exclusivement des ressources FEACO. Conserver le refus des mutations tant que les services ne sont pas validés; un succès implique une persistance réelle. Toute règle volleyball doit être isolée du parcours athlétisme et documentée.

Réutiliser `lib/compact-date.ts` pour les dates; date vide conservée, validation calendaire réelle, séparateurs automatiques. Préserver clavier, tactile, responsive et fermeture/annulation des panneaux. Vérifier typage, lint, build, interactions et comparaison visuelle; consigner les limites dans `docs/FEACO_VALIDATION.md`.

Aucun secret, donnée personnelle FEVOCO, configuration production, push, merge ou déploiement. Préserver les changements locaux existants.
