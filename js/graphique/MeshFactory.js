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

// ============================================================
//  MUR  (parallélépipède 1 x HAUTEUR_MUR x 1)
//  Origine locale : coin bas-gauche-devant à (0, 0, 0)
//  À positionner à (col, 0, ligne) dans la scène
//
//  L'énoncé dit : ne pas texturer la base (face Y=0)
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
        0,0, 1,0, 1,2.5, 0,2.5,  // avant  (se répète 2.5x en hauteur)
        0,0, 1,0, 1,2.5, 0,2.5,  // arrière
        0,0, 1,0, 1,2.5, 0,2.5,  // gauche
        0,0, 1,0, 1,2.5, 0,2.5,  // droite
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
//  Max 1x1 en emprise au sol — énoncé section 3.6
//
//  Axe naturel de la flèche : pointe vers +X (angle 0)
//  Personne 2 fait tourner le mesh selon la direction du trésor
///////////// ajouter variabke normal 

// ============================================================
function creerMeshFleche(gl) {
    let yBase = HAUTEUR_PLAFOND - 0.9;  // hauteur de la base de la pyramide
    let yPointe = yBase + 0.7;           // hauteur de la pointe
    let d = 0.25;                        // demi-largeur (max 0.5 pour rester dans 1x1)

    // Base carrée centrée en (0.5, yBase, 0.5) — centrée dans la cellule

  
    let sommets = new Float32Array([
        // 4 sommets de la base
        0.3, yBase - d,  0.5 - d,   // 0
        0.3, yBase - d , 0.5 + d,   // 1
        0.3, yBase + d , 0.5 - d,   // 2 
        0.3, yBase + d, 0.5 + d,  
   
        1.0, yBase, 0.5  // pointe horizontale vers +X
    ]);

    let texCoords = new Float32Array([
        0,0,  0,1,  1,0,  1,1,
        0.5, 1.0
    ]);

    let indices = new Uint16Array([
        // Base (2 triangles)
        0, 2, 3,   0, 3, 1,
        // 4 faces latérales
        0, 1, 4,   // face arrière
        1, 3, 4,   // face droite
        3, 2, 4,   // face avant
        2, 0, 4    // face gauche
    ]);
     let normales = new Float32Array([
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        1,  1, 0
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
//  TÉLÉ-TRANSPORTEUR  (cylindre simplifié = prisme octogonal)
//  Repose sur le plancher (Y=0) — énoncé section 3.7
//  Max 1x1 — non plat
//  Visuellement différent du récepteur (couleur gérée dans MaterialFactory)
///////////// ajouter variabke normal 

// ============================================================
function creerMeshTeleporteur(gl) {
    let h  = 0.6;   // hauteur
    let r  = 0.38;  // rayon (reste dans 1x1)
    let cx = 0.5;   // centre X dans la cellule
    let cz = 0.5;   // centre Z dans la cellule
    let n  = 8;     // nombre de côtés

    let sommets   = [];
    let texCoords = [];
    let indices   = [];

    // Centre bas (index 0) et centre haut (index 1)
    sommets.push(cx, 0, cz);   texCoords.push(0.5, 0.5);  // centre bas
    sommets.push(cx, h, cz);   texCoords.push(0.5, 0.5);  // centre haut

    // Sommets du périmètre bas (indices 2..n+1) et haut (indices n+2..2n+1)
    for (let i = 0; i < n; i++) {
        let angle = (i / n) * 2 * Math.PI;
        let x = cx + r * Math.cos(angle);
        let z = cz + r * Math.sin(angle);
        sommets.push(x, 0, z);  texCoords.push(0.5 + 0.5*Math.cos(angle), 0.5 + 0.5*Math.sin(angle));
        sommets.push(x, h, z);  texCoords.push(0.5 + 0.5*Math.cos(angle), 0.5 + 0.5*Math.sin(angle));
    }

    // Faces : base + côtés + dessus
    for (let i = 0; i < n; i++) {
        let bas1  = 2 + i * 2;
        let haut1 = 3 + i * 2;
        let bas2  = 2 + ((i + 1) % n) * 2;
        let haut2 = 3 + ((i + 1) % n) * 2;

        // Face base (vers le bas)
        indices.push(0, bas2, bas1);
        // Face dessus (vers le haut)
        indices.push(1, haut1, haut2);
        // 2 triangles côté
        indices.push(bas1, bas2, haut2);
        indices.push(bas1, haut2, haut1);
    }

    return {
        bufferSommets:   creerBuffer(gl, gl.ARRAY_BUFFER,         new Float32Array(sommets)),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER,         new Float32Array(texCoords)),
        bufferNormales: creerBuffer(gl, gl.ARRAY_BUFFER, normales),
        bufferIndices:   creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices)),
        nbIndices:       indices.length
    };
}

