/*
    Fichier: joueur.js
    Nom:  Magalie Abada
    But: Gestion du joueur
*/


/* ----- Constantes ----- */
const VITESSE_DEPLACEMENT = 0.1;   // 0.05 de base
const VITESSE_ROTATION = 1.75;     // 0.1  de base 
const RAYON_JOUEUR = 0.2; // pour les collisions, légèrement plus petit que 0.5 pour éviter de rester coincé

/* ----- Variables -----*/
let joueur = {
    x: 15.5,
    y: 0.1,
    z: 16.5,
    angle: -90
};


/* ----- Fonctions -----*/

/*
|-----------------------------------------------------------------------------|
| initPositionJoueur:
|   Reinitialise la position du joueur à sa position de départ
|-----------------------------------------------------------------------------|
*/
function initPositionJoueur() {
    joueur.x = 15.5;
    joueur.y = 0.1;
    joueur.z = 16.5;
    joueur.angle = -90;
}

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


/*
|-----------------------------------------------------------------------------|
| estCelluleBloquante:
|   Retourne vrai si la cellule est bloquante
|-----------------------------------------------------------------------------|
*/
function estCelluleBloquante(ligne, colonne) {
    let cellule = obtenirCellule(ligne, colonne);

    if (cellule === null) {
        return true;
    }

    return cellule.estBloquante();
}

/*
|-----------------------------------------------------------------------------|
| peutSeDeplacer:
|   Vérifie si le déplacement est possible
|-----------------------------------------------------------------------------|
(x - R)        (x + R)
    •────────•   ↑
    │        │   |
    │   C    │   | Z
    │        │   ↓
    •────────•
*/
function peutSeDeplacer(x, z) {
    let pointsATester = [ //verifier les 4 coins du joueur pour éviter de rester coincé dans les murs ou voir a travers les murs
        { x: x - RAYON_JOUEUR, z: z - RAYON_JOUEUR },     // haut-gauche
        { x: x + RAYON_JOUEUR, z: z - RAYON_JOUEUR },      // haut-droite
        { x: x - RAYON_JOUEUR, z: z + RAYON_JOUEUR },      // bas-gauche
        { x: x + RAYON_JOUEUR, z: z + RAYON_JOUEUR },      // bas-droite
    ];

    for (let i = 0; i < pointsATester.length; i++) {
        let cellule = obtenirCelluleDepuisPosition(
            pointsATester[i].x,
            pointsATester[i].z
        );

        if (estCelluleBloquante(cellule.ligne, cellule.colonne)) {
            return false;
        }
    }
    
    return true;
}

/*
|-----------------------------------------------------------------------------|
| tournerGauche:
|   Change la direction du joueur vers la gauche
|-----------------------------------------------------------------------------|
*/
function tournerGauche() {
    joueur.angle -= VITESSE_ROTATION;
}

/*
|-----------------------------------------------------------------------------|
| tournerDroite:
|   Change la direction du joueur vers la droite
|-----------------------------------------------------------------------------|
*/
function tournerDroite() {
    joueur.angle += VITESSE_ROTATION;
}

/*
|-----------------------------------------------------------------------------|
| avancer:
|   Fait avancer le joueur
|-----------------------------------------------------------------------------|
*/
function avancer() {
    deplacerJoueur(1);
}

/*
|-----------------------------------------------------------------------------|
| reculer:
|   Fait reculer le joueur
|-----------------------------------------------------------------------------|
*/
function reculer() {
    deplacerJoueur(-1);
}

/*
|-----------------------------------------------------------------------------|
| deplacerJoueur:
|   Déplace le joueur dans la direction actuelle en fonction du facteur
|-----------------------------------------------------------------------------|
*/
function deplacerJoueur(facteur) {
    let direction = obtenirDirectionVecteur();

    let newX = joueur.x + direction.x * VITESSE_DEPLACEMENT * facteur;
    let newZ = joueur.z + direction.z * VITESSE_DEPLACEMENT * facteur;

    if (peutSeDeplacer(newX, newZ)) {
        joueur.x = newX;
        joueur.z = newZ;
    } else {
        if (peutSeDeplacer(newX, joueur.z)) {
            joueur.x = newX;
        }

        if (peutSeDeplacer(joueur.x, newZ)) {
            joueur.z = newZ;
        }
    }

    let nouvelleCellule = obtenirCelluleDepuisPosition(joueur.x, joueur.z);
    verifierSortieEnclos(nouvelleCellule);
    verifierTresorAtteint(nouvelleCellule);
}

/*
|-----------------------------------------------------------------------------|
| obtenirDirectionVecteur:
|   Retourne la direction du joueu sous forme de vecteur pour la caméra
|-----------------------------------------------------------------------------|
*/
function obtenirDirectionVecteur() {
    let angleRad = joueur.angle * Math.PI / 180;

    return {
        x: Math.cos(angleRad),
        z: Math.sin(angleRad)
    };
}

/*
|-----------------------------------------------------------------------------|
| obtenirCelluleDevantJoueur:
|   Retourne la cellule située directement devant le joueur
|-----------------------------------------------------------------------------|
*/
function obtenirCelluleDevantJoueur() {
    let direction = obtenirDirectionVecteur();

    let xDevant = joueur.x + direction.x;
    let zDevant = joueur.z + direction.z;

    return obtenirCelluleDepuisPosition(xDevant, zDevant);
}

/*
|-----------------------------------------------------------------------------|
| trouverMur3D:
|   Trouve le mur 3D correspondant à une cellule
|-----------------------------------------------------------------------------|
*/
function trouverMur3D(ligne, colonne) {
    for (let i = 0; i < tabMurs.length; i++) {
        if (tabMurs[i].ligne === ligne && tabMurs[i].col === colonne) {
            return tabMurs[i];
        }
    }

    return null;
}

/*
|-----------------------------------------------------------------------------|
| ouvrirMurDevantJoueur:
|   Ouvre le mur ouvrable situé directement devant le joueur
|-----------------------------------------------------------------------------|
*/
function ouvrirMurDevantJoueur() {
    let celluleDevant = obtenirCelluleDevantJoueur();

    let cellule = obtenirCellule(celluleDevant.ligne, celluleDevant.colonne);

    if (cellule === null) {
        return false;
    }

    let murOuvert = cellule.ouvrir();

    if (!murOuvert) {
        return false;
    }
    
    let mur3D = trouverMur3D(celluleDevant.ligne, celluleDevant.colonne);

    if (mur3D !== null) {
        ouvrirMurGraphiquement(mur3D);
    }

    return true;
}

/*
|-----------------------------------------------------------------------------|
| verifierSortieEnclos:
|   Ferme l'enclos quand le joueur sort par la sortie nord
|-----------------------------------------------------------------------------|
*/
function verifierSortieEnclos(nouvelleCellule) {
    if (gameState.porteEnclosFermee) {
        return;
    }

    if (
        nouvelleCellule.ligne === 12 &&
        nouvelleCellule.colonne === 15 &&
        joueur.z < 12.7
    ) {
        demanderFermetureEnclos();
    }
}

/*
|-----------------------------------------------------------------------------|
| verifierTresorAtteint:
|   Fait gagner le niveau si le joueur atteint la cellule du trésor
|-----------------------------------------------------------------------------|
*/
function verifierTresorAtteint(celluleJoueur) {
    let tresor = obtenirTresorNiveau();

    if (tresor === null) {
        return;
    }

    if (
        celluleJoueur.ligne === tresor.ligne &&
        celluleJoueur.colonne === tresor.colonne
    ) {
        gagnerNiveau();
    }
}
