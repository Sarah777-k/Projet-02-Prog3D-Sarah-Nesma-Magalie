/*
    Fichier: cell.js
    Nom: Magalie Abada
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
    | estPorteEnclos:
    |   Retourne vrai si la cellule est la porte de l'enclos
    |-----------------------------------------------------------------------------|
    */
    estPorteEnclos() {
        return this.type === TYPE_PORTE_ENCLOS;
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
        if (this.estMurOuvrable() && !this.estOuverte) {
            this.estOuverte = true;
            return true;
        }
        return false;
    }


    /*
    |-----------------------------------------------------------------------------|
    | fermer:
    |   Ferme le mur seulemet si c'est un mur ouvrable
    |-----------------------------------------------------------------------------|
    */
    fermer() {
        if (this.estMurOuvrable() && this.estOuverte) {
            this.estOuverte = false;
            return true;
        }
        return false;
    }

    /*
    |-----------------------------------------------------------------------------|
    | ouvrirPorte:
    |   Ferme la porte de l'enclos lors du chargement du niveau
    |-----------------------------------------------------------------------------|
    */
    ouvrirPorte() {
        this.type = TYPE_PORTE_ENCLOS;
        this.estOuverte = true;
    }
    
    /*
    |-----------------------------------------------------------------------------|
    | fermerPorte:
    |   Ferme la porte de l'enclos après que le joueur en soit sorti
    |-----------------------------------------------------------------------------|
    */
    fermerPorte() {
        this.type = TYPE_MUR_SOLIDE;
        this.estOuverte = false;
    }

}