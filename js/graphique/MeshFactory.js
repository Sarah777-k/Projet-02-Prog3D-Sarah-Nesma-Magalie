/*
    Fichier: MeshFactory.js
    Nom: Sarah Khodjaoui
    But: Gère la création des objets 3D (meshes) utilisés dans le jeu.

    * Responsabilités:
    * - Créer les formes 3D (cube, plan, flèche, etc.)
    * - Associer les matériaux aux objets
    * - Standardiser la construction des éléments visuels du dédale
    *
    * Utilisé par:
    * - Les entités (mur, flèche, téléporteur, trésor, etc.)
*/


//  Un "mesh" ici = un objet { bufferSommets, bufferIndices,
//                              bufferTexCoords, nbIndices }
//
//  Toutes les dimensions respectent l'énoncé :
//    - cellule    = 1x1
//    - mur        = 1 x HAUTEUR_MUR x 1
//    - plancher   = 31 x 31
//    - plafond    = 31 x 31
//    - objets 3D  = max 1x1 en emprise au sol
//
//  Usage :
//    let mesh = creerMeshMur(TYPE_MUR_OUV);
//    dessinerMesh(gl, shaderProgram, mesh, matrice);
// ============================================================

// ----- Constantes de géométrie ------------------------------
const HAUTEUR_SOUBASSEMENT =0.1
let HAUTEUR_MUR    = 2.5;   // hauteur des murs (atteint le plafond)
let HAUTEUR_Y_CAM  = 1.0;   // hauteur des yeux du joueur (Y de la caméra)
let HAUTEUR_PLAFOND = HAUTEUR_MUR-1.5; // le plafond est à la même hauteur que le sommet des murs
   // redéfini ici pour MeshFactory (même valeur que maze.js)

// ============================================================
//  Fonctions de création de buffers WebGL
// ============================================================

// Crée un buffer WebGL et y charge des données
function creerBuffer(gl, type, donnees) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, donnees, gl.STATIC_DRAW);
    return buffer;
}
//=============================================================
//mesh position joueur
//=============================================================
function creeMeshPosition2D(gl) {
    let y = 0;
    let r = 0.4;    // longueur de la pointe (vers +X)
    let l = 0.25;   // demi-largeur de la base (vers ±Z)
    let q = 0.15;   // recul de la queue (vers -X)

    // Flèche centrée en (0.5, y, 0.5)
    // Pointe → +X, queue → -X
    

    let sommets = new Float32Array([
        // pointe (avant, vers +X)
        0.5 + r,   y,  0.5,          // 0 — pointe

        // aile gauche
        0.5,       y,  0.5 - l,      // 1 — gauche

        // encoche queue gauche
        0.5 - q,   y,  0.5 - l*0.4,  // 2 — renfoncement gauche

        // encoche queue droite
        0.5 - q,   y,  0.5 + l*0.4,  // 3 — renfoncement droit

        // aile droite
        0.5,       y,  0.5 + l,      // 4 — droite
    ]);

    let texCoords = new Float32Array([
        0.5, 1.0,   // pointe
        0.0, 0.0,   // gauche
        0.3, 0.4,   // encoche gauche
        0.3, 0.6,   // encoche droite
        1.0, 0.0    // droite
    ]);

    // 3 triangles pour couvrir la forme en chevron
    let indices = new Uint16Array([
        0, 1, 2,   // triangle gauche
        0, 2, 3,   // triangle centre
        0, 3, 4    // triangle droit
    ]);

    // Normale vers le bas (face regardant vers le bas = visible du dessus)
    let normales = new Float32Array([
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
    ]);

    return {
        bufferSommets:   creerBuffer(gl, gl.ARRAY_BUFFER,         sommets),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER,         texCoords),
        bufferNormales:  creerBuffer(gl, gl.ARRAY_BUFFER,         normales),
        bufferIndices:   creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices),
        nbIndices:       indices.length
    };
}

