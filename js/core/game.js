/*
    Fichier: game.js
    Nom: Magalie Abada & Nesma Medjber
    But: Gère le déroulement global du jeu
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
    audioManager.arreterMusiqueAccueil();

    let objCanvas = document.getElementById("monCanvas");
    objgl = initWebGL(objCanvas);
    objProgShaders = initShaders(objgl);

    initTextures(objgl); // charge les textures depuis assets
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

    initNiveau(gameState.niveau, true);
    validerScoreNiveau();
}

// Boucle de rendu (appelée ~60x par seconde)
function boucle() {
    gererInputJoueur();
    
    mettreAJourCamera();
    mettreAJourTemps();
    mettreAJourPenaliteVueAerienne();
    mettreAJourHUD();
    
    dessinerScene(objgl, objProgShaders, objScene3D);
    
    requestAnimationFrame(boucle);
}

/// Vue caméra inclinée
function mettreAJourCamera() {
    // Si on est en vue aérienne, ne met pas à jour la position de la caméra
    if (estEnVueAerienne()) return;  

    let dir = obtenirDirectionVecteur();
    let hauteurYeux = 1.2;

    setPositionsCameraXYZ(
        [joueur.x, joueur.y + hauteurYeux, joueur.z],
        objScene3D.camera
    );

    setCiblesCameraXYZ(
        [
            joueur.x + dir.x,
            joueur.y + hauteurYeux -0.1,
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
        return;
    }

    if (!peutOuvrirMur()) {
        return;
    }

    let murOuvert = ouvrirMurDevantJoueur();

    if (murOuvert) {
        gameState.ouvreurs--;
        retirerPointsOuvertureMur();
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

/*
|-----------------------------------------------------------------------------|
| refermerMursOuverts:
|   Ferme tous les murs ouvrables qui sont ouverts
|-----------------------------------------------------------------------------|
*/
function refermerMursOuverts() {
    for (let i = 0; i < tabMursOuverts.length; i++) {
        let fermerOK = false;

        let mur = tabMursOuverts[i];
        let cellule = obtenirCellule(mur.ligne, mur.colonne);

        if (cellule !== null) {
            fermerOK = cellule.fermer();
        }

        if (fermerOK) {
            fermerMurGraphiquement(mur.ligne, mur.colonne);
        }
    }

    tabMursOuverts = [];
}