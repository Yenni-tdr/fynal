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

// export async function dbCategoriesID() {
//     await getAllCategories()
//         .then(async (categorieData) => {
//             await prisma.$disconnect();
//             return categorieData;
//         })
//         .catch(async (e) => {
//             console.error(e);
//             await prisma.$disconnect();
//             process.exit(1);
//         });
// }

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

// export async function dbCategoriesData() {
//     await getCategorieData()
//         .then(async (categorieData) => {
//             await prisma.$disconnect();
//             return categorieData;
//         })
//         .catch(async (e) => {
//             console.error(e);
//             await prisma.$disconnect();
//             process.exit(1);
//         })
// }

// export async function testDB() {
//     const categorie = await prisma.categorie.findMany({
//         where: {
//             idCategorie: 1,
//         }
//     });

//     console.log(categorie[0].libelle);
// }