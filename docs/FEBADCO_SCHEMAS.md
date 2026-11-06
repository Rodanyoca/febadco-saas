# FEBADCO — schémas Google inspectés le 5 novembre 2026

Lecture seule par le connecteur Google Drive : 5 appels de métadonnées, puis 5 appels groupés CellData. Aucune ligne d'acteur, activité, compétition ou document n'a été lue ; seules les lignes d'en-têtes et des références administratives bornées ont été consultées. Cette inspection ne prouve pas l'accès du compte de service local.

## 00_FEBADCO_REFERENTIEL

Source : https://docs.google.com/spreadsheets/d/1B8-cgHcXKHUkVBu4VAPLfx0uxyEyZ2iaJ1PRg9Y7kJQ/edit

### SEXES

Colonnes : `id_sexe`, `nom_sexe`, `observations`.

- SEX001 — MASCULIN
- SEX002 — FEMININ
- SEX099 — AUTRE — Precision obligatoire

### EPREUVES

Colonnes : `id_epreuve`, `id_discipline`, `nom_epreuve`, `id_type_resultat`, `unite_resultat`, `type_participation`, `observations`.

- EPR001 — DIS001 — SIMPLE_HOMMES — TR001 — SET — INDIVIDUEL
- EPR002 — DIS001 — SIMPLE_DAMES — TR001 — SET — INDIVIDUEL
- EPR003 — DIS001 — DOUBLE_HOMMES — TR001 — SET — PAIRE
- EPR004 — DIS001 — DOUBLE_DAMES — TR001 — SET — PAIRE
- EPR005 — DIS001 — DOUBLE_MIXTE — TR001 — SET — PAIRE
- EPR006 — DIS001 — RENCONTRE_PAR_EQUIPES — TR002 — MATCH — EQUIPE — Nature hommes/dames/mixte et composition a preciser dans le nom de l'epreuve.
- EPR099 — DIS001 — AUTRE — TR099 —  — AUTRE — Precision obligatoire.

### TYPES_ENTITES_DOCUMENTS

Colonnes : `id_type_entite_document`, `nom_type_entite_document`, `source_donnees`, `observations`.

- TED001 — ATHLETE — ATHLETES
- TED002 — COACH — COACHS
- TED003 — OFFICIEL — OFFICIELS
- TED004 — ARBITRE — ARBITRES
- TED005 — MEDECIN — MEDECINS
- TED006 — AUTRE_ACTEUR — AUTRES
- TED007 — ACTIVITE — ACTIVITES
- TED009 — COMPETITION — COMPETITIONS
- TED010 — FEDERATION — FEDERATION
- TED011 — RESULTAT — COMPETITIONS_RESULTATS
- TED099 — AUTRE —  — Precision obligatoire.

### TYPES_UNITES_COMPETITION

Colonnes : `id_type_unite_competition`, `nom_type_unite_competition`, `description`, `observations`.

- TUC001 — ATHLETE — Un athlete constitue l'unite de competition
- TUC002 — PAIRE — Deux athletes constituent l'unite de competition
- TUC003 — EQUIPE — Une equipe constitue l'unite de competition
- TUC099 — AUTRE — Unite non encore referencee — Precision obligatoire

### ISSUES_RESULTATS

Colonnes : `id_issue_resultat`, `nom_issue_resultat`, `observations`.

- ISS001 — VICTOIRE — Du point de vue de l'unite congolaise.
- ISS002 — DEFAITE — Du point de vue de l'unite congolaise.
- ISS003 — NON_DETERMINEE — Resultat ou decision non disponible ; ne pas deduire une victoire.
- ISS099 — AUTRE — Precision obligatoire.

### STATUTS_ACTEURS

Colonnes : `id_statut_acteur`, `nom_statut_acteur`, `observations`.

- ACTIF — ACTIF
- INACTIF — INACTIF — Conservation de l'identifiant permanent.
- SUSPENDU — SUSPENDU — Suspension distincte de la duree de validite de l'identifiant.
- DECEDE — DECEDE — Conservation historique de l'identifiant.
- AUTRE — AUTRE — Precision obligatoire.

### TYPES_ACTEURS

Colonnes : `id_type_acteur`, `nom_type_acteur`, `feuille_source`.