// ============================================================
//  MUR  (parallélépipède 1 x HAUTEUR_MUR x 1)
//  Origine locale : coin bas-gauche-devant à (0, 0, 0)
//  À positionner à (col, 0, ligne) dans la scène
//  On crée donc 5 faces seulement (pas le dessous)
// ============================================================
function creerMeshMur(gl) {
    let h = HAUTEUR_MUR;
 
    // 8 sommets du cube (x, y, z)
    //   bas : 0-3   haut : 4-7
    //   0=(0,0,0)  1=(1,0,0)  2=(1,0,1)  3=(0,0,1)
    //   4=(0,h,0)  5=(1,h,0)  6=(1,h,1)  7=(0,h,1)
    let sommets = new Float32Array([
        // Face avant  (z=0)
        0, 0, 0,   1, 0, 0,   1, h, 0,   0, h, 0,
        // Face arrière (z=1)
        1, 0, 1,   0, 0, 1,   0, h, 1,   1, h, 1,
        // Face gauche  (x=0)
        0, 0, 1,   0, 0, 0,   0, h, 0,   0, h, 1,
        // Face droite  (x=1)
        1, 0, 0,   1, 0, 1,   1, h, 1,   1, h, 0,
        // Face dessus  (y=h)
        0, h, 0,   1, h, 0,   1, h, 1,   0, h, 1
        // Face dessous (y=0) : omise — collée sur le plancher, non visible
    ]);
 
    // Coordonnées de texture UV pour chaque face (répétées par face)
    let texCoords = new Float32Array([
        0,0, 1,0, 1,1, 0,1,  // avant  (se répète 2.5x en hauteur)
        0,0, 1,0, 1,1, 0,1,  // arrière
        0,0, 1,0, 1,1, 0,1,  // gauche
        0,0, 1,0, 1,1, 0,1,  // droite
        0,0, 1,0, 1,1, 0,1        // dessus
    ]);
 
    // Indices (2 triangles par face × 5 faces)
    let indices = new Uint16Array([
         0, 1, 2,   0, 2, 3,   // avant
         4, 5, 6,   4, 6, 7,   // arrière
         8, 9,10,   8,10,11,   // gauche
        12,13,14,  12,14,15,   // droite
        16,17,18,  16,18,19    // dessus
    ]);
    let normales = new Float32Array([
    // face avant z=0
    0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,

    // face arrière z=1
    0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,

    // face gauche x=0
    -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,

    // face droite x=1
    1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,

    // dessus y=h
    0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0
]);
    return {
        bufferSommets:  creerBuffer(gl, gl.ARRAY_BUFFER,         sommets),
        bufferTexCoords:creerBuffer(gl, gl.ARRAY_BUFFER,         texCoords),
        bufferNormales: creerBuffer(gl, gl.ARRAY_BUFFER, normales),
        bufferIndices:  creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices),
        nbIndices:      indices.length
    };
}