// ============================================================
//  TÉLÉ-RÉCEPTEUR  (anneau / tore simplifié = cylindre creux)
//  Visuellement différent du transporteur — énoncé section 3.8
//  Repose sur le plancher — max 1x1 — non plat
///////////// ajouter variabke normal 

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
    }

    return {
        bufferSommets:   creerBuffer(gl, gl.ARRAY_BUFFER,         new Float32Array(sommets)),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER,         new Float32Array(texCoords)),
        bufferNormales: creerBuffer(gl, gl.ARRAY_BUFFER, normales),
        bufferIndices:   creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices)),
        nbIndices:       indices.length
    };
}

// ============================================================
//  TRÉSOR  (boîte légèrement trapézoïdale — coffre)
//  Repose sur le plancher — max 1x1 — non plat — énoncé 3.9
///////////// ajouter variabke normal 

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

    // UV simples (0,0 partout — la couleur dorée suffit)
    let tabTex = [];
    for (let t = 0; t < tabSommets.length / 3; t++) { tabTex.push(0, 0); }
    let texCoords = new Float32Array(tabTex);

    // Générer indices pour 11 faces × 2 triangles = 22 triangles
    let indices = [];
    for (let f = 0; f < 11; f++) {
        let b = f * 4;
        indices.push(b, b+1, b+2,  b, b+2, b+3);
    }
    let normales = new Float32Array([]) 

    return {
        bufferSommets:   creerBuffer(gl, gl.ARRAY_BUFFER,         sommets),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER,         texCoords),
        bufferNormales: creerBuffer(gl, gl.ARRAY_BUFFER, normales),
        bufferIndices:   creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices)),
        nbIndices:       indices.length
    };
}

// ============================================================
//  INDICATEUR JOUEUR (vue aérienne)
//  Petit triangle plat dessiné à Y=HAUTEUR_PLAFOND
//  visible seulement en vue aérienne — énoncé section 5
///////////// ajouter variabke normal 
// ============================================================
function creerMeshIndicateurJoueur(gl) {
    let y  = HAUTEUR_PLAFOND - 0.05;  // juste sous le plafond, bien visible du dessus
    let r  = 0.3;

    // Triangle isocèle pointant vers +X (direction naturelle)
    // Personne 2 (ou Personne 3) fait tourner selon la vraie direction du joueur
    let sommets = new Float32Array([
        0.5 + r,    y, 0.5,         // pointe (avant)
        0.5 - r*0.6, y, 0.5 - r*0.6, // coin gauche
        0.5 - r*0.6, y, 0.5 + r*0.6  // coin droit
    ]);
    let texCoords = new Float32Array([0.5,1, 0,0, 1,0]);
    let indices   = new Uint16Array([0, 1, 2]);

    return {
        bufferSommets:   creerBuffer(gl, gl.ARRAY_BUFFER,         sommets),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER,         texCoords),
        bufferNormales: creerBuffer(gl, gl.ARRAY_BUFFER, normales),
        bufferIndices:   creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices),
        nbIndices:       indices.length
    };
}

// ============================================================
//  Dessiner un mesh
//  Applique la matrice de transformation et envoie tout à WebGL
//
//  Paramètres :
//    gl            : contexte WebGL
//    shaderProgram : programme de shader actif
//    mesh          : objet retourné par une fonction creerMesh*()
//    matrice       : mat4 (glMatrix) = Model matrix de l'objet
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