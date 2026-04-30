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
    elementNiveau   = document.getElementById("niveau");
    elementScore    = document.getElementById("score");
    elementTemps    = document.getElementById("temps");
    elementOuvreurs = document.getElementById("ouvreurs");
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
    elementNiveau.textContent = formaterNombre(gameState.niveau, 2);
}


/*
|=====================================================================|
| afficherTemps:
|   Met à jour l'affichage des secondes restantes dans le HUD.
|=====================================================================|
*/
function afficherTemps() {
    let secondes = Math.max(0, Math.ceil(gameState.tempsRestant));
    elementTemps.textContent = formaterNombre(secondes, 2);
}


/*
|=====================================================================|
| afficherOuvreurs:
|   Met à jour l'affichage du nombre d'ouvreurs restants dans le HUD.
|=====================================================================|
*/
function afficherOuvreurs() {
    elementOuvreurs.textContent = gameState.ouvreurs;
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