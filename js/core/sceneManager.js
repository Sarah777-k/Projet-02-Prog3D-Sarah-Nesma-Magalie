/*
    Fichier: sceneManager.js
    Nom: Sarah Khodjaoui
    But: Construction et rendu de la scène 3D
*/

// Liste globale des murs (utilisée pour ouverture de murs par Personne 2)
let tabMurs = [];
let tabPlancher = [];
let tabS = []
// ============================================================
//  construireScene()
//  Lit grilleDédale une seule fois et crée tous les objets 3D.
//  Retourne un tableau d'objets à dessiner.
// ============================================================
function construireScene(objgl) {
  let tabObjets = [];
  // Un seul grand plancher 31x31 (plus efficace que cellule par cellule)
  tabObjets.push({
    mesh: creerMeshPlancher(objgl),
    x: 0,
    y: 0,
    z: 0,
    type: "plancher",
  });
  //pour type enclos
  tabObjets.push({
    mesh: creerMeshEnclos(objgl),
    x: 14,
    y: 0.01,
    z: 14,
    type: "enclos",
  });
  //  tabObjets.push({
  //      mesh: creerMeshPlafond(objgl),
  //      x: 0,
  //      y: 1.5,
  //      z: 0,
  //      type: "plafond",
  //    });
  //init les objets de niveau por type
  for (let i = 0; i < tabObjetsNiveau.length; i++) {
    let objNiveau = tabObjetsNiveau[i];
    if(objNiveau.type ==="FLECHE"){
           tabObjets.push({
              mesh : creerMeshFleche(objgl),
              x : objNiveau.colonne,
              y : 1.5,
              z : objNiveau.ligne,
              angle: objNiveau.angle,
              type : "FLECHE",
              visible : true
          });
    }
    if(objNiveau.type==="TRESOR"){
      tabObjets.push({
              mesh : creerMeshTresor(objgl),
              x : objNiveau.colonne,
              y : 0.05,
              z : objNiveau.ligne,
              type : "TRESOR",
              visible : true
          });
    }
  }


  //tabPlancher = initplancher(objgl);
  tabObjects = tabObjets.concat(tabPlancher); // ajouter le plafond à la scène
  tabMurs = initMur(objgl);
  tabS = initSoubassements(objgl);
  tabObjets = tabObjets.concat(tabMurs); // ajouter les murs à la scène
  tabObjets = tabObjets.concat(tabS); // ajouter les soubassement à la scène
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
  let matProjection = mat4.create();
  mat4.perspective(
    60, // angle de vue (degrés)
    gl.drawingBufferWidth / gl.drawingBufferHeight, // ratio largeur/hauteur
    0.1, // near
    100, // far
    matProjection,
  );
  gl.uniformMatrix4fv(shaderProgram.matProjection, false, matProjection);

  // --- Matrice de vue (caméra = joueur) ---
  let matVue = mat4.create();
  mat4.lookAt(
    getPositionsCameraXYZ(scene.camera),
    getCiblesCameraXYZ(scene.camera),
    getOrientationsXYZ(scene.camera),
    matVue,
  );

  gl.uniform3fv(shaderProgram.lightPosition, [15.5, 2.4, 15.5]);

  // --- Dessiner chaque objet ---
  for (let i = 0; i < scene.objets.length; i++) {
    let obj = scene.objets[i];

    // Ne pas dessiner les murs ouverts
    if (obj.visible === false) continue;

    // Choisir le bon matériau selon le type
    let mat;
    switch (obj.type) {
      case TYPE_MUR_OUV:
        mat = creerMatMurOuvrable();
        break;
      case "enclos":
        mat = creerMatEnclos();
        break;
      case TYPE_MUR_SOLIDE:
        mat = creerMatMurSolide();
        break;
      case "soubassement":
        mat = creerMatSoubassement();
        break;
      case "plafond":
        mat = creerMatPlafond();
        break;
      case "FLECHE":
         mat= creerMatFleche();
         break;
      case "TRESOR":
        mat= creerMatTresor();
        break;
      default:
        mat = creerMatPlancher();
        break;
    }
    appliquerMateriau(gl, shaderProgram, mat);

   //gestion de l'animation ouverture mur
   //----///////////////////////////////ajouter au debut de jeu le mur enclos est ferme ensuite s'ouvre pour que le joueur sorte et enfin de ferme a nouveau   ////////////////
    if (obj.enOuverture === true) {
      obj.progression += 0.01;

      if (obj.progression >= 1) {
        obj.progression = 1;
        obj.enOuverture = false;
        obj.visible = false;
      }
    }

    let yAnimation = obj.y;

    if ((obj.type === TYPE_MUR_OUV ) && obj.progression > 0) {
      yAnimation = obj.y - obj.progression * HAUTEUR_MUR;
    }
    //le soubassement doit aussi disparaitre comme le mur
    if(obj.type === "soubassement" && obj.progression > 0){
       yAnimation = obj.y - obj.progression * HAUTEUR_MUR;
    }
   
    
    // Matrice modèle : placer l'objet à sa position dans la scène
    let matModele = mat4.create();
    mat4.identity(matModele);
   // mat4.translate(matModele, [obj.x, yAnimation, obj.z]);

    // rotate la fleche d
    if (obj.type === "FLECHE") {

        // Aller au centre de la cellule
        mat4.translate(matModele, [obj.x + 0.5, obj.y, obj.z + 0.5]);

        // Tourner autour de Y
        mat4.rotateY(matModele, -obj.angle);

        // Revenir au coin local du mesh
        mat4.translate(matModele, [-0.5, 0, -0.5]);
    } else {
        // Tous les autres objets
        mat4.translate(matModele, [obj.x, yAnimation, obj.z]);
    }

    let matModeleVue = mat4.create();
    mat4.multiply(matVue, matModele, matModeleVue);

    dessinerMesh(gl, shaderProgram, obj.mesh, matModeleVue);
  }
}
