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
//    var mesh = creerMeshMur(TYPE_MUR_OUV);
//    dessinerMesh(gl, shaderProgram, mesh, matrice);
// ============================================================

// ----- Constantes de géométrie ------------------------------
var HAUTEUR_MUR    = 2.5;   // hauteur des murs (atteint le plafond)
var HAUTEUR_Y_CAM  = 1.0;   // hauteur des yeux du joueur (Y de la caméra)
var HAUTEUR_PLAFOND = HAUTEUR_MUR; // le plafond est à la même hauteur que le sommet des murs
   // redéfini ici pour MeshFactory (même valeur que maze.js)

// ============================================================
//  Fonctions de création de buffers WebGL
// ============================================================

// Crée un buffer WebGL et y charge des données
function creerBuffer(gl, type, donnees) {
    var buffer = gl.createBuffer();
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
    var h = HAUTEUR_MUR;

    // 8 sommets du cube (x, y, z)
    //   bas : 0-3   haut : 4-7
    //   0=(0,0,0)  1=(1,0,0)  2=(1,0,1)  3=(0,0,1)
    //   4=(0,h,0)  5=(1,h,0)  6=(1,h,1)  7=(0,h,1)
    var sommets = new Float32Array([
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
    var texCoords = new Float32Array([
        0,0, 1,0, 1,1, 0,1,  // avant
        0,0, 1,0, 1,1, 0,1,  // arrière
        0,0, 1,0, 1,1, 0,1,  // gauche
        0,0, 1,0, 1,1, 0,1,  // droite
        0,0, 1,0, 1,1, 0,1   // dessus
    ]);

    // Indices (2 triangles par face × 5 faces)
    var indices = new Uint16Array([
         0, 1, 2,   0, 2, 3,   // avant
         4, 5, 6,   4, 6, 7,   // arrière
         8, 9,10,   8,10,11,   // gauche
        12,13,14,  12,14,15,   // droite
        16,17,18,  16,18,19    // dessus
    ]);

    return {
        bufferSommets:  creerBuffer(gl, gl.ARRAY_BUFFER,         sommets),
        bufferTexCoords:creerBuffer(gl, gl.ARRAY_BUFFER,         texCoords),
        bufferIndices:  creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices),
        nbIndices:      indices.length
    };
}

// ============================================================
//  PLANCHER  (rectangle 31x31, Y=0, dans le plan XZ)
//  Subdivisé en tuiles pour que la texture se répète bien
// ============================================================
function creerMeshPlancher(gl) {
    var taille = TAILLE_DEDALE;   // 31
    var repetes = taille;         // répétition de la texture (1 tuile = 1 cellule)

    var sommets   = new Float32Array([
        0,     0, 0,
        taille, 0, 0,
        taille, 0, taille,
        0,     0, taille
    ]);
    var texCoords = new Float32Array([
        0,      0,
        repetes, 0,
        repetes, repetes,
        0,      repetes
    ]);
    var indices = new Uint16Array([0, 1, 2,   0, 2, 3]);

    return {
        bufferSommets:   creerBuffer(gl, gl.ARRAY_BUFFER,         sommets),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER,         texCoords),
        bufferIndices:   creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices),
        nbIndices:       indices.length
    };
}

