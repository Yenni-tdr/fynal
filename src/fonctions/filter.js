import {
    FILTRE_PRIX_CROISSANT_STRING,
    FILTRE_PRIX_DECROISSANT_STRING,
    FILTRE_ALPHABETIQUE_CROISSANT_STRING,
    FILTRE_ALPHABETIQUE_DECROISSANT_STRING,
    FILTRE_STOCK,
    FILTRE_REDUCTION,
} from '../const/const';

const sorts = [
    FILTRE_PRIX_CROISSANT_STRING,
    FILTRE_PRIX_DECROISSANT_STRING,
    FILTRE_ALPHABETIQUE_CROISSANT_STRING,
    FILTRE_ALPHABETIQUE_DECROISSANT_STRING,
]

function sortSwitch(produitsTries, sortType) {
    switch (sortType) {
        case FILTRE_PRIX_CROISSANT_STRING:
            produitsTries.sort((a,b) => a.prix - b.prix);
            break;
        case FILTRE_PRIX_DECROISSANT_STRING:
            produitsTries.sort((a,b) => b.prix - a.prix);
            break;
        case FILTRE_ALPHABETIQUE_CROISSANT_STRING:
            produitsTries.sort((a,b) => {
                if(a.nom < b.nom) return -1;
                if( a.nom > b.nom) return 1;
                return 0;
            });
            break;
        case FILTRE_ALPHABETIQUE_DECROISSANT_STRING:
            produitsTries.sort((a,b) => {
                if(a.nom < b.nom) return 1;
                if( a.nom > b.nom) return -1;
                return 0;
            });
            break;
        default:
            console.log("switchSort error");
            break;
    }
}

function stockFilter(produitsTries) {
    return produitsTries.filter((produit) => {
        return produit.stock > 0;
    });
}

function reductionFilter(produitsTries) {
    return produitsTries.filter((produit) => {
        return produit.reduction > 0;
    });
}

function entrepriseFilter(produitsTries, vendeurArray, entrepriseArray) {
    const vendeursEntreprises = vendeurArray.filter((vendeur) => {
        return entrepriseArray.includes(vendeur.idEntreprise);
    }).map((vendeur) => {
        return vendeur.idVendeur;
    });
    console.log(vendeursEntreprises);
    return produitsTries.filter((produit) => {
        return vendeursEntreprises.includes(produit.idVendeur);
    });
}

export function updateProducts(produits, actualSort) {
    let produitsTries = produits;

    if(actualSort.stockCheckbox) produitsTries = stockFilter(produitsTries);
    if(actualSort.reductionCheckbox) produitsTries = reductionFilter(produitsTries);
    if(actualSort.entrepriseArray.length > 0) produitsTries = entrepriseFilter(produitsTries, actualSort.vendeurArray, actualSort.entrepriseArray);
    if(actualSort.sortType != false) sortSwitch(produitsTries, actualSort.sortType);

    return produitsTries;
}