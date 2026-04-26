/*
    Fichier: main.js
    But: Point d'entrée du jeu — orchestre tout
*/
let objScene3D = {};
let objgl;
let objProgShaders;
window.addEventListener("load", demarrer);

function demarrer() {
  let objCanvas = document.getElementById("monCanvas");
  objgl = initWebGL(objCanvas);
  objProgShaders = initShaders(objgl);
  initTextures(objgl); // charge les textures depuis assets/

  initDédale();


  objScene3D.objets = construireScene(objgl);

  // Caméra : joueur au centre de l'enclos (ligne 15, col 15)
  // Y = 1.0 = hauteur des yeux, regarde vers le nord (Z diminue)
  objScene3D.camera = creerCamera();
  setPositionsCameraXYZ([5.5, 2.0, 5], objScene3D.camera);
  setCiblesCameraXYZ([joueur.x , joueur.y+1, joueur.z], objScene3D.camera);
  setOrientationsXYZ([0, 1, 0], objScene3D.camera);
 

  // Boucle de rendu (appelée ~60x par seconde)
  function boucle() {
    dessinerScene(objgl, objProgShaders, objScene3D);
    requestAnimationFrame(boucle);
  }
  boucle();
}

function mettreAJourCamera() {
   let dir = obtenirDirectionVecteur();
    let hauteurYeux = 1.2;

    setPositionsCameraXYZ(
        [joueur.x, joueur.y + hauteurYeux, joueur.z],
        objScene3D.camera
    );

    setCiblesCameraXYZ(
        [
            joueur.x + dir.x,
            joueur.y + hauteurYeux,
            joueur.z + dir.z
        ],
        objScene3D.camera
    );
}
