import { prisma } from "../../db";
import arrayUnique from "./uniqueValuesFromArray";

export async function getAllCategoriesID() {
    const categories = await prisma.categorie.findMany({
        where: {},
        select: {
            idCategorie: true,
        }
    });

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

    const vendeurFiltre = arrayUnique( 
        produits.map((produit) => { 
            return produit.idVendeur 
        })
    );
    const vendeurs = await prisma.vendeur.findMany({
        select: {
            idVendeur: true,
            idEntreprise: true,
        },
        where: {
            idVendeur: { in: vendeurFiltre },
        }
    });

    const entrepriseFiltre = arrayUnique( 
        vendeurs.map((vendeur) => { 
            return vendeur.idEntreprise 
        })
    );
    const entreprises = await prisma.entreprise.findMany({
        where: {
            idEntreprise: { in: entrepriseFiltre },
        }
    });

    return {
        id,
        produits,
        vendeurs,
        entreprises,
        ...categorie,
    }
}