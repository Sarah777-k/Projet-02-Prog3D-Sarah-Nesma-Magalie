/*
    Fichier: audioManager.js
    Nom: Nesma Medjber
    But: Sons et musique du jeu
*/ 

// Instance globale utilisable partout dans le jeu
const audioManager = new AudioManager();

// Exemple d'appel:
// audioManager.jouerDebutNiveau();
// audioManager.jouerTresorTrouve();

class AudioManager {

    // ========================================================
    // Constructeur : charge tous les sons du jeu
    // ========================================================
    constructor() {
        this.sonDebutNiveau   = new Audio("");
        this.sonTresorTrouve  = new Audio("");
        this.sonTempsEcoule   = new Audio("");
        this.sonOuvertureMur  = new Audio("");
        this.sonTeleportation = new Audio("");
        this.sonGameOver      = new Audio("");
        this.sonFinJeu        = new Audio("");
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
    jouerFinJeu() {
        this.sonFinJeu.currentTime = 0;
        this.sonFinJeu.play();
    }
}