- ACT001 — ATHLETE — ATHLETES
- ACT002 — COACH — COACHS
- ACT003 — ARBITRE — ARBITRES
- ACT004 — OFFICIEL — OFFICIELS
- ACT005 — MEDECIN — MEDECINS
- ACT006 — AUTRE — AUTRES

### PARAMETRES_SYSTEME

Colonnes : `cle_parametre`, `valeur_parametre`, `description`.

- MODE_ADMINISTRATION — MONOSPORT — Federation de badminton.
- STRUCTURE_TERRITORIALE_ACTIVE — FALSE — Aucune ligue, entente ou club dans le perimetre actuel.
- MODE_AFFILIATION — DIRECTE_FEDERATION — Date d'affiliation dans la fiche de chaque acteur.
- MODULE_TRANSFERTS_ACTIF — FALSE — Aucun mouvement club dans ce profil.
- MODE_LICENCE — IDENTIFIANT_PERMANENT — Identifiant federal utilise comme reference de licence, a vie.
- LICENCE_GRATUITE — TRUE — Aucun montant ni paiement de licence.
- RENOUVELLEMENT_LICENCE — FALSE — Pas de cycle saisonnier.
- MODULE_EQUIPES_NATIONALES_ACTIF — FALSE — Participants et compositions saisis dans les competitions.
- MODE_COMPETITIONS — RESULTATS_INTERNATIONAUX — Aucune programmation de matchs ou qualification automatique.
- CALCUL_CLASSEMENT — FALSE — Place officielle facultative saisie manuellement.
- SAISIE_PHASES — MANUELLE — Phases libres rattachees a l'epreuve.

### FORMATS_ID

Colonnes : `objet`, `format_propose`, `exemple`, `description`.

- ATHLETE — BAD-ATH-###### — BAD-ATH-000001 — Identifiant federal et reference de licence permanents ; jamais reattribue.
- COACH — BAD-COA-###### — BAD-COA-000001 — Identifiant permanent ; licence gratuite sans renouvellement.
- ARBITRE — BAD-ARB-###### — BAD-ARB-000001 — Identifiant permanent.
- OFFICIEL — BAD-OFF-###### — BAD-OFF-000001 — Identifiant permanent.
- MEDECIN — BAD-MED-###### — BAD-MED-000001 — Identifiant permanent.
- AUTRE_ACTEUR — BAD-AUT-###### — BAD-AUT-000001 — Identifiant permanent.
- COMPETITION — BAD-COMP-AAAA-### — BAD-COMP-2026-001 — Edition d'une competition.
- AUTRES_OBJETS — PREFIXE + identifiant unique —  — References stables, independantes des numeros de ligne ; allocation securisee par l'application.

## 01_FEBADCO_ACTEURS

Source : https://docs.google.com/spreadsheets/d/1aerzcCZCX1eYuiOOI6dez6doC8C591NdXp8X6GYWi6o/edit

### ATHLETES

Colonnes : `id_athlete`, `id_bwf`, `nom_complet`, `id_sexe`, `date_naissance`, `lieu_naissance`, `nationalite`, `telephone`, `email`, `adresse`, `numero_passeport`, `date_delivrance_passeport`, `date_expiration_passeport`, `date_affiliation`, `statut`, `avatar_drive_id`, `avatar_drive_url`, `passeport_drive_id`, `passeport_drive_url`.

- Note `id_athlete` : Identifiant federal permanent, utilise aussi comme numero de licence gratuite a vie. Ne jamais reattribuer. L'identifiant BWF eventuel reste une reference externe distincte.
### COACHS

Colonnes : `id_coach`, `id_bwf`, `nom_complet`, `id_sexe`, `date_naissance`, `lieu_naissance`, `nationalite`, `id_niveau`, `telephone`, `email`, `adresse`, `numero_passeport`, `date_delivrance_passeport`, `date_expiration_passeport`, `date_affiliation`, `statut`, `avatar_drive_id`, `avatar_drive_url`, `passeport_drive_id`, `passeport_drive_url`.

- Note `id_coach` : Identifiant federal permanent, utilise aussi comme numero de licence gratuite a vie. Ne jamais reattribuer. L'identifiant BWF eventuel reste une reference externe distincte.
### OFFICIELS