//====================================================
// decoration du mur en bas
//====================================================
function creerMeshSoubassement(gl) {
    let h = HAUTEUR_SOUBASSEMENT;
    let e = 0.015; // petit décalage pour éviter le z-fighting

    let sommets = new Float32Array([
        // face avant z = -e
        0, 0, -e,   1, 0, -e,   1, h, -e,   0, h, -e,

        // face arrière z = 1 + e
        1, 0, 1 + e,   0, 0, 1 + e,   0, h, 1 + e,   1, h, 1 + e,

        // face gauche x = -e
        -e, 0, 1,   -e, 0, 0,   -e, h, 0,   -e, h, 1,

        // face droite x = 1 + e
        1 + e, 0, 0,   1 + e, 0, 1,   1 + e, h, 1,   1 + e, h, 0,
        // dessus avant
        0, h, -e,   1, h, -e,   1, h, 0,   0, h, 0,

        // dessus arrière
        0, h, 1,   1, h, 1,   1, h, 1 + e,   0, h, 1 + e,

        // dessus gauche
        -e, h, 0,   0, h, 0,   0, h, 1,   -e, h, 1,

        // dessus droite
        1, h, 0,   1 + e, h, 0,   1 + e, h, 1,   1, h, 1
    ]);

    let texCoords = new Float32Array([
        0,0, 1,0, 1,1, 0,1,
        0,0, 1,0, 1,1, 0,1,
        0,0, 1,0, 1,1, 0,1,
        0,0, 1,0, 1,1, 0,1
    ]);

    let indices = new Uint16Array([
        0,1,2, 0,2,3,
        4,5,6, 4,6,7,
        8,9,10, 8,10,11,
        12,13,14, 12,14,15,
        16,17,18, 16,18,19,
        20,21,22, 20,22,23,
        24,25,26, 24,26,27,
        28,29,30, 28,30,31
    ]);
    let normales = new Float32Array([
        // face avant z=0
        0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,

        // face arrière z=1
        0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,

        // face gauche x=0
        -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,

        // face droite x=1
        1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,

        // dessus y=h
        0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0
]);

    return {
        bufferSommets: creerBuffer(gl, gl.ARRAY_BUFFER, sommets),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER, texCoords),
        bufferNormales: creerBuffer(gl, gl.ARRAY_BUFFER, normales),
        bufferIndices: creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices),
        nbIndices: indices.length
    };
}

// ============================================================
//  PLANCHER  (rectangle 31x31, Y=0, dans le plan XZ)
//  Subdivisé en tuiles pour que la texture se répète bien
// ============================================================
function creerMeshPlancher(gl) {
    let taille = TAILLE_DEDALE;   // 31
    let repetes = taille;         // répétition de la texture (1 tuile = 1 cellule)

    let sommets   = new Float32Array([
        0,     0, 0,
        taille, 0, 0,
        taille, 0, taille,
        0,     0, taille
    ]);
    let texCoords = new Float32Array([
        0,      0,
        repetes, 0,
        repetes, repetes,
        0,      repetes
    ]);
    let indices = new Uint16Array([0, 1, 2,   0, 2, 3]);

    let normales = new Float32Array([
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0
    ]);
    return {
        bufferSommets:   creerBuffer(gl, gl.ARRAY_BUFFER,         sommets),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER,         texCoords),
        bufferNormales: creerBuffer(gl, gl.ARRAY_BUFFER, normales),
        bufferIndices:   creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices),
        nbIndices:       indices.length
    };
}

function creerMeshEnclos(gl) {
    let largeur = 3;
    let profondeur = 3;

    let sommets = new Float32Array([
        0, 0, 0,
        largeur, 0, 0,
        largeur, 0, profondeur,
        0, 0, profondeur
    ]);

    let texCoords = new Float32Array([
        0, 0,
        3, 0,
        3, 3,
        0, 3
    ]);

    let indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

    let normales = new Float32Array([
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0
        ]);
    

    return {
        bufferSommets: creerBuffer(gl, gl.ARRAY_BUFFER, sommets),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER, texCoords),
        bufferNormales: creerBuffer(gl, gl.ARRAY_BUFFER, normales),
        bufferIndices: creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices),
        nbIndices: indices.length
    };
}
// ============================================================
//  PLAFOND  (rectangle 31x31, Y=HAUTEUR_PLAFOND)
//  Faces vers le bas (normales inversées par rapport au plancher)
// ============================================================
function creerMeshPlafond(gl) {
    let taille  = 31;
    let y       = HAUTEUR_PLAFOND;
    let repetes = taille;

    let sommets = new Float32Array([
        0,     y, 0,
        taille, y, 0,
        taille, y, taille,
        0,     y, taille
    ]);
    let texCoords = new Float32Array([
        0,      0,
        repetes, 0,
        repetes, repetes,
        0,      repetes
    ]);
    // Ordre inversé pour que la face regarde vers le bas
    let indices = new Uint16Array([0, 2, 1,   0, 3, 2]);
     let normales = new Float32Array([
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0
    ]);

    return {
        bufferSommets:   creerBuffer(gl, gl.ARRAY_BUFFER,         sommets),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER,         texCoords),
        bufferNormales: creerBuffer(gl, gl.ARRAY_BUFFER, normales),
        bufferIndices:   creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices),
        nbIndices:       indices.length
    };
}