// ============================================================
//  PLAFOND  (rectangle 31x31, Y=HAUTEUR_PLAFOND)
//  Faces vers le bas (normales inversées par rapport au plancher)
// ============================================================
function creerMeshPlafond(gl) {
    var taille  = TAILLE_DEDALE;
    var y       = HAUTEUR_PLAFOND;
    var repetes = taille;

    var sommets = new Float32Array([
        0,     y, 0,
        taille, y, 0,
        taille, y, taille,
        0,     y, taille
    ]);
    var texCoords = new Float32Array([
        0,      0,
        repetes, 0,
        repetes, repetes,
        0,      repetes
    ]);
    // Ordre inversé pour que la face regarde vers le bas
    var indices = new Uint16Array([0, 2, 1,   0, 3, 2]);

    return {
        bufferSommets:   creerBuffer(gl, gl.ARRAY_BUFFER,         sommets),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER,         texCoords),
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
// ============================================================
function creerMeshFleche(gl) {
    var yBase = HAUTEUR_PLAFOND - 0.9;  // hauteur de la base de la pyramide
    var yPointe = yBase + 0.7;           // hauteur de la pointe
    var d = 0.35;                        // demi-largeur (max 0.5 pour rester dans 1x1)

    // Base carrée centrée en (0.5, yBase, 0.5) — centrée dans la cellule
    // Pointe vers +X (colonne+1)
    var sommets = new Float32Array([
        // 4 sommets de la base
        0.5-d, yBase, 0.5-d,   // 0
        0.5-d, yBase, 0.5+d,   // 1
        0.5+d, yBase, 0.5-d,   // 2  (côté pointe)
        0.5+d, yBase, 0.5+d,   // 3  (côté pointe)
        // Pointe (vers +X)
        0.5+0.5, yPointe, 0.5  // 4  pointe
    ]);

    var texCoords = new Float32Array([
        0,0,  0,1,  1,0,  1,1,
        0.5, 1.0
    ]);

    var indices = new Uint16Array([
        // Base (2 triangles)
        0, 2, 3,   0, 3, 1,
        // 4 faces latérales
        0, 1, 4,   // face arrière
        1, 3, 4,   // face droite
        3, 2, 4,   // face avant
        2, 0, 4    // face gauche
    ]);

    return {
        bufferSommets:   creerBuffer(gl, gl.ARRAY_BUFFER,         sommets),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER,         texCoords),
        bufferIndices:   creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices),
        nbIndices:       indices.length
    };
}

// ============================================================
//  TÉLÉ-TRANSPORTEUR  (cylindre simplifié = prisme octogonal)
//  Repose sur le plancher (Y=0) — énoncé section 3.7
//  Max 1x1 — non plat
//  Visuellement différent du récepteur (couleur gérée dans MaterialFactory)
// ============================================================
function creerMeshTeleporteur(gl) {
    var h  = 0.6;   // hauteur
    var r  = 0.38;  // rayon (reste dans 1x1)
    var cx = 0.5;   // centre X dans la cellule
    var cz = 0.5;   // centre Z dans la cellule
    var n  = 8;     // nombre de côtés

    var sommets   = [];
    var texCoords = [];
    var indices   = [];

    // Centre bas (index 0) et centre haut (index 1)
    sommets.push(cx, 0, cz);   texCoords.push(0.5, 0.5);  // centre bas
    sommets.push(cx, h, cz);   texCoords.push(0.5, 0.5);  // centre haut

    // Sommets du périmètre bas (indices 2..n+1) et haut (indices n+2..2n+1)
    for (var i = 0; i < n; i++) {
        var angle = (i / n) * 2 * Math.PI;
        var x = cx + r * Math.cos(angle);
        var z = cz + r * Math.sin(angle);
        sommets.push(x, 0, z);  texCoords.push(0.5 + 0.5*Math.cos(angle), 0.5 + 0.5*Math.sin(angle));
        sommets.push(x, h, z);  texCoords.push(0.5 + 0.5*Math.cos(angle), 0.5 + 0.5*Math.sin(angle));
    }

    // Faces : base + côtés + dessus
    for (var i = 0; i < n; i++) {
        var bas1  = 2 + i * 2;
        var haut1 = 3 + i * 2;
        var bas2  = 2 + ((i + 1) % n) * 2;
        var haut2 = 3 + ((i + 1) % n) * 2;

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
        bufferIndices:   creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices)),
        nbIndices:       indices.length
    };
}

