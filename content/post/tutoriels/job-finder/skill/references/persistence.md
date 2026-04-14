# Persistance — Suivi des annonces

Les annonces sont stockées dans **Obsidian**, vault **Personnel**, dossier **Bases de données/Annonces**.
Chaque annonce est une note Markdown indépendante.

## Conventions de nommage

Nom de fichier : `Titre du poste - Entreprise.md`
Exemple : `Développeur Symfony Senior - Acme.md`

## Format d'une note d'annonce

```markdown
---
entreprise: Acme Corp
url: https://www.free-work.com/fr/tech-it/job/12345/dev-symfony-senior
location: Full remote
note: 75  # Intérêt du candidat pour cette annonce, de 0 (aucun) à 100 (maximal)
status: Nouveau
date: 2026-04-13
---

## Description

Résumé de l'annonce : stack, contexte, taille équipe, remote policy.

## Lettre de motivation

Texte de la lettre, prêt à copier-coller.
```

**Statuts possibles** : `Nouveau`, `En cours`, `Expiré`, `Refusé`

## Droits d'accès stricts

| Opération | Autorisé |
|---|---|
| Lire les notes existantes (`obsidian:read-note`, `obsidian:search-vault`) | ✅ |
| Créer une nouvelle note (`obsidian:create-note`) | ✅ |
| Modifier une note existante | ❌ READ-ONLY |
| Supprimer une note existante | ❌ READ-ONLY |

Les notes existantes sont gérées manuellement par le candidat (changement de statut, retours, etc.).

## Algorithme de traitement d'une annonce

Pour chaque annonce trouvée, appliquer dans l'ordre :

```
1. L'URL est-elle déjà dans une note du dossier ?
   Chercher via obsidian:search-vault (vault="Personnel",
   path="Bases de données/Annonces", query=<url>)
   → OUI : skip silencieux, passer à la suivante
   → NON : continuer

2. Rédiger la lettre de motivation (directives dans references/cover-letter-guidelines.md)

3. Créer la note via obsidian:create-note :
   - vault  → "Personnel"
   - folder → "Bases de données/Annonces"
   - filename → "Titre du poste - Entreprise.md"
   - content → note complète au format défini ci-dessus
```
