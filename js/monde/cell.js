/*
    Fichier: cell.js
    Nom: Sarah Khodjaoui
    But: Gestion des cellules
*/

class Cell {
    constructor(type, ligne, colonne) {
        this.type = type;
        this.ligne = ligne;
        this.colonne = colonne;
        this.estOuverte = false;
    }

    /*
    |-----------------------------------------------------------------------------|
    | estCouloir:
    |   Vérifie s'il s'agit d'un couloir
    |-----------------------------------------------------------------------------|
    */
    estCouloir() {
        return this.type === TYPE_COULOIR;
    }

    /*
    |-----------------------------------------------------------------------------|
    | estMurOuvrable:
    |   Vérifie s'il s'agit d'un mur ouvrable
    |-----------------------------------------------------------------------------|
    */
    estMurOuvrable() {
        return this.type === TYPE_MUR_OUV;
    }

    /*
    |-----------------------------------------------------------------------------|
    | estMurSolide:
    |   Vérifie s'il s'agit d'un mur solide
    |-----------------------------------------------------------------------------|
    */
    estMurSolide() {
        return this.type === TYPE_MUR_SOLIDE;
    }

    /*
    |-----------------------------------------------------------------------------|
    | estEnclos:
    |   Vérifie s'il s'agit de l'enclos
    |-----------------------------------------------------------------------------|
    */
    estEnclos() {
        return this.type === TYPE_ENCLOS;
    }

    /*
    |-----------------------------------------------------------------------------|
    | estBloquante:
    |   Retourne vrai si la cellule est bloquante
    |-----------------------------------------------------------------------------|
    */
    estBloquante() {
        if (this.estMurSolide()) {
            return true;
        }

        if (this.estMurOuvrable() && !this.estOuverte) {
            return true;
        }

        return false;
    }

    /*
    |-----------------------------------------------------------------------------|
    | ouvrir:
    |   Ouvre le mur seulemet si c'est un mur ouvrable
    |-----------------------------------------------------------------------------|
    */
    ouvrir() {
        if (this.estMurOuvrable()) {
            this.estOuverte = true;
            return true;
        }
        return false;
    }
    
    /*
    |-----------------------------------------------------------------------------|
    | fermerPorte:
    |   Ouvre le mur seulemet si c'est un mur ouvrable
    |-----------------------------------------------------------------------------|
    */
    fermerPorte() {
        if (this.estMurOuvrable()) {
            this.estOuverte = false;
            return true;
        }       
        return false;
    }

}