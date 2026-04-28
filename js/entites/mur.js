/*
    Fichier: mur.js
    Nom: Sarah Khodjaoui & Magalie Abada
    But: Gestion des murs
// */
// let objet3DMur = null; // objet global pour le mur, initialisé dans initMur()
// let tabMurs = []; // tableau global des murs, rempli dans construireScene() et utilisé pour collisions/ouverture

// // ============================================================
// function initMur(objgl) {
//     for (var i = 0; i < TAILLE_DEDALE; i++) {
//         for (var j = 0; j < TAILLE_DEDALE; j++) {
//             var typeCellule = obtenirTypeCellule(i, j);
//             if (typeCellule == TYPE_MUR_OUV || typeCellule == TYPE_MUR_SOLIDE) {
//                     var objMur = {
//                     mesh: creerMeshMur(objgl),
//                     x: j,
//                     y: 0,
//                     z: i,
//                     ligne: i,
//                     col: j,
//                     type: typeCellule,
//                     visible: true, // utilisé pour ouvrirMur() par Personne 2
//                 };
//                 tabMurs.push(objMur); // référence séparée pour collisions/ouverture
//             }
//         }
//     }
//    objet3DMur.tabMurs = tabMurs; // stocker la référence au tableau de murs dans l'objet 3D
//    return objet3DMur; // retourner l'objet 3D du mu
// }
function ouvrirMurGraphiquement(mur3D){
    mur3D.visible = false; // cacher le mur 3D
    let index = tabMurs.findIndex(m => m.ligne === mur3D.ligne && m.col === mur3D.col);
    if (index !== -1) {
        tabMurs[index].type = TYPE_SOL; // mettre à jour le type dans le tableau de murs
    }
}