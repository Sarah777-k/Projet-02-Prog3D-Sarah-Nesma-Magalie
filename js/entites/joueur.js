/*
    Fichier: joueur.js
    Nom:  Magalie Abada
    But: Gestion du joueur
*/


/* ----- Variables -----*/
let joueur = {
    x: 15.5,
    y: 0.3,
    z: 16.5,
    direction: "NORD"
};


/* ----- Fonctions -----*/

/*
|-----------------------------------------------------------------------------|
| obtenirCelluleDepuisPosition:
|   Transforme une position sur le canva en position dans la grille
|-----------------------------------------------------------------------------|
*/
function obtenirCelluleDepuisPosition(x, z) {
    return {
        ligne: Math.floor(z),
        colonne: Math.floor(x)
    };
}

function estCelluleBloquante(ligne, colonne) {
    let type = obtenirTypeCellule(ligne, colonne);
    return cellule.estBloquante();
}

/*
|-----------------------------------------------------------------------------|
| peutSeDeplacer:
|   Vérifie si le déplacement est possible
|-----------------------------------------------------------------------------|
*/
function peutSeDeplacer(x, z) {
    let cellule = obtenirCelluleDepuisPosition(x, z);

    return !estCelluleBloquante(cellule.ligne, cellule.colonne);
}

/*
|-----------------------------------------------------------------------------|
| tournerGauche:
|   Change la direction du joueur vers la gauche
|-----------------------------------------------------------------------------|
*/
function tournerGauche() {
    if (joueur.direction === "NORD") {
        joueur.direction = "OUEST";
    } else if (joueur.direction === "OUEST") {
        joueur.direction = "SUD";
    } else if (joueur.direction === "SUD") {
        joueur.direction = "EST";
    } else if (joueur.direction === "EST") {
        joueur.direction = "NORD";
    }
}

/*
|-----------------------------------------------------------------------------|
| tournerDroite:
|   Change la direction du joueur vers la droite
|-----------------------------------------------------------------------------|
*/
function tournerDroite() {
    if (joueur.direction === "NORD") {
        joueur.direction = "EST";
    } else if (joueur.direction === "EST") {
        joueur.direction = "SUD";
    } else if (joueur.direction === "SUD") {
        joueur.direction = "OUEST";
    } else if (joueur.direction === "OUEST") {
        joueur.direction = "NORD";
    }
}

/*
|-----------------------------------------------------------------------------|
| avancer:
|   Fait avancer le joueur en fonction de sa direction
|-----------------------------------------------------------------------------|
*/
function avancer() {
    let newX = joueur.x;
    let newZ = joueur.z;

    if (joueur.direction === "NORD") {
        newZ -= 1;
    }
    if (joueur.direction === "SUD") {
        newZ += 1;
    }
    if (joueur.direction === "EST") {
        newX += 1;
    }
    if (joueur.direction === "OUEST") {
        newX -= 1;
    }

    if (peutSeDeplacer(newX, newZ)) {
        joueur.x = newX;
        joueur.z = newZ;
    } else {
        console.log("Mur !");
    }
}

/*
|-----------------------------------------------------------------------------|
| reculer:
|   Fait reculer le joueur en fonction de sa direction
|-----------------------------------------------------------------------------|
*/
function reculer() {
    let newX = joueur.x;
    let newZ = joueur.z;


    if (joueur.direction === "NORD") {
        newZ += 1;
    }
    if (joueur.direction === "SUD") {
        newZ -= 1;
    }
    if (joueur.direction === "EST") {
        newX -= 1;
    }
    if (joueur.direction === "OUEST") {
        newX += 1;
    }

    if (peutSeDeplacer(newX, newZ)) {
        joueur.x = newX;
        joueur.z = newZ;
    } else {
        console.log("Mur !");
    }
}