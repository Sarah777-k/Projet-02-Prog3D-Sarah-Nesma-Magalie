/*
    Fichier: audioManager.js
    Nom: Nesma Medjber
    But: Sons et musique du jeu
*/ 



// Exemple d'appel:
// audioManager.jouerDebutNiveau();
// audioManager.jouerTresorTrouve();

class AudioManager {

    // ========================================================
    // Constructeur : charge tous les sons du jeu
    // ========================================================
    constructor() {

        // sons generiques
        this.sonDebutNiveau     = new Audio("../assets/audio/levelup.mp3");
        this.sonTresorTrouve    = new Audio("../assets/audio/levelup.mp3");
        this.sonTempsEcoule     = new Audio("../assets/audio/levelup.mp3");
        this.sonOuvertureMur    = new Audio("../assets/audio/wallOpening.mp3");
        this.sonTeleportation   = new Audio("../assets/audio/levelup.mp3");
        this.sonGameOver        = new Audio("../assets/audio/levelup.mp3");
        this.sonVictoire        = new Audio("../assets/audio/levelup.mp3");

        // musique
        this.musique = new Audio("../assets/audio/musicBackrooms.mp3");
        this.musique.loop = true;
        this.musique.volume = 0.3;

        // son ambiant
        this.sonAmbiant = new Audio("../assets/audio/sonAbiant.mp3");
        this.sonAmbiant.loop = true;
        this.sonAmbiant.volume = 0.3;

        // footsteps
        this.sonAvancer = new Audio("../assets/audio/footsteps.mp3");
        this.sonAvancer.loop = true;
        this.sonAvancer.volume = 0.3;
    }

    // ========================================================
    // Début d'un nouveau niveau
    // ========================================================
    jouerDebutNiveau() {
        this.sonDebutNiveau.currentTime = 0;
        this.sonDebutNiveau.play();
    }

    // ========================================================
    // Trésor trouvé
    // ========================================================
    jouerTresorTrouve() {
        this.sonTresorTrouve.currentTime = 0;
        this.sonTresorTrouve.play();
    }

    // ========================================================
    // Temps écoulé
    // ========================================================
    jouerTempsEcoule() {
        this.sonTempsEcoule.currentTime = 0;
        this.sonTempsEcoule.play();
    }

    // ========================================================
    // Ouverture d'un mur
    // ========================================================
    jouerOuvertureMur() {
        this.sonOuvertureMur.currentTime = 0;
        this.sonOuvertureMur.play();
    }

    // ========================================================
    // Téléportation
    // ========================================================
    jouerTeleportation() {
        this.sonTeleportation.currentTime = 0;
        this.sonTeleportation.play();
    }

    // ========================================================
    // Game Over (score < 200 et doit recommencer)
    // ========================================================
    jouerGameOver() {
        this.sonGameOver.currentTime = 0;
        this.sonGameOver.play();
    }

    // ========================================================
    // Fin du jeu 
    // ========================================================
    jouerVictoire() {
        this.sonFinJeu.currentTime = 0;
        this.sonFinJeu.play();
    }

    // ========================================================
    // Musique de l'écran d'accueil
    // ========================================================
    demarrerMusiqueAccueil() {
        this.musique.currentTime = 0;
        this.musique.play();
    }
    arreterMusiqueAccueil() {
        this.musique.pause();
        this.musique.currentTime = 0;
    }

    // ========================================================
    // Ambiance d'un niveau
    // ========================================================
    demarrerAmbiance() {
        if (!this.sonAmbiant.paused) return;
        this.sonAmbiant.currentTime = 0;
        this.sonAmbiant.play();
    }
    arreterAmbiance() {
        this.sonAmbiant.pause();
        this.sonAmbiant.currentTime = 0;
    }

    // ========================================================
    // Pas du joueur
    // ========================================================
    demarrerPas() {
        if (!this.sonAvancer.paused) return;
        this.sonAvancer.play();
    }
    arreterPas() {
        if (this.sonAvancer.paused) return;
        this.sonAvancer.pause();
        this.sonAvancer.currentTime = 0;
    }

}

// Instance globale utilisable partout dans le jeu
let audioManager = new AudioManager();
