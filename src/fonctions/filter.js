function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

export function arrayUnique(array) {
    return array.filter(onlyUnique);
}

export function stockFilter(setProduits, produits) {
    setProduits(() => [...produits.filter(produit => {
        return produit.reduction > 0;
    })])
}

export function reductionFilter(setProduits, produits) {
    setProduits(() => [...produits.filter(produit => {
        return produit.reduction > 0;
    })])
}