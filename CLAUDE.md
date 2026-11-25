# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website/blog for Nicolas Guilloux, built with **Hugo** and a custom theme (Mintaka design system) living directly in the repository. All articles are written in French. Hosted on GitHub Pages at https://nicolasguilloux.eu/.

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

### Theme

The theme is home-made, no Hugo module or submodule. It implements the "Refonte nicolasguilloux.eu" mockups (night/day themes, 1440 px, 1920 px and 390 px layouts).
- `layouts/`: templates (Hugo ≥ 0.146 layout structure: `baseof.html`, `home.html`, `single.html`, `term.html`, `archives.html`, `search.html`, `_partials/`, `_shortcodes/`)
- `assets/css/main.css`: all styles; design tokens are CSS variables switched by `html[data-theme="nuit"|"jour"]`
- `assets/js/main.js`: progressive enhancements: theme toggle, mobile menu, table of contents, reading progress, code block toolbar (copy, language, `$` one-liners, file trees), table wrapping, image lightbox, click-to-load YouTube, search
- `static/images/sky-*.svg`: starry backgrounds
- Menus and social links: `config/_default/menu.toml`; homepage category chips: `homeCategories` in `params.toml`

Article helpers (AsciiDoc roles):
- `[.source-link]` before a paragraph holding one link: "Source" card, the link text should be the file path
- `[.link-card]` before a paragraph holding one link: large link card showing the URL
- `[.prompt]` on a `____` quote block: chat prompt bubble
- `[.tree]` on a `----` block containing `├──`: file tree block (trees are also detected automatically)
- Front matter `series` (taxonomy) + `seriesLabel`: series navigation chips
- `{{< youtube ID >}}`: privacy-friendly video, loaded on click
- `[.scroll]` on an AsciiDoc table (`[.scroll,cols=...]`), or `{.scroll}` on the line after a Markdown table: wide table, cells keep their width and the table scrolls horizontally
- Every table gets an "Agrandir" button that opens it in a full-screen modal; articles have a "Pleine largeur" toggle (remembered in localStorage, hidden on mobile)
- External links (absolute http(s) URLs to another host) always open in a new tab: Markdown render hook `layouts/_markup/render-link.html`, AsciiDoc output post-processed by `_partials/external-links.html`, JS safety net for the rest

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

- `config/_default/`: Hugo site config (base URL, permalinks, menus, params, markup, taxonomies)
- `devenv.nix` — development environment packages and scripts
- `devenv.ai.nix` — Claude Code agent definitions and MCP server config
- `security.exec.allow` in config.toml whitelists `asciidoctor` for AsciiDoc rendering
