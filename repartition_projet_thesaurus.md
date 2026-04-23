# Répartition du projet Thesaurus (Structure & Responsabilités)

## Vue générale

Le projet se divise en 3 blocs principaux :

1.  Monde 3D
2.  Logique du jeu
3.  Interface / Audio / Flow

------------------------------------------------------------------------

## Structure des dossiers

### assets/

-   Textures, images, sons, musiques\
-   Personne 1 → textures\
-   Personne 3 → sons

------------------------------------------------------------------------

### includes/

-   Librairies externes

------------------------------------------------------------------------

## js/

### core/

#### audioManager.js

-   Sons et musique du jeu\
    👉 Personne 3

#### game.js

-   Flow global du jeu\
    👉 Personne 3 (avec aide de Personne 2)

#### inputManager.js

-   Clavier / souris\
    👉 Personne 2

#### renderer.js

-   Rendu 3D\
    👉 Personne 1

#### sceneManager.js

-   Gestion de la scène\
    👉 Personne 1

#### UIManager.js

-   Interface utilisateur (score, temps, etc.)\
    👉 Personne 3

------------------------------------------------------------------------

### entites/

#### EntiteDeBase.js

👉 Personne 1

#### fleche.js

-   Visuel → Personne 1\
-   Direction → Personne 2

#### joueur.js

👉 Personne 2

#### mur.js

-   Visuel → Personne 1\
-   Logique → Personne 2

#### Recepteur.js / Teleporteur.js

-   Visuel → Personne 1\
-   Logique → Personne 2

#### Tresor.js

-   Visuel → Personne 1\
-   Détection → Personne 2

------------------------------------------------------------------------

### graphique/

-   MaterialFactory.js\
-   MeshFactory.js\
-   TextureLoader.js

👉 Personne 1

------------------------------------------------------------------------

### monde/

#### cell.js

👉 Personne 1

#### maze.js

👉 Personne 1

#### levelManager.js

👉 Personne 2

------------------------------------------------------------------------

### utils/

#### Constantes.js

👉 Personne 2 & 3

#### UtilsAleatoire.js

👉 Personne 2

#### UtilsMath.js

👉 Personne 1 & 2

------------------------------------------------------------------------

### main.js

👉 Personne 3 (ou équipe)

------------------------------------------------------------------------

## src/index.html

👉 Personne 3

------------------------------------------------------------------------

## Répartition finale

### Personne 1 --- Monde 3D

-   Dédale, murs, textures, objets 3D
-   Rendu et scène

### Personne 2 --- Gameplay

-   Mouvement joueur
-   Logique des objets
-   Niveaux et règles

### Personne 3 --- Interface / Audio

-   Score, temps, niveau
-   HUD
-   Sons
-   Flow du jeu

------------------------------------------------------------------------

## Résumé simple

-   Personne 1 → monde 3D\
-   Personne 2 → logique\
-   Personne 3 → interface + audio
