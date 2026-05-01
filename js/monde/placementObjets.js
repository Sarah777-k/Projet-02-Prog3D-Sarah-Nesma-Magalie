/*
    Fichier: placementObjets.js
    Nom:  Magalie Abada
    But: Placement des objets en fonction du niveau
*/

/* ----- Variables -----*/
let tabObjetsNiveau = [];


/*
|-----------------------------------------------------------------------------|
| placerObjets:
|   Appelle les fonctions de placement pour les différents types d'objets
|-----------------------------------------------------------------------------|
*/
function placerObjets(niveau) {
    let tresor = placerTresor();

    placerFleches(obtenirNbFleches(niveau), tresor);
    placerTeleporteurs(obtenirNbTeleporteurs(niveau));
    placerRecepteurs(obtenirNbRecepteurs(niveau));
}

/*
|-----------------------------------------------------------------------------|
| placerRecepteurs:
|   Place le bon nombre de récepteurs sur des cases couloirs libres
|-----------------------------------------------------------------------------|
*/
function placerTresor() {
    let cellule = obtenirCelluleLibreAleatoire(tabObjetsNiveau);
    let tresor = {
        type: "TRESOR",
        ligne: cellule.ligne,
        colonne: cellule.colonne
    };

    tabObjetsNiveau.push(tresor);

    return tresor;
    
}


/*
|-----------------------------------------------------------------------------|
| placerFleches:
|   Place le bon nombre de flèches sur des cases couloirs libres
|-----------------------------------------------------------------------------|
*/
function placerFleches(nbFleches, tresor) {
    for (let i = 0; i < nbFleches; i++) {
        let cellule = obtenirCelluleLibreAleatoire(tabObjetsNiveau);

        let angle = calculerAngleVersTresor(
            cellule.ligne,
            cellule.colonne,
            tresor.ligne,
            tresor.colonne
        );

        tabObjetsNiveau.push({
            type: "FLECHE",
            ligne: cellule.ligne,
            colonne: cellule.colonne,
            angle: angle
        });
    }
}

/*
|-----------------------------------------------------------------------------|
| placerTeleporteurs:
|   Place le bon nombre de teleporteurs sur des cases couloirs libres
|-----------------------------------------------------------------------------|
*/
function placerTeleporteurs(nbTeleporteurs) {
    for (let i = 0; i < nbTeleporteurs; i++) {
        let cellule = obtenirCelluleLibreAleatoire(tabObjetsNiveau);
        tabObjetsNiveau.push({
            type: "TELEPORTEUR",
            ligne: cellule.ligne,
            colonne: cellule.colonne
        });
    }
}

/*
|-----------------------------------------------------------------------------|
| placerRecepteurs:
|   Place le bon nombre de récepteurs sur des cases couloirs libres
|-----------------------------------------------------------------------------|
*/
function placerRecepteurs(nbRecepteurs) {
    for (let i = 0; i < nbRecepteurs; i++) {
        let cellule = obtenirCelluleLibreAleatoire(tabObjetsNiveau);
        tabObjetsNiveau.push({
            type: "RECEPTEUR",
            ligne: cellule.ligne,
            colonne: cellule.colonne
        });
    }
}

/*
|-----------------------------------------------------------------------------|
| vidertabObjetsNiveau:
|   Vide le contenur du tableau d'objets pour le prochain niveau
|-----------------------------------------------------------------------------|
*/
function viderTabObjets() {
    tabObjetsNiveau = [];
}

/*
|-----------------------------------------------------------------------------|
| calculerAngleVersTresor:
|   Calcul l'angle entre une flèche et le trésor pour orienter la flèche
|-----------------------------------------------------------------------------|
*/
function calculerAngleVersTresor(ligneFleche, colonneFleche, ligneTresor, colonneTresor) {
    let deltaX = colonneTresor - colonneFleche;
    let deltaZ = ligneTresor - ligneFleche;

    return Math.atan2(deltaZ, deltaX); // arctangente de deltaZ/deltaX pour obtenir l'angle en radians
}