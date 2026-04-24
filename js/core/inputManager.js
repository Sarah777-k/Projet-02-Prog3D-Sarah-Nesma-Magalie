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
    console.log("Joueur :", joueur);
});