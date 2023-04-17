import { prisma } from '../../db';

import { createRandomProduct } from './testFaker';

export async function fillDatabaseProducts() {
    // const allUsers = await prisma.produit.findMany({
    //     where: {
    //         prix: {
    //             lt: 100,
    //         }
    //     }
    // });
    // console.log(allUsers);

    for(let i = 0; i<20; i++) {
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Chimpanzee-Head.jpg/640px-Chimpanzee-Head.jpg",
                reference: "referenceTest",
                idCategorie: product.idCategorie,
                idVendeur: product.idVendeur,
            }
        })
    }
}

export async function fillDatabaseAdmin() {

    await prisma.adresse.create({
        data: {
            idAdresse: 0,
            numeroNomRue: "1",
            ville: "admin",
            complement: "admin",
            codePostal: 0,
            pays: "admin",
        }
    })

    await prisma.entreprise.create({
        data: {
            idEntreprise: 0,
            nom: "Marketplace",
        }
    });

    await prisma.utilisateur.create({
        data: {
            idUtilisateur: 0,
            nom: "admin",
            prenom: "admin",
            // dateNaissance: "",
            genre: 0,
            email: "admin.admin@admin.fr",
            motDePasse: "admin",
            idAdresse: 0,
        }
    });

    await prisma.vendeur.create({
        data: {
            idVendeur: 0,
            nbrVentes: 0,
            benefices: 0,
            idUtilisateur: 0,
            idEntreprise: 0,
        }
    });
}