// ============================================================
//  FLÈCHE  (pyramide à base carrée — non plate, a une pointe)
//  Suspendue dans les airs (Y de base = HAUTEUR_PLAFOND - 0.9)
//  Max 1x1 en emprise au sol 
//  Axe naturel de la flèche : pointe vers +X (angle 0)
//  Personne 2 fait tourner le mesh selon la direction du trésor
///////////// ajouter variabke normal 

// ============================================================
function creerMeshFleche(gl) {
    let yBas = 0.3;
    let yHaut = 0.12         // hauteur de la pointe
   
    // Base carrée centrée en (0.5, yBase, 0.5) — centrée dans la cellule

  
    let sommets = new Float32Array([
       // rectangle arrière
        0.10, yBas, 0.35,
        0.55, yBas, 0.35,
        0.55, yBas, 0.65,
        0.10, yBas, 0.65,

        // pointe
        0.55, yBas, 0.20,
        0.95, yBas, 0.50,
        0.55, yBas, 0.80,

        // mêmes sommets en haut
        0.10, yHaut, 0.35,
        0.55, yHaut, 0.35,
        0.55, yHaut, 0.65,
        0.10, yHaut, 0.65,

        0.55, yHaut, 0.20,
        0.95, yHaut, 0.50,
        0.55, yHaut, 0.80
       ]);

    let texCoords = new Float32Array([
        0,0, 1,0, 1,1, 0,1,
        0,0, 1,0.5, 0,1,
        0,0, 1,0, 1,1, 0,1,
        0,0, 1,0.5, 0,1
    ]);

    let indices = new Uint16Array([
      // dessous
        0,1,2, 0,2,3,
        4,5,6,

        // dessus
        7,10,9, 7,9,8,
        11,12,13,

        // côtés rectangle
        0,7,8, 0,8,1,
        1,8,9, 1,9,2,
        2,9,10, 2,10,3,
        3,10,7, 3,7,0,

        // côtés pointe
        4,11,12, 4,12,5,
        5,12,13, 5,13,6,
        6,13,11, 6,11,4
    ]);
     
    let normales = new Float32Array(new Array(sommets.length).fill(0));
    for (let i = 0; i < normales.length; i += 3) {
        normales[i] = 0;
        normales[i + 1] = 1;
        normales[i + 2] = 0;
    }

    return {
        bufferSommets:   creerBuffer(gl, gl.ARRAY_BUFFER,         sommets),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER,         texCoords),
        bufferNormales: creerBuffer(gl, gl.ARRAY_BUFFER, normales),
        bufferIndices:   creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices),
        nbIndices:       indices.length
    };
}

// ============================================================
//  TÉLÉ-TRANSPORTEUR  (cylindre simplifié = prisme octogonal)
//  Repose sur le plancher (Y=0) 
//  Max 1x1 — non plat
//  Visuellement différent du récepteur (couleur gérée dans MaterialFactory)


