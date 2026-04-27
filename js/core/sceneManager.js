/*
    Fichier: sceneManager.js
    Nom: Sarah Khodjaoui
    But: Construction et rendu de la scène 3D
*/

// Liste globale des murs (utilisée pour ouverture de murs par Personne 2)
var tabMurs = [];

// ============================================================
//  construireScene()
//  Lit grilleDédale une seule fois et crée tous les objets 3D.
//  Retourne un tableau d'objets à dessiner.
// ============================================================
function construireScene(objgl) {
  var tabObjets = [];
  tabMurs = [];

  // Un seul grand plancher 31x31 (plus efficace que cellule par cellule)
  tabObjets.push({
    mesh: creerMeshPlancher(objgl),
    x: 0,
    y: 0,
    z: 0,
    type: "plancher",
  });


  //   tabObjets.push({
  //     mesh: creerMeshPlafond(objgl),
  //     x: 0,
  //     y: 0,
  //     z: 0,
  //     type: "plafond",
  //   });

  // Lire la grille : créer un mur 3D pour chaque cellule mur
  for (var i = 0; i < TAILLE_DEDALE; i++) {
    for (var j = 0; j < TAILLE_DEDALE; j++) {
      var typeCellule = obtenirTypeCellule(i, j);

      if (typeCellule == TYPE_MUR_OUV || typeCellule == TYPE_MUR_SOLIDE) {
        var objMur = {
          mesh: creerMeshMur(objgl),
          x: j,
          y: 0,
          z: i,
          ligne: i,
          col: j,
          type: typeCellule,
          visible: true, // utilisé pour ouvrirMur() par Personne 2
        };

        tabObjets.push(objMur);
        tabMurs.push(objMur); // référence séparée pour collisions/ouverture
      }
    }
  }

  return tabObjets;
}

// ============================================================
//  dessinerScene()
//  Appelée à chaque frame par requestAnimationFrame dans main.js
// ============================================================
function dessinerScene(gl, shaderProgram, scene) {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0.05, 0.05, 0.1, 1); // fond bleu très sombre (effet nuit)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  // --- Matrice de projection (perspective) ---
  var matProjection = mat4.create();
  mat4.perspective(
    60, // angle de vue (degrés)
    gl.drawingBufferWidth / gl.drawingBufferHeight, // ratio largeur/hauteur
    0.1, // near
    100, // far
    matProjection,
  );
  gl.uniformMatrix4fv(shaderProgram.matProjection, false, matProjection);

  // --- Matrice de vue (caméra = joueur) ---
  var matVue = mat4.create();
  mat4.lookAt(
    getPositionsCameraXYZ(scene.camera),
    getCiblesCameraXYZ(scene.camera),
    getOrientationsXYZ(scene.camera),
    matVue,
  );

  // --- Dessiner chaque objet ---
  for (var i = 0; i < scene.objets.length; i++) {
    var obj = scene.objets[i];

    // Ne pas dessiner les murs ouverts
    if (obj.visible === false) continue;

    // Choisir le bon matériau selon le type
    var mat;
    switch (obj.type) {
      case TYPE_MUR_OUV:
        mat = creerMatMurOuvrable();
        break;
      case TYPE_MUR_SOLIDE:
        mat = creerMatMurSolide();
        break;
      case TYPE_ENCLOS:
        mat = creerMatEnclos();
        break;
      case "plafond":
        mat = creerMatPlafond();
        break;
      default:
        mat = creerMatPlancher();
        break;
    }
    appliquerMateriau(gl, shaderProgram, mat);

    // Matrice modèle : placer l'objet à sa position dans la scène
    var matModele = mat4.create();
    mat4.identity(matModele);
    mat4.translate(matModele, [obj.x, obj.y, obj.z]);

    var matModeleVue = mat4.create();
    mat4.multiply(matVue, matModele, matModeleVue);


    dessinerMesh(gl, shaderProgram, obj.mesh, matModeleVue);
  }
}