// ============================================================
//  TÉLÉ-RÉCEPTEUR  (anneau / tore simplifié = cylindre creux)
//  Visuellement différent du transporteur — énoncé section 3.8
//  Repose sur le plancher — max 1x1 — non plat
// ============================================================
function creerMeshRecepteur(gl) {
    var hExt  = 0.5;  // hauteur totale
    var rExt  = 0.42; // rayon extérieur
    var rInt  = 0.22; // rayon intérieur (creux au centre)
    var cx    = 0.5;
    var cz    = 0.5;
    var n     = 8;

    var sommets   = [];
    var texCoords = [];
    var indices   = [];
    var idx       = 0;

    for (var i = 0; i < n; i++) {
        var a1 = (i / n)       * 2 * Math.PI;
        var a2 = ((i+1) % n) / n * 2 * Math.PI;

        // 4 sommets du segment de l'anneau
        var xExt1 = cx + rExt * Math.cos(a1);
        var zExt1 = cz + rExt * Math.sin(a1);
        var xInt1 = cx + rInt * Math.cos(a1);
        var zInt1 = cz + rInt * Math.sin(a1);
        var xExt2 = cx + rExt * Math.cos(a2);
        var zExt2 = cz + rExt * Math.sin(a2);
        var xInt2 = cx + rInt * Math.cos(a2);
        var zInt2 = cz + rInt * Math.sin(a2);

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
        bufferIndices:   creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices)),
        nbIndices:       indices.length
    };
}

// ============================================================
//  TRÉSOR  (boîte légèrement trapézoïdale — coffre)
//  Repose sur le plancher — max 1x1 — non plat — énoncé 3.9
// ============================================================
function creerMeshTresor(gl) {
    var larg = 0.7;  // largeur (X)
    var haut = 0.5;  // hauteur totale
    var prof = 0.45; // profondeur (Z)
    // Centré dans la cellule
    var ox = (1 - larg) / 2;  // offset X
    var oz = (1 - prof) / 2;  // offset Z
    var hCorps = haut * 0.65; // hauteur du corps
    var hCouvercle = haut - hCorps;

    // Corps (boîte basse)
    var x0=ox, x1=ox+larg, z0=oz, z1=oz+prof;
    var y0=0,  y1=hCorps,  y2=haut;

    var d = 0.03; // débordement du couvercle

    // Construire les sommets en tableau JS d'abord
    var tabSommets = [
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
    var sommets = new Float32Array(tabSommets);

    // UV simples (0,0 partout — la couleur dorée suffit)
    var tabTex = [];
    for (var t = 0; t < tabSommets.length / 3; t++) { tabTex.push(0, 0); }
    var texCoords = new Float32Array(tabTex);

    // Générer indices pour 11 faces × 2 triangles = 22 triangles
    var indices = [];
    for (var f = 0; f < 11; f++) {
        var b = f * 4;
        indices.push(b, b+1, b+2,  b, b+2, b+3);
    }

    return {
        bufferSommets:   creerBuffer(gl, gl.ARRAY_BUFFER,         sommets),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER,         texCoords),
        bufferIndices:   creerBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices)),
        nbIndices:       indices.length
    };
}

// ============================================================
//  INDICATEUR JOUEUR (vue aérienne)
//  Petit triangle plat dessiné à Y=HAUTEUR_PLAFOND
//  visible seulement en vue aérienne — énoncé section 5
// ============================================================
function creerMeshIndicateurJoueur(gl) {
    var y  = HAUTEUR_PLAFOND - 0.05;  // juste sous le plafond, bien visible du dessus
    var r  = 0.3;

    // Triangle isocèle pointant vers +X (direction naturelle)
    // Personne 2 (ou Personne 3) fait tourner selon la vraie direction du joueur
    var sommets = new Float32Array([
        0.5 + r,    y, 0.5,         // pointe (avant)
        0.5 - r*0.6, y, 0.5 - r*0.6, // coin gauche
        0.5 - r*0.6, y, 0.5 + r*0.6  // coin droit
    ]);
    var texCoords = new Float32Array([0.5,1, 0,0, 1,0]);
    var indices   = new Uint16Array([0, 1, 2]);

    return {
        bufferSommets:   creerBuffer(gl, gl.ARRAY_BUFFER,         sommets),
        bufferTexCoords: creerBuffer(gl, gl.ARRAY_BUFFER,         texCoords),
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
    gl.drawElements(gl.TRIANGLES, mesh.nbIndices, gl.UNSIGNED_SHORT, 0);

    gl.enableVertexAttribArray(shaderProgram.couleurVertex);
}