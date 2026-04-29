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

const TEMPS_NIVEAU = 60;
const SCORE_DEFAUT = 300;

const ETAT_ATTENTE = "ATTENTE";
const ETAT_EN_COURS = "EN_COURS";
const ETAT_VICTOIRE = "VICTOIRE";
const ETAT_GAME_OVER = "GAME_OVER";


let objScene3D = {};
let objgl;
let objProgShaders;

let gameState = {
    niveau: 1,
    score: SCORE_DEFAUT,
    tempsRestant: 0,
    ouvreurs: 0,
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
|   Initialise les valeurs globales du jeu
|-----------------------------------------------------------------------------|
*/
function initialiserJeu() {
    gameState.niveau = 1;
    gameState.score = SCORE_DEFAUT;
    gameState.tempsRestant = TEMPS_NIVEAU;
    gameState.ouvreurs = 4;   ///////////////////////////////// A modifier, viendra de levelManager
    gameState.etat = ETAT_EN_COURS;
    gameState.porteEnclosFermee = false;
}

// Boucle de rendu (appelée ~60x par seconde)
function boucle() {
    gererInputJoueur();
    mettreAJourCamera();

    dessinerScene(objgl, objProgShaders, objScene3D);
    requestAnimationFrame(boucle);
}

function mettreAJourCamera() {
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

    if (gameState.score < 50) {
        console.log("Score insuffisant pour ouvrir un mur.");
        return;
    }

    let murOuvert = ouvrirMurDevantJoueur();

    if (murOuvert) {
        gameState.ouvreurs--;
        gameState.score -= 50;

        console.log("Ouvreurs restants :", gameState.ouvreurs);
        console.log("Score :", gameState.score);
    }
}

/*
|-----------------------------------------------------------------------------|
| demanderFermetureEnclos:
|   Ferme la sortie de l'enclos après que le joueur en soit sorti
|-----------------------------------------------------------------------------|
*/
function demanderFermetureEnclos() {
    let cellulePorte = obtenirCellule(14, 15);

    if (cellulePorte == null) {
        return;
    }

    cellulePorte.type = TYPE_ENCLOS; /////////////////////// Voir si on crée un type spécial pour la porte
    cellulePorte.estOuverte = false;

    gameState.porteEnclosFermee = true;

    console.log("Enclos fermé");
    fermerMurGraphiquement(13, 15);
}