function creerMeshTeleporteur(gl) {
    let h = 0.18;      // hauteur basse
    let cx = 0.5;
    let cz = 0.5;
    let r = 0.48;      // taille presque 1x1
    let cut = 0.18;    // coupe des coins

    let sommets = new Float32Array([
        // dessus octogonal y = h
        cut, h, 0,      1-cut, h, 0,
        1, h, cut,      1, h, 1-cut,
        1-cut, h, 1,    cut, h, 1,
        0, h, 1-cut,    0, h, cut,

        // dessous octogonal y = 0
        cut, 0, 0,      1-cut, 0, 0,
        1, 0, cut,      1, 0, 1-cut,
        1-cut, 0, 1,    cut, 0, 1,
        0, 0, 1-cut,    0, 0, cut
    ]);

    let texCoords = new Float32Array([
        // dessus
        cut,0,   1-cut,0,
        1,cut,   1,1-cut,
        1-cut,1, cut,1,
        0,1-cut, 0,cut,

        // dessous / côtés
        cut,0,   1-cut,0,
        1,cut,   1,1-cut,
        1-cut,1, cut,1,
        0,1-cut, 0,cut
    ]);

    let indices = new Uint16Array([
        // dessus
        0,1,2,  0,2,3,  0,3,4,
        0,4,5,  0,5,6,  0,6,7,

        // côtés
        0,8,9,   0,9,1,
        1,9,10,  1,10,2,
        2,10,11, 2,11,3,
        3,11,12, 3,12,4,
        4,12,13, 4,13,5,
        5,13,14, 5,14,6,
        6,14,15, 6,15,7,
        7,15,8,  7,8,0,

        // dessous
        8,10,9,  8,11,10, 8,12,11,
        8,13,12, 8,14,13, 8,15,14
    ]);

    let normales = new Float32Array([
        // dessus
        0,1,0, 0,1,0, 0,1,0, 0,1,0,
        0,1,0, 0,1,0, 0,1,0, 0,1,0,

        // dessous / approx côtés
        0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
        0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0
    ]);

    return {
        bufferSommets: creerBuffer(gl, gl.ARRAY_BUFFER, sommets),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER, texCoords),
        bufferNormales: creerBuffer(gl, gl.ARRAY_BUFFER, normales),
        bufferIndices: creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices),
        nbIndices: indices.length
    };
}

// ============================================================
//  TÉLÉ-RÉCEPTEUR  (anneau / tore simplifié = cylindre creux)
//  Visuellement différent du transporteur
//  Repose sur le plancher — max 1x1 — non plat

// mais j'utilise la meme mesh que teleporteur mais texture differente 

