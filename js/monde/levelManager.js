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
function initNiveau(niveau, nouveauPlacementObjets) {
    gameState.etat = ETAT_EN_COURS;
    gameState.porteEnclosFermee = false;
    gameState.ouvreurs = obtenirNbOuvreurs(niveau);

    if (nouveauPlacementObjets) {
        viderTabObjets();
        placerObjets(niveau);
        objScene3D.objets = construireScene(objgl);
    }

    // debutNiveauMs = 0;
    // tempsEcouleMs = 0;
    // scoreNiveau = 0;
    initialiserTemps(); ///// ajout nesma

    demanderOuvertureEnclos();
    initPositionJoueur();

    audioManager.jouerDebutNiveau();
    audioManager.demarrerAmbiance();
    
}

/*
|-----------------------------------------------------------------------------|
| gagnerNiveau:
|   Gère la victoire du niveau, avec mise à jour du score
|-----------------------------------------------------------------------------|
*/
function gagnerNiveau() {
    if (gameState.etat !== ETAT_EN_COURS) return;

    ajouterPointsTresor(obtenirTempsRestant());
    validerScoreNiveau();

    audioManager.arreterPas();
    audioManager.arreterAmbiance();

    // Niveau suivant
    if (gameState.niveau >= MAX_NIVEAUX) {
        gameState.etat = ETAT_VICTOIRE;

        audioManager.jouerVictoire();
        return;
    }
    
    gameState.niveau++;
    initNiveau(gameState.niveau, true);
}

/*
|-----------------------------------------------------------------------------|
| recommencerNiveau:
|   Recharge le même niveau sans modifier le score total ni la position des objets
|-----------------------------------------------------------------------------|
*/
function recommencerNiveau() {
    initNiveau(gameState.niveau, false);
    refermerMursOuverts();
    recommencerScoreNiveau();
    validerScoreNiveau();
    audioManager.arreterAmbiance();
}

/*
|-----------------------------------------------------------------------------|
| perdrePartie:
|   Gère la défaite du joueur (le tps est écoulé, le joueur ne peut pas recommencer)
|-----------------------------------------------------------------------------|
*/
function perdrePartie() {
    const ETAT_GAME_OVER = "GAME_OVER";
    audioManager.arreterAmbiance();
    audioManager.jouerGameOver();
    ////////////////// Afficher le message game over / ecran à voir avec Nesma
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