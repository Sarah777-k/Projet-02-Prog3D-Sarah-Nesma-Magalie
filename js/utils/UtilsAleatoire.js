/*
    Fichier: UtilsAleatoire.js
    Nom:  Magalie Abada
    But: Librairie de fonctions utilitaires pour le placement aléatoire des objets
*/

/*
|-----------------------------------------------------------------------------|
| obtenirNombreAleatoire:
|   Retourne un nombre entier aléatoire entre min et max inclus
|-----------------------------------------------------------------------------|
*/
function obtenirNombreAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
|-----------------------------------------------------------------------------|
| estCelluleOccupee:
|   Vérifie si une cellule est déjà utilisée par un objet spécial
|-----------------------------------------------------------------------------|
*/
function estCelluleOccupee(ligne, colonne, cellulesOccupees) {
    for (let i = 0; i < cellulesOccupees.length; i++) {
        if (
            cellulesOccupees[i].ligne === ligne &&
            cellulesOccupees[i].colonne === colonne
        ) {
            return true;
        }
    }

    return false;
}

/*
|-----------------------------------------------------------------------------|
| obtenirCelluleLibreAleatoire:
|   Retourne une cellule couloir libre pour placer un objet
|-----------------------------------------------------------------------------|
*/
function obtenirCelluleLibreAleatoire(cellulesOccupees) {
    let cellule = null;
    let ligne;
    let colonne;

    do {
        ligne = obtenirNombreAleatoire(0, TAILLE_DEDALE - 1);
        colonne = obtenirNombreAleatoire(0, TAILLE_DEDALE - 1);
        cellule = obtenirCellule(ligne, colonne);

    } while (
        cellule === null ||
        !cellule.estCouloir() ||
        estCelluleOccupee(ligne, colonne, cellulesOccupees)
    );

    return {
        ligne: ligne,
        colonne: colonne
    };
}