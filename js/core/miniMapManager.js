/*
    Fichier: miniMapManager.js
    Nom: Nesma Medjber
    But: Gestion de la map en vue aérienne et du cheat code
*/

/* ----- Constantes -----*/
const HAUTEUR_VUE_AERIENNE = 35;
const CENTRE_DEDALE = 15.5;
//const DEMI_TAILLE_VUE_AERIENNE = 16;  // test

/* ----- Variables -----*/
let bolVueAerienne = false;
let bolCheat = false;                
let cameraNormaleSauvegardee = null;    
let dernierTempsPenaliteMs = 0;
let indicateurJoueur = null;

/*
|-----------------------------------------------------------------------------|
| activerVueAerienne:
|   Bascule en vue aérienne sauvegarde la caméra normale et installe
|   une caméra au-dessus qui regarde vers le bas.
|-----------------------------------------------------------------------------|
*/
function activerVueAerienne() {
    if (bolVueAerienne) return;
    if (gameState.etat !== ETAT_EN_COURS) return;
    if (!peutVueAerienne()) {
        console.log("Score insuffisant pour la vue aerienne");
        return;
    }

    cameraNormaleSauvegardee = objScene3D.camera;
    let cameraAerienne = creerCamera();

    setPositionsCameraXYZ([CENTRE_DEDALE, HAUTEUR_VUE_AERIENNE, CENTRE_DEDALE],cameraAerienne);
    setCiblesCameraXYZ([CENTRE_DEDALE, 0, CENTRE_DEDALE],cameraAerienne);
    setOrientationsXYZ([0, 0, -1], cameraAerienne);
    objScene3D.camera = cameraAerienne;
    bolVueAerienne = true;

    dernierTempsPenaliteMs = performance.now();
    console.log("Vue aerienne activee");
}

/*
|-----------------------------------------------------------------------------|
| desactiverVueAerienne:
|   Retour en vue normale, restaure la caméra du joueur sauvegardée.
|   Donc le joueur reprend exactement à la même position et direction.
|-----------------------------------------------------------------------------|
*/
function desactiverVueAerienne() {
    if (!bolVueAerienne) return;
    objScene3D.camera = cameraNormaleSauvegardee;
    cameraNormaleSauvegardee = null;
    bolVueAerienne = false;
    bolCheat = false;

    console.log("Vue aérienne DÉSACTIVÉE");
}

/*
|-----------------------------------------------------------------------------|
| basculerCheatVueAerienne:
|   rend visibles ou invisibles les objets en vue aérienne.
|-----------------------------------------------------------------------------|
*/
function basculerCheatVueAerienne() {
    if (!bolVueAerienne) {
        return;
    }
    bolCheat = !bolCheat;
    console.log(bolCheat ? "Cheat ON" : "Cheat OFF");
}

/*
|-----------------------------------------------------------------------------|
| mettreAJourPenaliteVueAerienne:
|   Retire 10 pts par seconde passée en vue aérienne.
|-----------------------------------------------------------------------------|
*/
function mettreAJourPenaliteVueAerienne() {
    if (!bolVueAerienne) return;
    let maintenant = performance.now();
    let deltaMs = maintenant - dernierTempsPenaliteMs;

    if (deltaMs >= 1000) {
        retirerPointsVueAerienne();
        dernierTempsPenaliteMs = maintenant;

        if (!peutVueAerienne()) {
            console.log("Score trop bas, sortie forcée de la vue aérienne.");
            desactiverVueAerienne();
        }
    }
}

/*
|-----------------------------------------------------------------------------|
| estEnVueAerienne:
|   Retourne true si on est en vue aérienne.
|-----------------------------------------------------------------------------|
*/
function estEnVueAerienne() {
    return bolVueAerienne;
}

/*
|-----------------------------------------------------------------------------|
| cheatEstActif:
|   Retourne true si on utilise le cheat.
|-----------------------------------------------------------------------------|
*/
function cheatEstActif() {
    return bolCheat;
}