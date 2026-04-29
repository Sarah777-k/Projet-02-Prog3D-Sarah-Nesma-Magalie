/*
    Fichier: UIManager.js
    Nom: Nesma Medjber
    But: Interface utilisateur (score, temps, etc.)
*/

/* Variables s*/
let elementNiveau;
let elementScore;
let elementTemps;
let elementOuvreurs;


/*
|=====================================================================|
| initialiserUI:
|   Récupère les références aux éléments HTML du HUD.
|   À appeler UNE SEULE FOIS au démarrage du jeu.
|=====================================================================|
*/
function initialiserUI() {
    elementNiveau   = document.getElementById("hud-niveau");
    elementScore    = document.getElementById("hud-score");
    elementTemps    = document.getElementById("hud-temps");
    elementOuvreurs = document.getElementById("hud-ouvreurs");
}


/*
|=====================================================================|
| afficherScore:
|   Met à jour l'affichage du score dans le HUD.
|=====================================================================|
*/
function afficherScore() {
    let score = obtenirScore();                    //
    elementScore.textContent = formaterNombre(score, 5);  
}


/*
|=====================================================================|
| afficherNiveau:
|   Met à jour l'affichage du niveau dans le HUD.
|=====================================================================|
*/
function afficherNiveau() {

}


/*
|=====================================================================|
| afficherTemps:
|   Met à jour l'affichage des secondes restantes dans le HUD.
|=====================================================================|
*/
function afficherTemps() {

}


/*
|=====================================================================|
| afficherOuvreurs:
|   Met à jour l'affichage du nombre d'ouvreurs restants dans le HUD.
|=====================================================================|
*/
function afficherOuvreurs() {

}


/*
|=====================================================================|
| mettreAJourHUD:
|   Rafraîchit toutes les valeurs du HUD.
|   (À appeler à chaque frame depuis la game loop).
|=====================================================================|
*/
function mettreAJourHUD() {
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