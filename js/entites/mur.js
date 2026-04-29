/*
    Fichier: mur.js
    Nom: Sarah Khodjaoui & Magalie Abada
    But: Gestion des murs
// */
// let objet3DMur = null; // objet global pour le mur, initialisé dans initMur()
// let tabMurs = []; // tableau global des murs, rempli dans construireScene() et utilisé pour collisions/ouverture

// // ============================================================
function initMur(objgl) {
    tabMurs = []; // réinitialiser au cas où on recharge le niveau
 
    for (let i = 0; i < TAILLE_DEDALE; i++) {
        for (let j = 0; j < TAILLE_DEDALE; j++) {
 
            let typeCellule = obtenirTypeCellule(i, j);
 
            if (typeCellule == TYPE_MUR_OUV || typeCellule == TYPE_MUR_SOLIDE) {
                let objMur = {
                    mesh:    creerMeshMur(objgl),
                    x:       j,
                    y:       0,
                    z:       i,
                    ligne:   i,
                    col:     j,
                    type:    typeCellule,
                    visible: true,  // false quand ouvert par Personne 2
                    progression: 0, // pour animation d'ouverture, de 0 (fermée) à 1 (ouverte)
                    enOuverture: false // true si en train de s'ouvrir, pour gérer l'animation
                    //enFermeture: false // true si en train de se fermer, pour gérer l'animation
                };
                tabMurs.push(objMur);
            }
        }
    }
 
    return tabMurs;
}
function ouvrirMurGraphiquement(mur3D){
      mur3D.enOuverture = true;
      mur3D.progression = 0;
        // Le mur sera rendu invisible à la fin de l'animation dans dessinerScene()
}

function fermerMurGraphiquement(ligne, col) {
    // Vérifier si le mur existe déjà (peut être déjà fermé)
    let murExistant = tabMurs.find(m => m.ligne === ligne && m.col === col);
    if (murExistant) {
        murExistant.visible = true; // rendre le mur visible
    } else {
        // Ajouter un nouveau mur au tableau
        let objMur = {
            mesh:    creerMeshMur(objgl),
            x:       col,
            y:       0,
            z:       ligne,
            ligne:   ligne,
            col:     col,
            type:    TYPE_MUR_SOLIDE, // ou TYPE_MUR_OUV selon le type de mur à fermer
            visible: true,
            progression: 0, // pour animation d'ouverture, de 0 (fermée) à 1 (ouverte)
            enOuverture: false 
        };
        tabMurs.push(objMur);
        objScene3D.objets.push(objMur);
    }
}

