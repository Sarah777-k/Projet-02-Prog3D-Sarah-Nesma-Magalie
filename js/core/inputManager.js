/*
    Fichier: inputManager.js
    Nom: Magalie Abada
    But: Gestion des événements du clavier
*/

/* ----- Variables ----- */

let touches = {
    avancer: false,
    reculer: false,
    tournerDroite: false,
    tournerGauche: false
};

let souris = {
    tournerDroite: false,
    tournerGauche: false
};


/* ----- Clavier ----- */
document.addEventListener("keydown", function (e) {
    if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowLeft" ||
        e.key === " "
    ) {
        e.preventDefault();
    }

    if (!bolVueAerienne) {
        if (e.key === "ArrowUp") {
            touches.avancer = true;
        } else if (e.key === "ArrowDown") {
            touches.reculer = true;
        } else if (e.key === "ArrowRight") {
            touches.tournerDroite = true;
        } else if (e.key === "ArrowLeft") {
            touches.tournerGauche = true;
        } else if (e.key === " ") {
            demanderOuvertureMur();
        }
    }

    
    //activer la vue aérienne
    if (e.key === "PageUp") {
        e.preventDefault();
        activerVueAerienne();
        return;
    }
    //désactiver la vue aérienne
    if (e.key === "PageDown") {
        e.preventDefault();
        desactiverVueAerienne();
        return;
    }
    //activer cheat
    if (e.ctrlKey && e.shiftKey && e.code === "Space") {
        e.preventDefault();
        basculerCheatVueAerienne();
        return;
    }
    
});

document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowUp") {
        touches.avancer = false;
    } else if (e.key === "ArrowDown") {
        touches.reculer = false;
    } else if (e.key === "ArrowRight") {
        touches.tournerDroite = false;
    } else if (e.key === "ArrowLeft") {
        touches.tournerGauche = false;
    }
});


/* ----- Souris ----- */
/*
    Roulette :
    - vers l'avant = avancer
    - vers l'arrière = reculer
*/
document.addEventListener("wheel", function (e) {
    e.preventDefault();
    
    if (bolVueAerienne) { 
        return;
    }

    if (e.deltaY < 0) {
        avancer();
    } else if (e.deltaY > 0) {
        reculer();
    }
}, { passive: false });

/*
    Boutons souris :
    - bouton gauche = tourner à gauche
    - bouton droit = tourner à droite
    - bouton milieu = ouvrir un mur
*/
document.addEventListener("mousedown", function (e) {
    e.preventDefault();

    if (bolVueAerienne) { 
        return;
    }

    if (e.button === 0) {
        souris.tournerGauche = true;
    } else if (e.button === 2) {
        souris.tournerDroite = true;
    } else if (e.button === 1) {
        demanderOuvertureMur();
    }
});

document.addEventListener("mouseup", function (e) {
    if (e.button === 0) {
        souris.tournerGauche = false;
    } else if (e.button === 2) {
        souris.tournerDroite = false;
    }
});

/*
    Empêche le menu clic droit du navigateur
*/
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});


/*
|-----------------------------------------------------------------------------|
| gererInputJoueur:
|   Applique les actions du joueur selon les touches maintenues
|-----------------------------------------------------------------------------|
*/
function gererInputJoueur() {

    if (estEnVueAerienne()) {
        // audioManager.arreterPas();
        return; ///// vérifier si on est en vue aérienne pour bloquer les deplacements
    }
    let xAvant = joueur.x;
    let zAvant = joueur.z;

    if (touches.avancer) {
        avancer();
    }

    if (touches.reculer) {
        reculer();
    }

    if (touches.tournerDroite || souris.tournerDroite) {
        tournerDroite();
    }

    if (touches.tournerGauche || souris.tournerGauche) {
        tournerGauche();
    }

    
    if (joueur.x !== xAvant || joueur.z !== zAvant) {
        audioManager.demarrerPas();  
    } else {
        audioManager.arreterPas();   
    }
}