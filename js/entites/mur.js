/*
    Fichier: mur.js
    Nom: Sarah Khodjaoui & Magalie Abada
    But: Gestion des murs
*/

// // ============================================================
function initMur(objgl) {
  tabMurs = []; // réinitialiser au cas où on recharge le niveau
  for (let i = 0; i < TAILLE_DEDALE; i++) {
    for (let j = 0; j < TAILLE_DEDALE; j++) {
      let typeCellule = obtenirTypeCellule(i, j);

      if (typeCellule == TYPE_MUR_OUV || typeCellule == TYPE_MUR_SOLIDE) {
        let objMur = {
          mesh: creerMeshMur(objgl),
          x: j,
          y: 0,
          z: i,
          ligne: i,
          col: j,
          type: typeCellule,
          visible: true, // false quand ouvert par Personne 2
          progression: 0, // pour animation d'ouverture, de 0 (fermée) à 1 (ouverte)
          enOuverture: false, // true si en train de s'ouvrir, pour gérer l'animation
        
        };
        tabMurs.push(objMur);
      }
      if(typeCellule == TYPE_PORTE_ENCLOS){
        let objPorte = {
          mesh : creerMeshMur(objgl),
          x : j,
          y : 0,
          z : i,
          ligne : i,
          col : j,
          type :typeCellule,
          visible : false,
          progression : 0,
          enOuverture : false
        };
        tabMurs.push(objPorte);
      }
       

    }
  }
  return tabMurs;
}
//les soubassements des mur effet realistique 
function initSoubassements(objgl){
    tabS=[];
    for (let i = 0; i < TAILLE_DEDALE; i++) {
    for (let j = 0; j < TAILLE_DEDALE; j++) {
      let typeCellule = obtenirTypeCellule(i, j);

      if (typeCellule == TYPE_MUR_OUV  ) {
        tabS.push({
          mesh: creerMeshSoubassement(objgl),
          x: j,
          y: 0,
          z: i,
          ligne: i,
          col: j,
          type: "soubassement",
          visible: true,
          progression : 0,
          enOuverture: false
        });
      }
    }
  }
  return tabS;
}
function ouvrirMurGraphiquement(mur3D) {
  mur3D.enOuverture = true;
  mur3D.progression = 0;
  // Le mur sera rendu invisible à la fin de l'animation dans dessinerScene()
  //ajouter la meme logique pour soubassement et porte enclos
  let soubassement = objScene3D.objets.find(obj =>
    obj.type === "soubassement" &&
    obj.ligne === mur3D.ligne &&
    obj.col === mur3D.col
  );
  if (soubassement) {
    soubassement.enOuverture = true;
    soubassement.progression = 0;
  }
   let porte = objScene3D.objets.find(obj =>
    obj.type === TYPE_PORTE_ENCLOS &&
    obj.ligne === mur3D.ligne &&
    obj.col === mur3D.col
  );
  if (porte) {
    porte.enOuverture = true;
    porte.progression = 0;
  }
  return true;
}

function fermerMurGraphiquement(ligne, col) {
  // Vérifier si le mur existe déjà (peut être déjà fermé)
  let murExistant = tabMurs.find((m) => m.ligne === ligne && m.col === col);
  if (murExistant) {
    murExistant.visible = true
    murExistant.enOuverture = false;  // quand on refait le meme niveau le mur revient
    murExistant.progression = 0;
      let soubassement = objScene3D.objets.find(obj =>
      obj.type === "soubassement" &&
      obj.ligne === murExistant.ligne &&
      obj.col === murExistant.col
    );
    if (soubassement) {
      soubassement.enOuverture = false;   //refaire le soubassement avec 
      soubassement.progression = 0;
      soubassement.visible = true;
    }
  } else {
    // Ajouter un nouveau mur au tableau
    let objMur = {
      mesh: creerMeshMur(objgl),
      x: col,
      y: 0,
      z: ligne,
      ligne: ligne,
      col: col,
      type: TYPE_PORTE_ENCLOS, 
      visible: true,
      progression: 0, // pour animation d'ouverture, de 0 (fermée) à 1 (ouverte)
      enOuverture: false,
    };
    tabMurs.push(objMur);
    objScene3D.objets.push(objMur);
  }
}
