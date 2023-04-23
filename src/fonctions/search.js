import { prisma } from "../../db";
import arrayUnique from "./uniqueValuesFromArray";

export async function getProductsData(searchTerm) {
   
    console.log(searchTerm);
  
    const produits = await prisma.produit.findMany({
      where: {
        OR: [
          { nom: { contains: searchTerm, mode: 'insensitive' } },
          //{ description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
    })

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
        produits,
        vendeurs,
        entreprises,
    }
}