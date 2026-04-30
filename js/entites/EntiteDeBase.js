/*
    Fichier: EntiteDeBase.js
    Nom: Sarah Khodjaoui
    But: Classe parent pour toutes les entités du jeu.
*/
function initPlafond(objgl) {
    tabPlafond = [];
    for (let i = 0; i < TAILLE_DEDALE; i++) {
        for (let j = 0; j < TAILLE_DEDALE; j++) {
            let objPlafond = {
                mesh: creerMeshPlafond(objgl),
                x: j,
                y: 1.5, // hauteur du plafond
                z: i,
                type: "plafond"
            };
            tabPlafond.push(objPlafond);
        }   
    }
    return tabPlafond;
}

function initplancher(objgl) {
    let tabPlancher = [];
    for (let i = 0; i < TAILLE_DEDALE; i++) {
        for (let j = 0; j < TAILLE_DEDALE; j++) {
            let objPlancher = {
                mesh: creerMeshPlancher(objgl),
                x: j,
                y: 0,
                z: i,
                type: "plancher"
            };
            tabPlancher.push(objPlancher);
        }   
    }
    return tabPlancher;
}