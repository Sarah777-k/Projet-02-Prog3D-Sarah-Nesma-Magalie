/*
    Fichier: UIManager.js
    Nom: Nesma Medjber
    But: Interface utilisateur (score, temps, etc.)
*/

/*
Pour tester ajouter dans game.js:
        ==> initialiserUI(objgl); dans demarrer?
        ==> mettreAJourHUD();  dans boucle?
*/

/* Variables s*/
let elementNiveau = "niveau";
let elementScore= "score";
let elementTemps="temps" ;
let elementOuvreurs="ouvreurs";

/*
|=====================================================================|
| afficherScore:
|   Met à jour l'affichage du score dans le HUD.
|=====================================================================|
*/
function afficherScore() {
    let score = obtenirScore();                    //
    setContenuElement(elementScore, formaterNombre(score,5));
}


/*
|=====================================================================|
| afficherNiveau:
|   Met à jour l'affichage du niveau dans le HUD.
|=====================================================================|
*/
function afficherNiveau() {
    setContenuElement(elementNiveau, formaterNombre(gameState.niveau, 2));
}


/*
|=====================================================================|
| afficherTemps:
|   Met à jour l'affichage des secondes restantes dans le HUD.
|=====================================================================|
*/
function afficherTemps() {
    let secondes = Math.max(0, Math.ceil(gameState.tempsRestant));
    setContenuElement(elementTemps,formaterNombre(secondes, 2));
}


/*
|=====================================================================|
| afficherOuvreurs:
|   Met à jour l'affichage du nombre d'ouvreurs restants dans le HUD.
|=====================================================================|
*/
function afficherOuvreurs() {
    setContenuElement(elementOuvreurs, gameState.ouvreurs);
}


/*
|=====================================================================|
| mettreAJourHUD:
|   Rafraîchit toutes les valeurs du HUD.
|   (À appeler à chaque frame depuis la game loop).
|=====================================================================|
*/
function mettreAJourHUD() {
    afficherNiveau();
    afficherScore();
    afficherTemps();
    afficherOuvreurs();
}

/*
|=====================================================================|
| formaterNombre:
|   Transforme un nombre en chaîne avec des zéros devant.
|=====================================================================|
*/
function formaterNombre(nombre, longueur) {
    return String(nombre).padStart(longueur, "0");
}