Colonnes : `id_officiel`, `id_bwf`, `nom_complet`, `id_sexe`, `date_naissance`, `lieu_naissance`, `nationalite`, `telephone`, `email`, `adresse`, `numero_passeport`, `date_delivrance_passeport`, `date_expiration_passeport`, `date_affiliation`, `statut`, `avatar_drive_id`, `avatar_drive_url`, `passeport_drive_id`, `passeport_drive_url`.

- Note `id_officiel` : Identifiant federal permanent, utilise aussi comme numero de licence gratuite a vie. Ne jamais reattribuer. L'identifiant BWF eventuel reste une reference externe distincte.
### ARBITRES

Colonnes : `id_arbitre`, `id_bwf`, `nom_complet`, `id_sexe`, `date_naissance`, `lieu_naissance`, `nationalite`, `id_grade_arbitre`, `telephone`, `email`, `adresse`, `numero_passeport`, `date_delivrance_passeport`, `date_expiration_passeport`, `date_affiliation`, `statut`, `avatar_drive_id`, `avatar_drive_url`, `passeport_drive_id`, `passeport_drive_url`.

- Note `id_arbitre` : Identifiant federal permanent, utilise aussi comme numero de licence gratuite a vie. Ne jamais reattribuer. L'identifiant BWF eventuel reste une reference externe distincte.
### MEDECINS

Colonnes : `id_medecin`, `id_bwf`, `nom_complet`, `id_sexe`, `date_naissance`, `lieu_naissance`, `nationalite`, `id_specialite`, `telephone`, `email`, `adresse`, `numero_passeport`, `date_delivrance_passeport`, `date_expiration_passeport`, `date_affiliation`, `statut`, `avatar_drive_id`, `avatar_drive_url`, `passeport_drive_id`, `passeport_drive_url`.

- Note `id_medecin` : Identifiant federal permanent, utilise aussi comme numero de licence gratuite a vie. Ne jamais reattribuer. L'identifiant BWF eventuel reste une reference externe distincte.
### AUTRES

Colonnes : `id_autre_acteur`, `nom_complet`, `id_sexe`, `date_naissance`, `nationalite`, `telephone`, `email`, `id_federation`, `id_type_autre_acteur`, `statut`, `date_affiliation`, `observations`.

- Note `id_autre_acteur` : Identifiant federal permanent, utilise aussi comme numero de licence gratuite a vie. Ne jamais reattribuer. L'identifiant BWF eventuel reste une reference externe distincte.
- Note `id_federation` : Rattachement direct a FEDERATION.id_federation ; aucune structure territoriale.
## 06_FEBADCO_COMPETITIONS

Source : https://docs.google.com/spreadsheets/d/1Mo9dvMT6oGY3pKAX4xZyWIWP8xwpJBI_GKX1JMNG6Wg/edit

### COMPETITIONS

Colonnes : `id_competition`, `id_type_competition`, `id_saison`, `nom_competition`, `edition`, `date_debut`, `date_fin`, `pays`, `ville`, `lieu`, `statut`, `observations`.

### COMPETITIONS_EPREUVES

Colonnes : `id_competition_epreuve`, `id_competition`, `id_epreuve`, `id_categorie_age`, `nom_epreuve`, `statut`, `observations`.

### COMPETITIONS_UNITES

Colonnes : `id_unite_competition`, `id_competition_epreuve`, `id_type_unite_competition`, `nom_unite`, `statut`, `observations`.

- Note `id_type_unite_competition` : Reference TYPES_UNITES_COMPETITION. ATHLETE, PAIRE ou EQUIPE ; composition dans COMPETITIONS_PARTICIPANTS.
### COMPETITIONS_PHASES

Colonnes : `id_phase_competition`, `id_competition_epreuve`, `id_type_phase`, `nom_phase`, `ordre_phase`, `observations`.

- Note `nom_phase` : Libelle manuel (ex. Poule A, Quart de finale) ; pas de programmation de matchs, classement ou qualification automatique.
### COMPETITIONS_SETS

Colonnes : `id_set`, `id_resultat`, `numero_set`, `score_pour`, `score_contre`, `observations`.

- Note `id_resultat` : Reference COMPETITIONS_RESULTATS.id_resultat. Saisir les sets effectivement connus ; pas de borne de points imposee sans reglement de l'edition.
### COMPETITIONS_RESULTATS

