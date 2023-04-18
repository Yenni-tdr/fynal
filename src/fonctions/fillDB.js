// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
import prisma from '../../db';

import { createRandomProduct } from './testFaker';

async function main() {
    // const allUsers = await prisma.produit.findMany({
    //     where: {
    //         prix: {
    //             lt: 100,
    //         }
    //     }
    // });
    // console.log(allUsers);

    for(let i = 0; i<100; i++) {
        const product = createRandomProduct();

        await prisma.produit.create({
            data: {
                nom: product.nom,
                description: product.description,
                stock: product.stock,
                delaisLivraison: product.delaisLivraison,
                prix: product.prix,
                reduction: product.reduction,
                hauteur: product.hauteur,
                longueur: product.longueur,
                largeur: product.largeur,
                poids: product.poids,
                idCategorie: product.idCategorie,
                idVendeur: product.idVendeur,
            }
        })
    }
}

export function fillDatabase() {
    main()
        .then(async () => {
            await prisma.$disconnect();
        })
        .catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
            process.exit(1);
        })
}