// ============================================================
function creerMeshRecepteur(gl) {
    let hExt  = 0.5;  // hauteur totale
    let rExt  = 0.42; // rayon extérieur
    let rInt  = 0.22; // rayon intérieur (creux au centre)
    let cx    = 0.5;
    let cz    = 0.5;
    let n     = 8;

    let sommets   = [];
    let texCoords = [];
    let indices   = [];
    let normales = [];
    let idx       = 0;

    for (let i = 0; i < n; i++) {
        let a1 = (i / n)       * 2 * Math.PI;
        let a2 = ((i+1) % n) / n * 2 * Math.PI;

        // 4 sommets du segment de l'anneau
        let xExt1 = cx + rExt * Math.cos(a1);
        let zExt1 = cz + rExt * Math.sin(a1);
        let xInt1 = cx + rInt * Math.cos(a1);
        let zInt1 = cz + rInt * Math.sin(a1);
        let xExt2 = cx + rExt * Math.cos(a2);
        let zExt2 = cz + rExt * Math.sin(a2);
        let xInt2 = cx + rInt * Math.cos(a2);
        let zInt2 = cz + rInt * Math.sin(a2);

        // Face haute de l'anneau
        sommets.push(xExt1,hExt,zExt1, xInt1,hExt,zInt1, xInt2,hExt,zInt2, xExt2,hExt,zExt2);
        texCoords.push(0,0, 1,0, 1,1, 0,1);
        indices.push(idx,idx+1,idx+2, idx,idx+2,idx+3);
        idx += 4;

        // Face basse de l'anneau
        sommets.push(xExt1,0,zExt1, xInt1,0,zInt1, xInt2,0,zInt2, xExt2,0,zExt2);
        texCoords.push(0,0, 1,0, 1,1, 0,1);
        indices.push(idx,idx+2,idx+1, idx,idx+3,idx+2);
        idx += 4;

        // Face extérieure
        sommets.push(xExt1,0,zExt1, xExt2,0,zExt2, xExt2,hExt,zExt2, xExt1,hExt,zExt1);
        texCoords.push(0,0, 1,0, 1,1, 0,1);
        indices.push(idx,idx+1,idx+2, idx,idx+2,idx+3);
        idx += 4;

        // Face intérieure
        sommets.push(xInt1,0,zInt1, xInt2,0,zInt2, xInt2,hExt,zInt2, xInt1,hExt,zInt1);
        texCoords.push(0,0, 1,0, 1,1, 0,1);
        indices.push(idx,idx+2,idx+1, idx,idx+3,idx+2);
        idx += 4;
        //
        
        //face haut 
        normales.push(
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0
        );
        //face basse
        normales.push(
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0
        );
        //face exterieur
        let nxExt1 = Math.cos(a1);
        let nzExt1 = Math.sin(a1);
        let nxExt2 = Math.cos(a2);
        let nzExt2 = Math.sin(a2);

        normales.push(
            nxExt1, 0, nzExt1,
            nxExt2, 0, nzExt2,
            nxExt2, 0, nzExt2,
            nxExt1, 0, nzExt1
        );
        //face interieur
        let nxInt1 = -Math.cos(a1);
        let nzInt1 = -Math.sin(a1);
        let nxInt2 = -Math.cos(a2);
        let nzInt2 = -Math.sin(a2);

        normales.push(
            nxInt1, 0, nzInt1,
            nxInt2, 0, nzInt2,
            nxInt2, 0, nzInt2,
            nxInt1, 0, nzInt1
        );

    }

    return {
        bufferSommets:   creerBuffer(gl, gl.ARRAY_BUFFER,         new Float32Array(sommets)),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER,         new Float32Array(texCoords)),
        bufferNormales: creerBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(normales)),
        bufferIndices:   creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices)),
        nbIndices:       indices.length
    };
}

// ============================================================
//  TRÉSOR  (boîte légèrement trapézoïdale — coffre)
//  Repose sur le plancher — max 1x1 — non plat 

