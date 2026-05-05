/*
    Fichier: MaterialFactory.js
    Nom: Sarah Khodjaoui
    But: Centralise la création des matériaux utilisés pour les objets 3D.

    * Responsabilités:
    * - Créer des matériaux (couleur, texture, propriétés visuelles)
    * - Uniformiser l’apparence des objets du jeu
    * - Éviter la duplication de code lors de la création des matériaux
    *
    * Utilisé par:
    * - MeshFactory.js
    * - Les entités (mur, flèche, trésor, etc.)
*/

// ----- Variables globales des textures ----------------------
let textureMurOuvrable    = null;
let textureMurSolide      = null;
let texturePlancher       = null;
let texturePlafond        = null;
let textureEnclos         = null;
let textureFleche         = null;
let textureTeleporteur    = null;
let textureRecepteur      = null;
let textureTresor         = null;


// ============================================================
//  Création des matériaux
//  Chaque fonction retourne { couleur: [R,G,B,A], texture: obj|null }
//      couleur si la texture ne marche pas
// ============================================================

//position 2D
function creeMatPosition2D(){
    return{
        couleur: [0,0,0,1], //noir
        texture: texturePos2D
    }
}
// Mur ouvrable (rouge selon l'énoncé)
function creerMatMurOuvrable() {
    return {
        couleur:  [0.8, 0.1, 0.1, 1.0],   // rouge
        texture:  textureMurOuvrable        // null au début, sera chargée
    };
}

// Mur non ouvrable (vert foncé selon l'énoncé)
function creerMatMurSolide() {
    return {
        couleur:  [0.1, 0.5, 0.1, 1.0],   // vert foncé
        texture:  textureMurSolide
    };
}
function creerMatSoubassement(){
    return {
        couleur:  [0.1, 0.5, 0.1, 1.0],   // vert foncé
        texture:  textureSoubassement
    };
}

// Plancher des couloirs (couleur sombre, neutre)
function creerMatPlancher() {
    return {
        couleur:  [0.3, 0.25, 0.2, 1.0],  // brun sombre
        texture:  texturePlancher
    };
}

// Plancher de l'enclos (différent du plancher normal — requis par l'énoncé)
function creerMatEnclos() {
    return {
        couleur:  [0.6, 0.82, 0.32, 1.0], // vert clair / jaune-vert
        texture:  textureEnclos
    };
}

// Plafond
function creerMatPlafond() {
    return {
        couleur:  [0.15, 0.15, 0.25, 1.0], 
        texture:  texturePlafond
    };
}

// Flèche (orange vif pour bien la voir)
function creerMatFleche() {
    return {
        couleur:  [1.0, 0.5, 0.0, 1.0],   // orange
        texture:  textureFleche
    };
}

// Télé-transporteur (bleu électrique)
function creerMatTeleporteur() {
    return {
        couleur:  [0.1, 0.4, 1.0, 1.0],   // bleu vif
        texture:  textureTeleporteur
    };
}

//recepteur
function creerMatRecepteur() {
    return {
        couleur:  [0.6, 0.1, 0.8, 1.0],   
        texture:  textureRecepteur
    };
}

// Trésor (doré)
function creerMatTresor() {
    return {
        couleur:  [1.0, 1.0, 1.0, 1.0],  
        texture:  textureTresor
    };
}


// ============================================================
//  Appliquer un matériau au shader
//  À appeler juste avant de dessiner chaque objet.
// ============================================================
function appliquerMateriau(gl, shaderProgram, materiau) {

    gl.disableVertexAttribArray(shaderProgram.couleurVertex);
    gl.vertexAttrib4f(
        shaderProgram.couleurVertex,
        materiau.couleur[0],
        materiau.couleur[1],
        materiau.couleur[2],
        materiau.couleur[3]

    );

    if (materiau.texture != null) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, materiau.texture);
        gl.uniform1i(shaderProgram.noTexture, 0);

        // 1.0 = utiliser la texture
        gl.uniform1f(shaderProgram.pcCouleurTexel, 1.0);
    } else {
        // 0.0 = utiliser seulement la couleur
        gl.uniform1f(shaderProgram.pcCouleurTexel, 0.0);
    }
}

// ============================================================
//  Chargement des textures
//  Appeler cette fonction une seule fois au démarrage du jeu,
//  après avoir initialisé WebGL.
//
//  Les fichiers image doivent être dans assets/textures/
// ============================================================
function initTextures(gl) {
    textureMurOuvrable  = chargerTexture(gl, "../assets/backrooms/backWall.png");
    textureMurSolide    = chargerTexture(gl, "../assets/backrooms/mur_solide.png");
    textureSoubassement = chargerTexture(gl, "../assets/backrooms/soubassements.png");
    texturePlancher     = chargerTexture(gl, "../assets/backrooms/backrooms-carpet-diffuse.png");
    texturePlafond      = chargerTexture(gl, "../assets/backrooms/backrooms-ceiling-tile-diffuse.png");
    textureEnclos       = chargerTexture(gl, "../assets/backrooms/soubassements.png");
    textureFleche       = chargerTexture(gl, "../assets/backrooms/rouge.jpg");
    textureTeleporteur  = chargerTexture(gl, "../assets/backrooms/hatch.png");
    textureRecepteur    = chargerTexture(gl, "../assets/backrooms/recepteur.png");
    textureTresor       = chargerTexture(gl, "../assets/backrooms/coffret.png");
    texturePos2D        = chargerTexture(gl,"../assets/textures/position.png");
}

// Charge une image et crée une texture WebGL
// Retourne l'objet texture (utilisable immédiatement grâce au pixel temporaire)
function chargerTexture(gl, cheminImage) {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Pixel temporaire magenta (visible si l'image est lente à charger)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA,
                  gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));

    // Charger la vraie image en arrière-plan
    let image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // Paramètres de répétition (utile pour plancher/plafond)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        //pour les textures avec des dimensions non puissances de 2, on doit utiliser CLAMP_TO_EDGE et pas REPEAT
            if ((image.width & (image.width - 1)) === 0 && (image.height & (image.height - 1)) === 0) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            }   
    };
    image.src = cheminImage;

    return texture;
}