Colonnes : `id_resultat`, `id_competition_epreuve`, `id_phase_competition`, `id_unite_competition`, `nom_adversaire`, `pays_adversaire`, `date_resultat`, `score_pour`, `score_contre`, `id_issue_resultat`, `id_statut_resultat`, `place_finale`, `observations`, `id_rencontre`.

- Note `pays_adversaire` : Pays de l'adversaire, a renseigner ; aucun compte ou fiche acteur adverse obligatoire.
- Note `score_pour` : Nombre de sets remportes par l'unite congolaise pour un match de badminton. Laisser vide si inconnu ; ne pas inventer 0.
- Note `score_contre` : Nombre de sets remportes par l'adversaire.
- Note `place_finale` : Position officielle facultative saisie manuellement ; aucun classement calcule.
- Note `id_rencontre` : Reference facultative COMPETITIONS_RENCONTRES_EQUIPES.id_rencontre pour rattacher les matchs d'une rencontre par equipes.
### COMPETITIONS_RENCONTRES_EQUIPES

Colonnes : `id_rencontre`, `id_competition_epreuve`, `id_phase_competition`, `id_unite_competition`, `nom_adversaire`, `pays_adversaire`, `date_rencontre`, `score_pour`, `score_contre`, `id_issue_resultat`, `id_statut_resultat`, `observations`.

- Note `score_pour` : Nombre de matchs gagnes par l'equipe congolaise ; ne pas confondre avec les sets ou points.
- Note `score_contre` : Nombre de matchs gagnes par l'equipe adverse.
### COMPETITIONS_PARTICIPANTS

Colonnes : `id_participation`, `id_unite_competition`, `id_athlete`, `role_participation`, `statut`, `observations`.

- Note `id_athlete` : Reference ATHLETES.id_athlete ; ne pas inscrire automatiquement tout l'effectif national. Une ligne par athlete et unite ; au plus un participant en simple, deux en double ; composition d'equipe selon reglement.
### COMPETITIONS_INTERVENANTS

Colonnes : `id_intervenant`, `id_competition`, `id_type_acteur`, `id_acteur`, `id_fonction`, `observations`.

### COMPETITIONS_DISTINCTIONS

Colonnes : `id_distinction`, `id_competition_epreuve`, `id_unite_competition`, `id_athlete`, `id_type_distinction`, `date_attribution`, `observations`.

- Note `id_athlete` : Beneficiaire individuel facultatif ; sinon id_unite_competition pour une paire/equipe. Au moins un beneficiaire, dans l'epreuve concernee. Distinction officielle seulement.
## 04_FEBADCO_ACTIVITES

Source : https://docs.google.com/spreadsheets/d/1V2PrlsxJccWOgJGsJCYnFuufq7YLPT6Sp4Ge3_SJkdA/edit

### ACTIVITES

Colonnes : `id_activite`, `id_type_activite`, `id_entite_organisatrice`, `nom_activite`, `titre_public`, `resume`, `date_debut`, `date_fin`, `pays`, `ville`, `lieu`, `statut`, `observations`.

### ACTIVITES_ENTITES

Colonnes : `id_activite_entite`, `id_activite`, `id_entite`, `role_entite`, `statut_participation`, `observations`.

### ACTIVITES_PARTICIPANTS

Colonnes : `id_participation`, `id_activite`, `id_type_acteur`, `id_acteur`, `role_participation`, `statut_participation`, `observations`.

## 05_FEBADCO_DOCUMENTS

Source : https://docs.google.com/spreadsheets/d/1tfOSVe5MFK1JGA_Kt-NkmyeiYYukuRBUVycBYk4qRjM/edit

### DOCUMENTS

Colonnes : `id_document`, `id_type_document`, `titre_document`, `numero_reference`, `date_document`, `date_reception`, `date_expiration`, `description`, `statut`, `observations`.

### DOCUMENTS_FICHIERS

Colonnes : `id_fichier`, `id_document`, `nom_fichier`, `type_fichier`, `url_fichier`, `id_fichier_drive`, `date_ajout`, `observations`.

### DOCUMENTS_RELATIONS

Colonnes : `id_relation_document`, `id_document`, `id_type_entite`, `id_entite`, `type_relation`, `observations`.
