/*
    Fichier: scoreManager.js
    Nom: Nesma Medjber
    But: Gestion du score et des points du jeu
*/

/* Constantes */
const POINTS_DEPART = 300;
const POINTS_TRESOR = 10;
const PENALITE_RECOMMENCER = 200;
const PENALITE_OUVERTURE_MUR = 50;
const PENALITE_VUE_AERIENNE = 10;
const SEUIL_GAME_OVER = 200;
const SEUIL_OUVREURS = 50;
const SEUIL_VUE_AERIENNE = 10;

/* Variables */
let score = 0;
//let enVueAerienne; <====== A VOIR SI JE GARDE CA

/* Fonctions */

/*
|============================================================|
| initialiserScore:
|   Met le score à sa valeur de départ
|============================================================|
*/
function initialiserScore() {
    score = POINTS_DEPART;
    return score;
}

/*
|========================================================|
| obtenirScore:
|   Retourne la valeur actuelle du score
|========================================================|
*/
function obtenirScore() {
    return score;
}

/*
|============================================================|
| ajouterPointsTresor:
|   Ajoute des points quand le joueur trouve le trésor
|   (10 pts par secondes restantes)
|============================================================|
*/
function ajouterPointsTresor(secondesRestantes){
    score += POINTS_TRESOR * secondesRestantes;
}

/*
|============================================================|
| retirerPointsOuvertureMur:
|   Retire 50 pts quand le joueur ouvre un mur
|============================================================|
*/
function retirerPointsOuvertureMur() {
    score -= PENALITE_OUVERTURE_MUR;
}

/*
|============================================================|
| retirerPointsVueAerienne:
|   Retire 10 pts par seconde passée en vue aérienne
|============================================================|
*/
function retirerPointsVueAerienne() {
    score -= PENALITE_VUE_AERIENNE;
}

/*
|============================================================|
| retirerPointsRecommencer:
|   Retire 200 pts quand le joueur recommence un niveau
|============================================================|
*/
function retirerPointsRecommencer() {
    score -= PENALITE_RECOMMENCER;
}


/* ----- Fonctions de vérification ----- */

/*
|====================================================================|
| peutOuvrirMur:
|   Retourne true si le score permet encore d'ouvrir un mur (>= 50)
|====================================================================|
*/
function peutOuvrirMur() {
    return score >= SEUIL_OUVREURS
}

/*
|====================================================================|
| peutVueAerienne:
|   Retourne true si le score permet encore la vue aérienne (>= 10)
|====================================================================|
*/
function peutVueAerienne() {
    return score >= SEUIL_VUE_AERIENNE
}

/*
|==============================================================================|
| estGameOver:
|   Retourne true si le score est < 200 ET que le joueur recommence un niveau
|==============================================================================|
*/
function estGameOver() {
    return score < SEUIL_GAME_OVER && joueurDoitRecommencer;
}
