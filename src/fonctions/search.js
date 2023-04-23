import { prisma } from "../../db";
import arrayUnique from "./uniqueValuesFromArray";

export async function getProductsData(searchTerm) {
    // Recherche des produits qui ont un nom contenant le searchTerm 
    const produits = await prisma.produit.findMany({
      where: {
        OR: [
          { nom: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
    })
    
   // Filtrage des vendeurs uniques dans les produits trouvés
    const vendeurFiltre = arrayUnique( 
      produits.map((produit) => { 
          return produit.idVendeur 
      })
    );
    
    // Recherche des vendeurs correspondants aux vendeurs filtrés
    const vendeurs = await prisma.vendeur.findMany({
        select: {
            idVendeur: true,
            idEntreprise: true,
        },
        where: {
            idVendeur: { in: vendeurFiltre },
        }
    });

   // Filtrage des entreprises uniques dans les vendeurs trouvés
    const entrepriseFiltre = arrayUnique( 
        vendeurs.map((vendeur) => { 
            return vendeur.idEntreprise 
        })
    );
    
    // Recherche des entreprises correspondant aux entreprises filtrées
    const entreprises = await prisma.entreprise.findMany({
        where: {
            idEntreprise: { in: entrepriseFiltre },
        }
    });
  
    // Retourne un objet contenant les produits, les vendeurs et les entreprises correspondants
    return {
        produits,
        vendeurs,
        entreprises,
    }
}
