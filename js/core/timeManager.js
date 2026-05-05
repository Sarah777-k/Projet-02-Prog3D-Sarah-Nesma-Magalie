/*
    Fichier: timeManager.js
    Nom: Nesma Medjber
    But: Gestion du temps écoulé dans le jeu
*/

/* CONSTANTES */
const TEMPS_NIVEAU = 60;

/* Variables */
let tempsRestant = TEMPS_NIVEAU;
let dernierTempsMs = 0;

/* Fonctions */

/*
|=====================================================================|
| initialiserTemps:
|   Remet le temps restant à la durée complète du niveau.
|=====================================================================|
*/
function initialiserTemps(){
    tempsRestant = TEMPS_NIVEAU;
    dernierTempsMs = performance.now();
}

/*
|=====================================================================|
| mettreAJourTemps:
|   Remet le temps restant à la durée complète du niveau.
|=====================================================================|
*/
function mettreAJourTemps() {
    if (gameState.etat !== ETAT_EN_COURS) {
        dernierTempsMs = performance.now();
        return;
    }
    let maintenantMs = performance.now();
    let deltaSecondes = (maintenantMs - dernierTempsMs) / 1000;
    dernierTempsMs = maintenantMs;

    tempsRestant -= deltaSecondes;

    if (tempsRestant <= 0) {
        tempsRestant = 0;
        tempsEcoule();
    }
}

/*
|=====================================================================|
| obtenirTempsRestant:
|   Retourne le temps restant en secondes.
|=====================================================================|
*/
function obtenirTempsRestant() {
    return tempsRestant;
}

/*
|=====================================================================|
| tempsEcoule:
|   Appelée quand le temps tombe à 0.
|=====================================================================|
*/
function tempsEcoule() {
    gameState.etat = ETAT_ATTENTE;

    if (peutRecommencerNiveau()) {
        audioManager.jouerTempsEcoule();
        recommencerNiveau();
    }
    else {
        perdrePartie();
    }
}
