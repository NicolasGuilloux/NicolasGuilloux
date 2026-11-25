---
title: A propos
aliases:
  - about-me
  - contact
comments: false
---

Je suis développeur Backend en freelance, et je développe principalement en PHP avec Symfony. J'aime beaucoup la programmation en règle générale, et apprendre de nouveaux principes et concepts. C'est quelque chose qui m'anime, avec l'idée de toujours faire plus de qualité.

Concrètement, ça veut dire beaucoup de [Test Driven Development](https://fr.wikipedia.org/wiki/Test_driven_development), du [Domain Driven Design](https://fr.wikipedia.org/wiki/Conception_pilot%C3%A9e_par_le_domaine) et de l'architecture hexagonale. Et comme je n'aime pas garder les bonnes choses pour moi, j'ai souvent fini par devenir le référent de ces sujets dans les équipes que j'ai croisées.

## Mon parcours

### Les débuts : Rich-ID et Chaplean (2019 - 2021)

Tout a commencé à Bordeaux, dans une startup devenue scaleup. On y utilisait le framework [Symfony](https://symfony.com/), dans lequel j'ai maintenant une grande connaissance. En effet, j'ai développé un certain nombre de bundles, ce qui m'a permis d'approfondir ma compréhension de la façon dont le framework fonctionne.

Avec mon équipe, on développait nos applications en TDD, avec une exigence de qualité assez exceptionnelle : tests, relectures de code, documents de direction technique pour les autres devs... Grâce à cette méthode et aux nombreux tests que nous avons écrits, j'ai pu développer une [suite de librairies et bundles](https://github.com/rich-id/test-suite) pour Symfony qui correspondait à notre vision des tests, afin d'optimiser leur lisibilité et leur performance. Ils sont open source, tout comme un [bundle pour charger et valider automatiquement des DTO](https://github.com/NicolasGuilloux/chaplean-dto-handler-bundle).

J'y ai aussi eu la chance d'utiliser Elm au quotidien pendant un moment. J'ai énormément apprécié de changer d'approche, c'était mon premier contact avec la [programmation fonctionnelle](https://fr.wikipedia.org/wiki/Programmation_fonctionnelle). C'est vraiment un super langage qui promet d'enlever tous les bugs au runtime. Et pour l'équilibre karmique, j'ai aussi entretenu un projet initialement écrit en Zend Framework.

### Icade (2022)

Direction La Défense, chez un leader de l'immobilier tertiaire. Au programme : un CMS sur Ibexa DXP dont le BackOffice, livré par un prestataire, ne fonctionnait pas vraiment. J'ai fait un gros ménage dans la stack Docker et dans le code, corrigé ce qui devait l'être, puis mis en place l'analyse statique, le build des images et le déploiement sur Kubernetes via la CI Gitlab. J'ai aussi travaillé sur un référentiel client unique, en Symfony 6 et VueJS, pour regrouper des données éparpillées dans plusieurs services internes.

### Carrefour (2022 - 2026)

Plus de trois ans sur le backend du site de drive et de livraison : validation et paiement du panier, choix du magasin et des créneaux, le tout pour plusieurs millions de commandes par an. Autant dire que les bugs ne passent pas inaperçus.

J'y étais référent TDD et DDD, aussi bien pour l'équipe back que pour l'équipe front, où j'ai aidé à mettre en place l'architecture hexagonale et l'injection de dépendance dans un contexte VueJS. Côté technique, j'ai notamment :

- divisé par deux voire trois le nombre d'appels aux microservices sur certaines requêtes, et gagné plusieurs centaines de millisecondes sur le traitement des appels API ;
- créé une librairie interne qui génère automatiquement plusieurs centaines de lignes de code par endpoint, pour implémenter les API beaucoup plus vite ;
- accompagné les montées de version de Symfony 5 à 7, avec le Tech lead transverse ;
- travaillé sur les déploiements avec Helm et Kubernetes sur Azure ;
- fait partie de l'équipe qui testait l'IA chez Carrefour, avec Gemini CLI, ce qui m'a amené à intégrer des agents dans le projet et à développer un bridge vers OpenAI.

J'ai aussi animé pas mal de réunions techniques et de présentations dans le cadre de la veille, parce qu'expliquer les choses reste la meilleure façon de vérifier qu'on les a comprises.

### Antadis et Estra Consulting (2026)

Deux missions courtes, mais qui changent d'horizon. Chez Antadis, je suis intervenu en tant qu'expert Sylius sur la plateforme e-commerce de France Matériaux : un Sylius multi-canaux pour environ 250 adhérents, chacun avec ses propres pratiques, et de la recherche produit avec ElasticSearch.

Avec Estra Consulting, j'ai fait un détour par .NET et Angular pour la CAPEB : une API publique en architecture hexagonale (rate limiting, CORS, CSRF, la totale), la consommation de plusieurs microservices internes, et un BackOffice pour le support. Comme quoi les bons principes ne dépendent pas du langage.

### DINUM (depuis 2026)

Aujourd'hui, je suis à Rennes à la Direction interministérielle du numérique, où je développe en Symfony et VueJS des applications au service du Réseau Interministériel de l'État. Particularité : des postes hors ligne, sans accès à Internet et avec très peu de permissions. Ça oblige à repenser l'outillage (dépendances, images Docker, CI Gitlab) pour que tout fonctionne dans ces conditions, et je dois avouer que c'est un exercice plutôt stimulant.

## À côté du travail

Je suis un grand fan de [NixOS](https://nixos.org/). Toutes mes machines, Linux comme macOS, sont décrites dans [ma configuration](https://gitlab.com/NicolasGuilloux/nixos-configuration) avec Nix Flakes, et j'ai même packagé le client de [Shadow](https://shadow.tech/) à l'époque où je représentais la communauté Linux auprès d'eux. Plusieurs articles de ce blog en découlent, comme [mon installation de Matrix](/articles/matrix/) ou [mon reverse proxy](/articles/reverse-proxy-nixos/).

Plus récemment, je m'amuse beaucoup avec les agents IA et Claude Code : un [assistant pour la recherche de missions](/articles/job-coach-skill/), un autre pour faire mes courses, et un MCP Chrome qui tourne dans Docker avec accélération GPU.

## Formation

Je suis ingénieur diplômé de l'[ENSEA](https://www.ensea.fr/), une école d'électronique, ce qui explique les quelques projets à base de fer à souder dans les articles. J'ai fait ma dernière année à l'University College Cork en Irlande, pour un Master of Science en médias interactifs, entièrement en anglais, avec de la 3D et de la réalité virtuelle au programme.

Pour la version plus formelle de tout ça, mon CV est accessible via l'icône CV du site.

____

Le site est généré grâce au framework [Hugo](https://gohugo.io/), avec un thème fait maison.
