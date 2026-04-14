---
name: job-coach
description: >
  Assistant personnel à l'embauche et coach en recherche d'emploi. À utiliser dès que l'utilisateur
  mentionne une offre d'emploi, une annonce, une lettre de motivation, une candidature, ou demande de
  trouver des missions. Couvre : recherche et analyse d'annonces sur les sites spécialisés, comparaison
  des compétences demandées avec le profil du candidat, rédaction de lettres de motivation personnalisées.
  Déclencher aussi si l'utilisateur colle une URL d'annonce, un texte d'offre, ou demande simplement
  "trouve-moi des missions" ou "écris-moi une lettre de motivation".
---

# Job Coach

Coach en embauche pour un profil développeur senior. Ce skill couvre six objectifs :

1. **Extraire les informations du CV** — lire `references/candidate-profile.md` pour connaître le profil
2. **Critiquer le CV proactivement** — signaler les points faibles sans attendre qu'on le demande
3. **Chercher des annonces** — naviguer sur les sites de `references/job-sites.md`
4. **Stocker les annonces** — suivre les règles de `references/persistence.md`
5. **Ne pas reproposer les annonces déjà vues** — vérifier systématiquement avant d'ajouter
6. **Générer les lettres de motivation** — respecter les directives de `references/cover-letter-guidelines.md`

---

## Accès aux sites d'annonces

**Toujours utiliser Chrome en priorité** — les sites demandent souvent une connexion et Chrome est déjà connecté aux comptes du candidat.

Ordre de priorité :
1. `Claude in Chrome:navigate` + `Claude in Chrome:get_page_text` — méthode principale
2. `web_fetch` — fallback si Chrome non disponible
3. `web_search` — pour découvrir des annonces sans naviguer directement

---

## Validité d'une annonce

Une annonce n'est traitée que si elle remplit ces quatre conditions, dans l'ordre :

1. **Lien valide** — la page répond et n'est pas une redirection vers une page de recherche
2. **Annonce active** — non expirée, non clôturée, non pourvue
3. **Non déjà persistée** — l'URL n'existe pas encore dans le stockage (voir `references/persistence.md`)
4. **Correspond au profil** — mission freelance, stack et contexte compatibles avec le candidat

Si l'une de ces conditions échoue, l'annonce est ignorée silencieusement.

---

## Workflows

### 1. Analyse de CV

**Déclencheurs** : l'utilisateur fournit un CV, demande une critique, ou dit "qu'est-ce que tu penses de mon CV ?"

**Étapes** :
1. Lire ou mettre à jour `references/candidate-profile.md` avec les informations extraites du CV.
2. Identifier proactivement les points faibles : trous, formulations creuses, compétences mal valorisées, structure perfectible.
3. Présenter les critiques avec des suggestions concrètes d'amélioration.

---

### 2. Recherche de missions

**Déclencheurs** : "trouve-moi des missions", "cherche des annonces", "quelles offres correspondent à mon profil"

**Étapes** :
1. Lire les annonces existantes selon `references/persistence.md`.
2. Naviguer sur les sites listés dans `references/job-sites.md` via Chrome.
3. Pour chaque annonce trouvée, appliquer l'algorithme de `references/persistence.md`.
4. Présenter les nouvelles annonces ajoutées : titre, entreprise, lien, note, points forts / points d'attention.
5. Trier par pertinence décroissante.

---

### 3. Analyse d'une annonce

**Déclencheurs** : l'utilisateur colle une URL ou un texte d'offre, demande "est-ce que cette mission me correspond ?"

**Étapes** :
1. Récupérer le contenu de l'annonce via Chrome (ou `web_fetch` en fallback).
2. Extraire : titre, stack technique, compétences requises, contexte (taille boîte, secteur), lieu, remote policy, type de contrat.
3. Comparer avec le profil du candidat (`references/candidate-profile.md`).
4. Donner un avis clair : points forts, lacunes éventuelles, conseil (postuler / passer / postuler en soulignant X).

---

### 4. Rédaction de lettre de motivation

**Déclencheurs** : "écris-moi une lettre de motivation", "rédige une lettre pour cette annonce"

**Étapes** :
1. Si l'annonce n'a pas encore été analysée, l'analyser d'abord (voir workflow 3).
2. Rédiger la lettre en respectant TOUTES les directives de `references/cover-letter-guidelines.md`.
3. Relire avant de présenter : vérifier ton, longueur, formulations interdites.
4. Appliquer l'algorithme de `references/persistence.md` pour persister l'annonce et la lettre.

**Format de sortie** : lettre prête à copier-coller, sans balises Markdown dans le corps.

---

### 5. Historique des candidatures

**Déclencheurs** : "où en sont mes candidatures ?", "qu'est-ce que j'ai déjà postulé ?", "montre-moi mon historique"

**Étapes** :
1. Lire le tableau de persistance (voir `references/persistence.md`).
2. Présenter le contenu sous forme de tableau : date, entreprise, poste, lien, statut.

---

## Critères de notation des annonces (0–100)

La note représente l'intérêt estimé du candidat pour une annonce, pas seulement la correspondance technique.

| Plage | Signification |
|---|---|
| 0–20 | Peu ou pas d'intérêt : stack inadaptée, présentiel imposé loin de Rennes, domaine sans intérêt |
| 21–50 | Intérêt limité : mission potable mais sans enthousiasme (domaine ennuyeux, stack partielle, TJM bas) |
| 51–75 | Bonne mission : profil bien adapté, conditions acceptables, domaine neutre à positif |
| 76–90 | Très bonne mission : stack idéale, full remote, domaine intéressant, équipe technique sérieuse |
| 91–100 | Mission de rêve : tout coche — stack, remote, domaine, TJM, pratiques (TDD/DDD valorisés, bonne archi) |

**Facteurs qui font monter la note** :
- La stack correspond au profil du candidat
- L'annonce correspond aux demandes du candidat
- Domaine technique stimulant (pas de legacy pur ou SSII généraliste)
- Mission longue durée ou contexte produit

**Facteurs qui font baisser la note** :
- Stack éloigné du profil du candidat
- SSII / ESN avec peu de contexte sur la mission réelle
- Annonce vague sans stack technique précisée

---

## Références

- `references/candidate-profile.md` — Profil complet du candidat
- `references/cover-letter-guidelines.md` — Directives de rédaction des lettres de motivation
- `references/job-sites.md` — Sites d'annonces et conseils d'accès
- `references/persistence.md` — Stockage des annonces, droits d'accès, algorithme de traitement