// ============================================================
function creerMeshTresor(gl) {
    let larg = 0.7;  // largeur (X)
    let haut = 0.5;  // hauteur totale
    let prof = 0.45; // profondeur (Z)
    // Centré dans la cellule
    let ox = (1 - larg) / 2;  // offset X
    let oz = (1 - prof) / 2;  // offset Z
    let hCorps = haut * 0.65; // hauteur du corps
    let hCouvercle = haut - hCorps;

    // Corps (boîte basse)
    let x0=ox, x1=ox+larg, z0=oz, z1=oz+prof;
    let y0=0,  y1=hCorps,  y2=haut;

    let d = 0.03; // débordement du couvercle

    // Construire les sommets en tableau JS d'abord
    let tabSommets = [
        // Corps — 6 faces × 4 sommets
        // Avant
        x0,y0,z0, x1,y0,z0, x1,y1,z0, x0,y1,z0,
        // Arrière
        x1,y0,z1, x0,y0,z1, x0,y1,z1, x1,y1,z1,
        // Gauche
        x0,y0,z1, x0,y0,z0, x0,y1,z0, x0,y1,z1,
        // Droite
        x1,y0,z0, x1,y0,z1, x1,y1,z1, x1,y1,z0,
        // Dessous (base)
        x0,y0,z1, x1,y0,z1, x1,y0,z0, x0,y0,z0,
        // Dessus corps
        x0,y1,z0, x1,y1,z0, x1,y1,z1, x0,y1,z1,
        // Couvercle (légèrement plus grand — déborde de d)
        // Avant couvercle
        x0-d, y1, z0-d,  x1+d, y1, z0-d,  x1+d, y2, z0-d,  x0-d, y2, z0-d,
        // Arrière couvercle
        x1+d, y1, z1+d,  x0-d, y1, z1+d,  x0-d, y2, z1+d,  x1+d, y2, z1+d,
        // Gauche couvercle
        x0-d, y1, z1+d,  x0-d, y1, z0-d,  x0-d, y2, z0-d,  x0-d, y2, z1+d,
        // Droite couvercle
        x1+d, y1, z0-d,  x1+d, y1, z1+d,  x1+d, y2, z1+d,  x1+d, y2, z0-d,
        // Dessus couvercle
        x0-d, y2, z0-d,  x1+d, y2, z0-d,  x1+d, y2, z1+d,  x0-d, y2, z1+d
    ];
    let sommets = new Float32Array(tabSommets);
    //aligner avec l'image coffret 
   let tabTex = [
    // Avant
    0.04,0.45,  0.45,0.55,  0.45,0.95,  0.05,0.95,
    // Arrière
    0.55,0.55,  0.95,0.55,  0.95,0.95,  0.55,0.95,

    // Gauche
    0.05,0.05,  0.25,0.05,  0.25,0.45,  0.05,0.45,

    // Droite
    0.30,0.05,  0.50,0.05,  0.50,0.45,  0.30,0.45,

    // Dessous
    0.00,0.00,  1.00,0.00,  1.00,0.15,  0.00,0.15,

    // Dessus corps
    0.55,0.15,  1.00,0.15,  1.00,0.50,  0.55,0.50,

    // Couvercle avant
    0.55,0.55,  0.95,0.55,  0.95,0.95,  0.55,0.95,

    // Couvercle arrière
    0.55,0.55,  0.95,0.55,  0.95,0.95,  0.55,0.95,

    // Couvercle gauche
    0.05,0.05,  0.25,0.05,  0.25,0.45,  0.05,0.45,

    // Couvercle droite
    0.30,0.05,  0.50,0.05,  0.50,0.45,  0.30,0.45,

    // Dessus couvercle
    0.04,0.18,  0.48,0.18,  0.48,0.45,  0.04,0.45,
];

let texCoords = new Float32Array(tabTex);
    // Générer indices pour 11 faces × 2 triangles = 22 triangles
    let indices = [];
    for (let f = 0; f < 11; f++) {
        let b = f * 4;
        indices.push(b, b+1, b+2,  b, b+2, b+3);
    }
    let normales = new Float32Array([
        // Corps — 6 faces
        // Avant z-
        0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1,
        // Arrière z+
        0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
        // Gauche x-
        -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
        // Droite x+
        1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
        // Dessous y-
        0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,
        // Dessus corps y+
        0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,

        // Couvercle — 5 faces
        // Avant couvercle z-
        0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1,
        // Arrière couvercle z+
        0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
        // Gauche couvercle x-
        -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
        // Droite couvercle x+
        1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
        // Dessus couvercle y+
        0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0

    ]);

    return {
        bufferSommets:   creerBuffer(gl, gl.ARRAY_BUFFER,         sommets),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER,         texCoords),
        bufferNormales: creerBuffer(gl, gl.ARRAY_BUFFER, normales),
        bufferIndices:   creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices)),
        nbIndices:       indices.length
    };
}


// ============================================================
//  Dessiner un mesh
//  Applique la matrice de transformation et envoie tout à WebGL
//
// ============================================================
function dessinerMesh(gl, shaderProgram, mesh, matModeleVue) {
    gl.uniformMatrix4fv(shaderProgram.matModeleVue, false, matModeleVue);

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufferSommets);
    gl.vertexAttribPointer(shaderProgram.posVertex, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufferTexCoords);
    gl.vertexAttribPointer(shaderProgram.posTexel, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.bufferIndices);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufferNormales);
    gl.vertexAttribPointer(shaderProgram.normalVertex, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, mesh.nbIndices, gl.UNSIGNED_SHORT, 0);
}