import { prisma } from "../../db";

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
  
    return {
        produits,
    }
}