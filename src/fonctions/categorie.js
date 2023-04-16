import { prisma } from "../../db";

export async function getAllCategoriesID() {
    const categories = await prisma.categorie.findMany({
        where: {},
        select: {
            idCategorie: true,
        }
    });

    // categories.map((categorie) => {
    //     console.log(categorie.idCategorie.toString());
    // });

    const paths = categories.map((categorie) => ({
        params: { id: categorie.idCategorie.toString() },
    }));

    return paths;
}

export async function getCategorieProductsData(id) {
    const categorie = await prisma.categorie.findMany({
        where: {
            idCategorie: parseInt(id),
        }
    });

    const produits = await prisma.produit.findMany({
        where: {
            idCategorie: parseInt(id),
        }
    });

    return {
        id,
        produits,
        ...categorie,
    }
}