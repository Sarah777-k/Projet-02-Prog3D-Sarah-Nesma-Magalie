/*
    Fichier: maze.js
    Nom: Sarah Khodjaoui
    But: Gestion du plateau / labyrinthe
*/

// ============================================================
//  Dédale 31x31 conforme au plan de l'énoncé (TP2 Thesaurus)
//
//  Types de cellules :
//    0 = couloir (noir)
//    1 = mur ouvrable (rouge)
//    2 = mur non ouvrable (vert foncé — bordure)
//    3 = enclos (vert clair + jaune au centre)
// ============================================================

// ----- Constantes locales -----------------------------------
const TAILLE_DEDALE   = 31;
const TAILLE_CASE     = 20;
const TYPE_COULOIR    = 0;
const TYPE_MUR_OUV    = 1;   // mur ouvrable (rouge)
const TYPE_MUR_SOLIDE = 2;   // mur non ouvrable (vert foncé)
const TYPE_ENCLOS     = 3;   // enclos (jaune)
const TYPE_PORTE_ENCLOS = 4; //porte enclos

// ----- La matrice du dédale ---------------------------------
// Respecte le plan de l'énoncé à la lettre.
// Ligne 0 = nord (haut de l'image), ligne 30 = sud (bas).
// Colonne 0 = ouest (gauche), colonne 30 = est (droite).
//
// Enclos : lignes 14-18, colonnes 13-17
//   Centre jaune  : [15-17][14-16]
//   Bordure verte : reste de la zone 14-18 / 13-17
//   Sortie nord   : [13][15] = couloir (le joueur démarre ici
//                              et regarde vers le nord = ligne 12)

const grilleDédale = [

/* 00 */ [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
/* 01 */ [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
/* 02 */ [2, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 2],
/* 03 */ [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
/* 04 */ [2, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 2],
/* 05 */ [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
/* 06 */ [2, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 2],
/* 07 */ [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
/* 08 */ [2, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 2],
/* 10 */ [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
/* 10 */ [2, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 2],
/* 11 */ [2, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 2],
/* 12 */ [2, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 2],
/* 13 */ [2, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 2, 2, 4, 2, 2, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 2],
/* 14 */ [2, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 2, 3, 3, 3, 2, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 2],
/* 15 */ [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 2, 3, 3, 3, 2, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
/* 17 */ [2, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 2, 3, 3, 3, 2, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 2],
/* 16 */ [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 2, 2, 2, 2, 2, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
/* 18 */ [2, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 2],
/* 19 */ [2, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 2],
/* 20 */ [2, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 2],
/* 21 */ [2, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 2],
/* 22 */ [2, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 2],
/* 23 */ [2, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 2],
/* 24 */ [2, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 2],
/* 25 */ [2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2],
/* 26 */ [2, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 2],
/* 27 */ [2, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 2],
/* 28 */ [2, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 2],
/* 29 */ [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
/* 30 */ [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];
let grille = [];


// ============================================================
//  Fonctions utilitaires du dédale
// ============================================================
function initDédale() {
    grille = [];
    objTab = new Object();
    //mettre grille en type cellule pour pouvoir faire les fonctions de type estMurOuvrable etc
  
    for (let i = 0; i < TAILLE_DEDALE; i++) {
        grille.push([]);
        for (let j = 0; j < TAILLE_DEDALE; j++) {
            grille[i].push(new Cell(grilleDédale[i][j], i, j));
        }
    }
    objTab.grille = grille;
    objTab.obtenirTypeCellule = obtenirTypeCellule;
    objTab.intNbrLignes = TAILLE_DEDALE;
    objTab.intNbrColonnes = TAILLE_DEDALE;
    objTab.largeurCellule = 1;
}

function obtenirCellule(ligne, colonne) {
    if (
        ligne < 0 ||
        ligne >= TAILLE_DEDALE ||
        colonne < 0 ||
        colonne >= TAILLE_DEDALE
    ) {
        return null;
    }
    return grille[ligne][colonne];
}

function obtenirTypeCellule(ligne, colonne) {
    return obtenirCellule(ligne, colonne).type;
}

//pour voir si c'est un mur ouvrable ou pas comme image prof
function dessinerDédale() {
    let objCanvas = document.getElementById('monCanvas');
    let ctx = objCanvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, objCanvas.width, objCanvas.height); // Efface le canvas avant de dessiner

    for (let i = 0; i < TAILLE_DEDALE; i++) {
        for (let j = 0; j < TAILLE_DEDALE; j++) {
            let typeCellule = obtenirTypeCellule(i, j);
            switch (typeCellule) {
                case TYPE_COULOIR:
                    ctx.fillStyle = 'black';
                    break;
                case TYPE_MUR_OUV:
                    ctx.fillStyle = 'red';
                   
                    break;
                case TYPE_MUR_SOLIDE:
                     ctx.fillStyle = 'lightgreen';
                    
                    break;
                case TYPE_ENCLOS:
                        ctx.fillStyle = 'yellow';
                    break;
            }
            ctx.fillRect(j * TAILLE_CASE, i * TAILLE_CASE, TAILLE_CASE - 1, TAILLE_CASE - 1);
            
        }
    }
}
