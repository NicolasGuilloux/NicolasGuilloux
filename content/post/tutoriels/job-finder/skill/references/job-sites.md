# Sites d'annonces

## Stratégie d'accès — Chrome en priorité

**Toujours utiliser Chrome en premier** : les sites d'annonces demandent souvent une connexion pour
afficher le contenu complet (annonces complètes, salaires, coordonnées). Chrome est déjà connecté
aux comptes du candidat, ce qui évite les murs d'inscription.

1. **`Claude in Chrome:navigate` + `Claude in Chrome:get_page_text`** — méthode principale
2. **`web_fetch`** — fallback si Chrome non disponible
3. **`web_search`** — pour découvrir des annonces sans naviguer sur le site directement

## Sites principaux

| Site | URL | Notes |
|---|---|---|
| HelloWork | https://www.hellowork.com/fr-fr/ | Connexion requise pour certains contenus |
| Moovijob | https://www.moovijob.com | Connexion parfois requise |
| Free-Work | https://www.free-work.com | Site dynamique, connexion requise |
| Indeed | MCP `indeed` | Utiliser le MCP Indeed directement (search_jobs, get_job_details) |
| Licorne Society | https://app.licornesociety.com | Connexion requise |
| LinkedIn | https://www.linkedin.com/jobs/ | Connexion requise — compte déjà connecté dans Chrome |
| Welcome to the Jungle | https://www.welcometothejungle.com/fr/jobs | Connexion parfois requise ; filtres remote très bien faits |
| APEC | https://www.apec.fr/candidat/recherche-emploi.html | Pour cadres/seniors uniquement ; connexion requise |
| Talent.io | https://www.talent.io/fr/offers | Plateforme curated pour devs — profil déjà créé recommandé |
| Malt | https://www.malt.fr/s | **Missions freelance** — connexion requise, profil obligatoire |
| Comet | https://www.comet.co/app/freelance/missions | **Missions freelance** — connexion requise |
| Kicklox | https://app.kicklox.com/freelance/missions | **Missions freelance tech** — connexion requise |
| Remotive | https://remotive.com/remote-jobs/software-dev | Full remote international — pas de connexion requise |
| We Work Remotely | https://weworkremotely.com/remote-jobs | Full remote international — pas de connexion requise |

## Indeed — MCP dédié

Pour Indeed, ne pas utiliser Chrome ni web_fetch. Utiliser directement les outils du MCP Indeed :
- `search_jobs` — rechercher des offres par mots-clés et localisation
- `get_job_details` — récupérer le détail complet d'une annonce à partir de son ID

Le MCP Indeed est connecté au compte du candidat et retourne des résultats structurés, bien plus
fiables que le scraping HTML.

## Stratégie par type de mission

- **CDI / CDD senior** → LinkedIn, APEC, Welcome to the Jungle, Talent.io, HelloWork
- **Freelance / missions** → Malt, Comet, Kicklox, Free-Work
- **Full remote (international)** → Remotive, We Work Remotely
- **Startups / scale-ups** → Welcome to the Jungle, Licorne Society, Talent.io

---

## Liens — règle absolue

**Toujours pointer vers la page de l'annonce elle-même**, jamais vers une page de résultats de recherche.

- ✅ `https://www.free-work.com/fr/tech-it/job/12345/dev-symfony-senior`
- ❌ `https://www.free-work.com/fr/tech-it/jobs?search=symfony&remote=true`

**Free-Work en particulier** : après une recherche, cliquer sur chaque annonce et copier l'URL de la page détail. L'URL de recherche est inutilisable comme référence.

Si l'URL directe d'une annonce est inaccessible (authentification requise, lien dynamique), ne pas enregistrer l'annonce — ou noter explicitement que le lien est à récupérer manuellement.

---

## Mots-clés de recherche recommandés

En fonction du profil, chercher avec : `PHP Symfony`, `développeur backend`, `DDD TDD`, `remote`,
`télétravail`, `NixOS`, `Docker`, `Elm`, `développeur senior`.

Combiner avec le lieu si pertinent : `Rennes`, `full remote`, `remote France`.
