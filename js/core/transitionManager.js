/*
    Fichier: transitionManager.js
    Nom: Nesma Medjber
    But: Affichage des écrans de transition (start, niveau, game over)

*/


/* ----- Constantes ----- */
const ID_ECRAN_TRANSITION = "ecranTransition";
const ID_TITRE_TRANSITION = "titreTransition";
const ID_SOUSTITRE_TRANSITION = "sousTitreTransition";
const ID_BOUTON_TRANSITION = "boutonTransition";

const DUREE_ECRAN_NIVEAU_MS = 2000;


/* ----- Fonctions ----- */

/*
|=====================================================================|
| afficherEcran:
|   Affiche un écran de transition avec un titre, un sous-titre,
|   et optionnellement un bouton.
|=====================================================================|
*/
function afficherEcran(titre, sousTitre, texteBouton, callbackBouton) {
    let ecran  = document.getElementById(ID_ECRAN_TRANSITION);
    let elTit  = document.getElementById(ID_TITRE_TRANSITION);
    let elSous = document.getElementById(ID_SOUSTITRE_TRANSITION);
    let bouton = document.getElementById(ID_BOUTON_TRANSITION);

    elTit.textContent  = titre;
    elSous.textContent = sousTitre || "";

    if (texteBouton !== null) {
        bouton.textContent   = texteBouton;
        bouton.style.display = "inline-block";

        bouton.onclick = function() {
            masquerEcran();

            if (callbackBouton !== null) {
                callbackBouton();
            }
        };
    } else {
        bouton.style.display = "none";
        bouton.onclick = null;
    }

    ecran.classList.add("visible");
}

/*
|=====================================================================|
| masquerEcran:
|   Cache l'écran de transition.
|=====================================================================|
*/
function masquerEcran() {
    let ecran = document.getElementById(ID_ECRAN_TRANSITION);
    ecran.classList.remove("visible");
}


/* ----- Fonctions publiques ----- */

/*
|=====================================================================|
| afficherEcranStart:
|   Écran d'accueil. Le clic sur START lance le jeu.
|=====================================================================|
*/
function afficherEcranStart() {
    audioManager.demarrerMusiqueAccueil()
    afficherEcran(
        "LABYRINTHE BACKROOMS",
        "Trouvez le trésor dans les backrooms avant la fin du temps imparti",
        "COMMENCER",
        demarrer
    );
}

/*
|=====================================================================|
| afficherEcranNiveau:
|   Affiche "NIVEAU XX" pendant 2 secondes.
|   Pendant ce temps, le jeu est en ETAT_ATTENTE (gameplay figé).
|=====================================================================|
*/
function afficherEcranNiveau(niveau) {
    gameState.etat = ETAT_ATTENTE;

    afficherEcran(
        "NIVEAU " + String(niveau).padStart(2, "0"),
        "",
        null,
        null
    );

    setTimeout(function() {
        masquerEcran();
        gameState.etat = ETAT_EN_COURS;
    }, DUREE_ECRAN_NIVEAU_MS);
}

/*
|=====================================================================|
| afficherEcranGameOver:
|   Écran Game Over. Le clic sur RECOMMENCER relance la partie.
|=====================================================================|
*/
function afficherEcranGameOver() {
    afficherEcran(
        "GAME OVER",
        "Vous vous êtes perdu dans le labyrinthe...",
        "RECOMMENCER",
        recommencerDepuisNiveau1
    );
}

/*
|=====================================================================|
| afficherEcranVictoire:
|   Écran Victoire. Le clic sur RECOMMENCER relance la partie.
|=====================================================================|
*/
function afficherEcranVictoire() {
    afficherEcran(
        "VICTOIRE",
        "Vous avez vaincu le labyrinthe !",
        "RECOMMENCER",
        recommencerDepuisNiveau1
    );
}

/*
|=====================================================================|
| recommencerDepuisNiveau1:
|   Réinitialise le jeu complet (score + niveau 1).
|=====================================================================|
*/
function recommencerDepuisNiveau1() {
    gameState.niveau = 1;
    initialiserScore();
    initNiveau(1, true);
    validerScoreNiveau();
}