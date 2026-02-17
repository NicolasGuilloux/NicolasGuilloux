# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website/blog for Nicolas Guilloux, built with **Hugo** using the **hugo-theme-stack** theme (git submodule). All articles are written in French. Hosted on GitHub Pages at https://nicolasguilloux.eu/.

## Development Commands

The project uses **devenv** (Nix-based) for reproducible environments. Run `direnv allow` to auto-load dependencies.

- **Dev server** (with drafts): `serve` (devenv script, runs `hugo server -D`)
- **Production build**: `build` (devenv script, runs `hugo --gc --minify`)
- **Direct Hugo**: `hugo server -D` / `hugo --gc --minify`

Required tools (provided by devenv): `git`, `hugo`, `asciidoctor`.

## Architecture

### Content Structure

Articles live in `content/post/<category>/<slug>/` as page bundles:
- Each article is an `index.md` (Markdown) or `index.adoc` (AsciiDoc) with images alongside
- Front matter: `title`, `description`, `date`, `slug`, `image` (cover), `categories`, `tags`
- Categories: Tutoriels, Projets, Notes, WIP
- Drafts go in `.draft/` subdirectories
- Permalinks: posts → `/articles/:slug/`, pages → `/:slug/`

Static pages (about, archives, search) are in `content/page/`.

### Theme Customization

The Stack theme is a git submodule in `themes/hugo-theme-stack/`. Local overrides:
- `layouts/partials/` — overrides for footer, sidebar, comments (Disqus), social links
- `assets/scss/` — custom stylesheets
- `assets/icons/` — custom social icons (e.g., malt.svg)
- `i18n/fr.yaml` — French translation overrides

### CI/CD

- **Build validation**: `.github/workflows/build.yaml` — triggers on PRs and pushes to `website` or `website_*` branches
- **Deployment**: `.github/workflows/publish.yaml` — triggers on push to `website` branch, deploys `public/` to `gh-pages` branch

### Branching

- `website` — main development/deployment branch
- `master` — base branch
- `gh-pages` — generated site (auto-deployed)

## Writing Style

All content is written in **French**. When writing or editing articles, follow these conventions:

### Tone and voice

- **Conversational and informal**, but technically precise — never academic or stiff.
- **Three voices** coexist naturally:
  - **"Je"** for personal narrative, opinions, and retrospective commentary ("J'ai décidé", "j'ai été déçu").
  - **"On"** (inclusive "we") as the dominant voice in tutorials — creates a collaborative feel ("On va créer", "On va maintenant configurer").
  - **"Vous"** for direct reader instructions and optional choices ("Pensez à mettre votre mot de passe", "Vous pouvez consulter la documentation").
- **Dry humor and self-deprecation** are sprinkled throughout ("grâce à mon don incroyable de lecture de la seule et unique page disponible").
- **Parenthetical asides** for informal commentary: "(le fameux `server_name`)".

### Article structure

- **Narrative introduction**: always starts with personal motivation or context, never a dry definition. The author shares why they needed something, what failed, what they learned.
- **Conceptual explanation** when warranted (e.g. "Qu'est-ce que Matrix", "Comment fonctionne un certificat").
- **Step-by-step sections** with descriptive headings (not generic labels). Sub-sections use AsciiDoc level-3 (`===`).
- **Casual closing**, often brief — "Et voilà !" or a short "what's next" note.
- **Cross-linking** between related articles using relative links.

### Technical writing

- Acronyms are expanded on first use: "abrégée CA pour Certification Authority".
- English technical terms are used directly when standard (build, switch, reverse proxy, bridge) — no forced French translations.
- Code blocks are extensive with **inline comments in French** for self-documentation.
- Bullet lists are heavily used for enumeration and prerequisites.
- Safety notices and attention calls are inline in bold with exclamation marks, not formatted admonition blocks.

### Format

- Prefer **AsciiDoc** (`.adoc`) for new articles — older articles may be Markdown but all recent content uses AsciiDoc.
- AsciiDoc features in active use: `[source,nix]` code blocks, `image:filename[]` macros, `link:url[text^]` for external links, `+` for soft line breaks, `NOTE:` admonitions (sparingly).

## Key Configuration

- `config.yaml` — Hugo site config (base URL, theme, permalinks, widgets, social links, comments)
- `devenv.nix` — development environment packages and scripts
- `devenv.ai.nix` — Claude Code agent definitions and MCP server config
- `security.exec.allow` in config.yaml whitelists `asciidoctor` for AsciiDoc rendering
