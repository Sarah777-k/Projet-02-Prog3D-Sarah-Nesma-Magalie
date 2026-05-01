/*
    Fichier: miniMapManager.js
    Nom: Nesma Medjber
    But: Gestion de la map en vue aérienne et du cheat code
*/

/* ----- Constantes -----*/
const HAUTEUR_VUE_AERIENNE = 35;
const CENTRE_DEDALE = 15.5;

/* ----- Variables -----*/
let bolVueAerienne = false;
let bolCheat = false;                
let cameraNormaleSauvegardee = null;    
let dernierTempsPenaliteMs = 0;

/*
|-----------------------------------------------------------------------------|
| activerVueAerienne:
|   Bascule en vue aérienne sauvegarde la caméra normale et installe
|   une caméra au-dessus qui regarde vers le bas.
|-----------------------------------------------------------------------------|
*/
function activerVueAerienne() {
    console.log("Vue aérienne ACTIVÉE");
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
    console.log(bolCheat ? "Cheat ON" : "Cheat OFF");
    
    if (!bolVueAerienne) {
        return;
    }
    bolCheat = !bolCheat;
}

/*
|-----------------------------------------------------------------------------|
| mettreAJourPenaliteVueAerienne:
|   Retire 10 pts par seconde passée en vue aérienne.
|-----------------------------------------------------------------------------|
*/
function mettreAJourPenaliteVueAerienne() {
    if (!bolVueAerienne) return;
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