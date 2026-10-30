# Portfolio terminal — Michaël Lelu · React + TypeScript

Un portfolio interactif qui simule plusieurs shells (PowerShell, Bash, CMD et Zsh), propose un système de fichiers virtuel et anime les réponses avec un effet machine à écrire.

## Installation

Nécessite Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev
```

Pour vérifier et construire le site :

```bash
npm test
npm run build
npm run preview
```

Le dossier `dist/` est déployable sur un hébergement statique (Vercel, Netlify, etc.).

## Architecture

```text
src/
├── data/
│   ├── portfolio.json            # Informations personnelles, projets, compétences, liens
│   ├── filesystem.json           # Vraie structure des dossiers/fichiers virtuels
│   └── index.ts                  # Imports JSON typés
├── types/
│   ├── portfolio.ts              # Interfaces Project, PortfolioData…
│   ├── filesystem.ts             # Union FileNode / DirectoryNode
│   └── terminal.ts               # ShellId, TerminalEntry, CommandResult…
├── config/
│   └── shells.ts                 # Invites, palettes, configurations des shells
├── utils/
│   ├── fileSystem.ts             # Résolution de chemins, lecture, ls, tree
│   └── fileSystem.test.ts        # Tests fonctionnels de navigation
├── terminal/
│   ├── executor.ts               # Distribution des commandes
│   ├── format.ts                 # Couleurs des lignes
│   ├── suggestions.ts            # Autocomplétion contextuelle
│   └── commands/
│       ├── fileCommands.ts       # ls, cd, cat, pwd, tree…
│       ├── portfolioCommands.ts  # projects, skills, whoami, contact…
│       └── systemCommands.ts     # help, shell, theme, npm, dotnet…
├── hooks/
│   ├── useTerminal.ts            # Historique, exécution, cwd
│   ├── useTypewriter.ts          # Animation progressive
│   └── useAppearance.ts          # Apparence et accessibilité
├── components/
│   ├── TerminalWindow.tsx        # Fenêtre de terminal
│   ├── TerminalInput.tsx         # Saisie et clavier
│   ├── TypedOutput.tsx           # Rendu des lignes animées
│   ├── Sidebar.tsx               # Identité, raccourcis, sélecteurs
│   ├── AppearancePanel.tsx       # Thèmes, police, couleurs, vitesse
│   └── MatrixRain.tsx            # Fond Matrix
├── styles/                     # CSS organisé par responsabilité
│   ├── main.css                 # Imports CSS
│   ├── layout.css               # Application / entête / grille
│   ├── terminal.css             # Interface terminal
│   ├── panels.css               # Cartes et paramètres
│   ├── responsive.css           # Points de rupture
│   ├── shells.css               # Variantes PowerShell, Bash, CMD, Zsh
│   └── typewriter.css           # Animation de frappe
├── PortfolioApp.tsx
└── main.tsx
```

## Modifier ton contenu (sans éditer de JSX)

1. Modifie **`src/data/portfolio.json`** pour ajouter un projet, modifier les compétences, la bio ou les liens.
2. Modifie **`src/data/filesystem.json`** pour créer les dossiers/fichiers virtuels.
3. Pour un nouveau projet `mon-projet`, ajoute l'objet dans `portfolio.json`, puis le dossier dans `filesystem.json` avec les références `project:mon-projet` et `projectStack:mon-projet`.
4. Les références de contenu prises en charge sont centralisées dans `src/utils/fileSystem.ts` : `project:<slug>`, `projectStack:<slug>`, `skill:<catégorie>`, `about`, `welcome`, `experience`, `skills`, `links`, `contact`, `projectIndex`, `skillsGuide`.

Les coordonnées `linkedin` et `email` proviennent des CV fournis. La clé `cv` est laissée vide : aucun PDF personnel n’est publié automatiquement. Place le fichier PDF du CV dans `public/` et configure `links.cv`, p. ex. `/CV-Michael-Lelu.pdf`.

## Exemple de navigation

```console
Vie:\Developpeur\MichaelLelu> ls
about/  contact/  projects/  skills/  experience.txt  README.md  skills.json
Vie:\Developpeur\MichaelLelu> cd projects
Vie:\Developpeur\MichaelLelu\projects> ls
INDEX.md  ratp/  made-in-broke/  fineco/  decidento/  edmar-international/  groupe-fli/  ha-pme/  mediscreen/  multi-junction-lookup-pcf/  three-circles/  plateforme-video/  pokedex-ts/
Vie:\Developpeur\MichaelLelu\projects> cd ratp
Vie:\Developpeur\MichaelLelu\projects\ratp> ls
README.md  stack.json
Vie:\Developpeur\MichaelLelu\projects\ratp> cat README.md
# RATP — Dynamics 365
...
Vie:\Developpeur\MichaelLelu\projects\ratp> cd ..
Vie:\Developpeur\MichaelLelu\projects>
```

Les commandes sont simulées côté client, jamais exécutées sur la machine du visiteur. Les chemins `..`, `.`, `/`, `~`, `../README.md`, `projects/ratp` ainsi que les antislashs Windows sont pris en charge.

## Notes

- Le choix d'un shell modifie à la fois l'invite et les styles de la fenêtre. Le thème peut être personnalisé indépendamment.
- Le bouton « Vider », `clear`, `cls` ou `Ctrl+L` effacent la sortie ; l'historique des commandes reste accessible.
- Le bouton « Terminer » et `Échap` terminent l'effet de frappe. La préférence système « mouvements réduits » désactive l'animation.
- `portfolio.json` et `filesystem.json` sont importés lors du build, il faut reconstruire le site après les avoir modifiés.

## Vérifications du livrable

Les fonctions pures du terminal passent 6 tests de navigation et de lecture. Une vérification syntaxique a été faite sur les fichiers TypeScript et TSX. La compilation Vite complète ne peut pas être attestée ici, faute d’accès à l’installation npm dans cet environnement ; lance `npm install`, puis `npm run build` sur ton PC.

## Révision du contenu (CV, octobre 2026)

- 12 projets référencés, chacun avec un dossier virtuel et deux fichiers (`README.md`, `stack.json`).
- 7 rubriques de compétences dans `skills/` avec des fichiers JSON dédiés.
- Expériences professionnelles détaillées, avec périodes VexinSoft et HA + PME.
- Les liens `email` et `linkedin` correspondent aux deux CV fournis ; `cv` reste volontairement vide.
- Tests supplémentaires pour vérifier la synchronisation entre les projets/compétences et le système de fichiers.

## Mise à jour responsive / CV / défilement

- Le texte d'accueil apparaît **immédiatement**. Les réponses aux nouvelles commandes sont toujours animées (modifiable dans Personnaliser).
- La colonne d'options est **à gauche sur ordinateur**, **au-dessus du terminal sur mobile et tablette**.
- Sur ordinateur, la page occupe la hauteur de l'écran ; chaque panneau défile indépendamment. Sur mobile, le terminal garde une **hauteur définie** et seule sa zone d'historique défile, tandis que la page peut défiler pour accéder aux options. L'invite de commande reste visible au bas du terminal.
- Le PDF est placé dans `public/LELU-Michael-CVb.pdf` et accessible par `/LELU-Michael-CVb.pdf` sur Vite/Vercel (ne pas mettre `public/` dans l'URL).
- Un bouton **Télécharger mon CV** est affiché dans le panneau identité. La commande `cv` lance le téléchargement ; `open cv` ouvre le PDF dans un nouvel onglet.
