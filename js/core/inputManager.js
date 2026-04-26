/*
    Fichier: inputManager.js
    Nom: Magalie Abada
    But: Gestion des événements du clavier
*/


document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowUp") {
        avancer();
    } else if (e.key === "ArrowDown") {
        reculer();
    } else if (e.key === "ArrowRight") {
        tournerDroite();
    } else if (e.key === "ArrowLeft") {
        tournerGauche();
    }
    //pour changer la caméra
    mettreAJourCamera();
    // Redessiner la scène après chaque mouvement (a revoir))
    dessinerScene(objgl, objProgShaders, objScene3D);
    console.log("Joueur :", joueur);
});