/*
    Fichier: levelManager.js
    Nom:  Magalie Abada
    But: Gestion du niveau
*/


/* ----- Variables -----*/
const MAX_NIVEAUX = 10;

const ETAT_ATTENTE = "ATTENTE";
const ETAT_EN_COURS = "EN_COURS";
const ETAT_VICTOIRE = "VICTOIRE";
const ETAT_GAME_OVER = "GAME_OVER";

const TEMPS_NIVEAU = 60;
const SCORE_DEFAUT = initialiserScore();

let niveauCourant = 1;
let debutNiveauMs = 0;
let tempsEcouleMs = 0;
let scoreNiveau = 0;

const IDX_OUVREURS = 0;
const IDX_FLECHES = 1;
const IDX_TELEPORTEURS = 2;
const IDX_RECEPTEURS = 3;

const CONFIG_NIVEAUX = [
    null,
    [4, 18, 0, 0],
    [4, 16, 1, 1],
    [3, 14, 1, 2],
    [3, 12, 2, 3],
    [2, 10, 2, 4],
    [2, 8, 3, 5],
    [1, 6, 3, 6],
    [1, 4, 4, 7],
    [0, 2, 4, 8],
    [0, 0, 5, 9]
];


/* ----- Fonctions -----*/

/*
|-----------------------------------------------------------------------------|
| initNiveau:
|   Initialise les éléments du niveau.
|-----------------------------------------------------------------------------|
*/
function initNiveau(niveau) {
    gameState.etat = ETAT_EN_COURS;
    gameState.porteEnclosFermee = false;
    gameState.tempsRestant = TEMPS_NIVEAU;
    gameState.ouvreurs = obtenirNbOuvreurs(niveau);

    //placerObjets(niveau);

    debutNiveauMs = 0;
    tempsEcouleMs = 0;
    scoreNiveau = 0;

    replacerJoueurDepart();
    //fermerMursOuverts();
    //ouvrirPorteEnclos();
    //audioManager.jouerDebutNiveau();
}

/*
|-----------------------------------------------------------------------------|
| gagnerNiveau:
|   Gère la victoire du niveau, avec mise à jour du score
|-----------------------------------------------------------------------------|
*/
function gagnerNiveau() {
    if (etatJeu !== ETAT_EN_COURS) return;

    scoreTotal += scoreNiveau;

    // Niveau suivant
    if (niveauCourant >= MAX_NIVEAUX) {
        etatJeu = ETAT_VICTOIRE;
        jouerFinJeu();
        return;
    }

    niveauCourant++;
    
    initNiveau();
}


/* ----- Getters pour les objets -----*/
function obtenirNbOuvreurs(niveau) {
    return CONFIG_NIVEAUX[niveau][IDX_OUVREURS];
}
function obtenirNbFleches(niveau) {
    return CONFIG_NIVEAUX[niveau][IDX_FLECHES];
}
function obtenirNbTeleporteurs(niveau) {
    return CONFIG_NIVEAUX[niveau][IDX_TELEPORTEURS];
}
function obtenirNbRecepteurs(niveau) {
    return CONFIG_NIVEAUX[niveau][IDX_RECEPTEURS];
}