export default function verifCategory(product) {

    const errors = {
        libelle: false,
        description: false,
    }

    if(product.libelle.length == 0) errors.libelle = true;
    if(product.description.length == 0) errors.description = true;

    return errors;

}