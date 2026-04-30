/*
    Fichier: placementObjets.js
    Nom:  Magalie Abada
    But: Placement des objets en fonction du niveau
*/

/* ----- Variables -----*/
let tabObjets = [];

/*
|-----------------------------------------------------------------------------|
| placerObjets:
|   Appelle les fonctions de placement pour les différents types d'objets
|-----------------------------------------------------------------------------|
*/
function placerObjets(niveau) {
    placerTresor();
    placerFleches(obtenirNbFleches(niveau));
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
    let cellule = obtenirCelluleLibreAleatoire(tabObjets);
    tabObjets.push({
        type: "TRESOR",
        ligne: cellule.ligne,
        colonne: cellule.colonne
    });
}


/*
|-----------------------------------------------------------------------------|
| placerFleches:
|   Place le bon nombre de flèches sur des cases couloirs libres
|-----------------------------------------------------------------------------|
*/
function placerFleches(nbFleches) {
    for (let i = 0; i < nbFleches; i++) {
        let cellule = obtenirCelluleLibreAleatoire(tabObjets);
        tabObjets.push({
            type: "FLECHE",
            ligne: cellule.ligne,
            colonne: cellule.colonne
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
        let cellule = obtenirCelluleLibreAleatoire(tabObjets);
        tabObjets.push({
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
        let cellule = obtenirCelluleLibreAleatoire(tabObjets);
        tabObjets.push({
            type: "RECEPTEUR",
            ligne: cellule.ligne,
            colonne: cellule.colonne
        });
    }
}

/*
|-----------------------------------------------------------------------------|
| viderTabObjets:
|   Vide le contenur du tableau d'objets pour le prochain niveau
|-----------------------------------------------------------------------------|
*/
function viderTabObjets() {
    tabObjets = [];
}