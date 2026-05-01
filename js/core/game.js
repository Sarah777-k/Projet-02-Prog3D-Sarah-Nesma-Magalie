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

let objScene3D = {};
let objgl;
let objProgShaders;

let gameState = {
    niveau: 1,
    ouvreurs: 0,
    fleches: 0,
    teleporteurs: 0,
    recepteurs: 0,
    etat: ETAT_EN_COURS,
    porteEnclosFermee: false
};

function demarrer() {
    let objCanvas = document.getElementById("monCanvas");
    objgl = initWebGL(objCanvas);
    objProgShaders = initShaders(objgl);
    initTextures(objgl); // charge les textures depuis assets/

    initDédale();
    initialiserJeu();

    objScene3D.objets = construireScene(objgl);

    // Initialisation de la caméra, position basée sur le joueur
    objScene3D.camera = creerCamera();
    setOrientationsXYZ([0, 1, 0], objScene3D.camera);
    mettreAJourCamera();

    boucle();
}

/*
|-----------------------------------------------------------------------------|
| initialiserJeu:
|   Initialise les valeurs globales du jeu lors du lancement du premier niveau
|-----------------------------------------------------------------------------|
*/
function initialiserJeu() {
    gameState.niveau = 1;
    initialiserScore();

    initNiveau(gameState.niveau);
}

// Boucle de rendu (appelée ~60x par seconde)
function boucle() {
    gererInputJoueur();
    mettreAJourCamera();
    mettreAJourTemps();
    mettreAJourHUD();
    

    dessinerScene(objgl, objProgShaders, objScene3D);
    
    requestAnimationFrame(boucle);
}

function mettreAJourCamera() {

    //Si on est en vue aérienne, ne met pas à jour la pos de la caméra
    //if (estEnVueAerienne()) return;  

    let dir = obtenirDirectionVecteur();
    let hauteurYeux = 1.2;


    setPositionsCameraXYZ(
        [joueur.x, joueur.y + hauteurYeux, joueur.z],
        objScene3D.camera
    );


    setCiblesCameraXYZ(
        [
            joueur.x + dir.x,
            joueur.y + hauteurYeux,
            joueur.z + dir.z
        ],
        objScene3D.camera
    );
}

/*
|-----------------------------------------------------------------------------|
| demanderOuvertureMur:
|   Vérifie si le joueur a le droit d'ouvrir un mur
|-----------------------------------------------------------------------------|
*/
function demanderOuvertureMur() {
    if (gameState.etat !== ETAT_EN_COURS) {
        return;
    }

    if (gameState.ouvreurs <= 0) {
        console.log("Aucun ouvreur disponible.");
        return;
    }

    if (!peutOuvrirMur()) {
        console.log("Score insuffisant pour ouvrir un mur.");
        return;
    }

    let murOuvert = ouvrirMurDevantJoueur();

    if (murOuvert) {
        gameState.ouvreurs--;
        retirerPointsOuvertureMur();

        console.log("Ouvreurs restants :", gameState.ouvreurs);
        console.log("Score :", obtenirScore());
    }
}

/*
|-----------------------------------------------------------------------------|
| demanderFermetureEnclos:
|   Ferme la sortie de l'enclos après que le joueur en soit sorti
|-----------------------------------------------------------------------------|
*/
function demanderFermetureEnclos() {
    let cellulePorte = obtenirCellule(13, 15);

    if (cellulePorte == null) {
        return;
    }

    gameState.porteEnclosFermee = true;

    fermerMurGraphiquement(13, 15);
    
    cellulePorte.fermerPorte();
}

/*
|-----------------------------------------------------------------------------|
| demanderOuvertureEnclos:
|   Ouvre la porte de l'enclos lors du chargement du niveau
|-----------------------------------------------------------------------------|
*/
function demanderOuvertureEnclos() {
    let cellulePorte = obtenirCellule(13, 15);

    if (cellulePorte == null) {
        return;
    }

    gameState.porteEnclosFermee = false;
    cellulePorte.ouvrirPorte();

    let mur3D = trouverMur3D(cellulePorte.ligne, cellulePorte.colonne);

    if (mur3D !== null) {
        ouvrirMurGraphiquement(mur3D);
    }
    
}