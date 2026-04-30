/*
    Fichier: UtilsGeneral.js
    Nom:  Nesma Medjber
    But: Librairie de fonctions utilitaires générales
*/

// Fonction pour récupérer le contenu d'un élément HTML dont l'id est strID.
// Si l'élément est un champs de formulaire, le contenu est la valeur (.value) de ce champs.
// Pour les autres types d'éléments, il s'agit du contenu entre les balises (.innerHTML).
function getContenuElement(strID) {
    let objBalise = document.getElementById(strID);

    if (!objBalise) {
        console.error(`Attention! L'élément avec ID "${strID}" est introuvable.`);
        return null;
    }

   return ('value' in objBalise) ? objBalise.value : objBalise.innerHTML;
}

// Fonction pour affecter le contenu d'un élément HTML dont l'id est strID.
// Si l'élément est un champs de formulaire, la valeur (.value) de ce champs est modifiée.
// Pour les autres types d'éléments, le contenu entre les balises (.innerHTML) est modifié.
function setContenuElement(strID, strValeur) {
    let objBalise = document.getElementById(strID);

    if (!objBalise) {
        console.error(`Attention! L'élément avec ID "${strID}" est introuvable.`);
        return;
    }

    if ('value' in objBalise) {
        objBalise.value = strValeur;
    } else {
        objBalise.innerHTML = strValeur;
    }
}