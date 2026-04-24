/*
    Fichier: game.js
    Nom: Nesma Medjber & Magalie Abada
    But: Gère le déroulement global du jeu

    Responsabilités:
    - Initialisation du jeu (chargement du dédale, joueur, niveau)
    - Boucle principale du jeu (update / rendu)
    - Gestion des états du jeu (en cours, game over, victoire)
    - Gestion des transitions (début niveau, fin niveau, restart)
    - Synchronisation entre gameplay et interface/audio
    
    Ne contient PAS:
    - Le rendu 3D (renderer.js)
    - La logique des entités (joueur, flèches, etc.)
    - La structure du monde (maze.js)
    
    Remarque:
    Ce fichier agit comme contrôleur central du jeu.
*/