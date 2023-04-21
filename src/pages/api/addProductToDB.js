import { prisma } from "../../../db";
import verifProduct from "../../fonctions/verifProduct";

export default async function handler(req, res) {
    let produit = req.body;

    const categories = await prisma.categorie.findMany({
        where: {},
        select: {
            idCategorie: true,
        }
    });

    const idCategories = categories.map((categorie) => {
        return categorie.idCategorie;
    });

    const errors = verifProduct(produit, idCategories);

    produit.stock = parseInt(produit.stock);
    produit.delaisLivraison = parseInt(produit.delaisLivraison);
    produit.prix = parseFloat(produit.prix);

    if(produit.reduction === '') produit.reduction = null;
    else produit.reduction = parseInt(produit.reduction);

    if(produit.hauteur === '') produit.hauteur = null;
    else produit.hauteur = parseInt(produit.hauteur);

    if(produit.longueur === '') produit.longueur = null;
    else produit.longueur = parseInt(produit.longueur);

    if(produit.largeur === '') produit.largeur = null;
    else produit.largeur = parseInt(produit.largeur);

    if(produit.poids === '') produit.poids = null;
    else produit.poids = parseInt(produit.poids);

    if(produit.categorie === '') produit.categorie = undefined;
    else produit.categorie = parseInt(produit.categorie);
    // ajouter pour vendeur

    if(Object.values(errors).includes(true)) res.status(200).json({ data: errors });
    else {
        const produitAjoute = await prisma.produit.create({
            data: {
                nom: produit.nom,
                reference: produit.reference,
                description: produit.description,
                stock: produit.stock,
                delaisLivraison: produit.delaisLivraison,
                prix: produit.prix,
                reduction: produit.reduction,
                hauteur: produit.hauteur,
                longueur: produit.longueur,
                largeur: produit.largeur,
                poids: produit.poids,
                image: produit.image,
                Categorie: {
                    ...(produit.categorie
                        ? {
                            connect: {
                                idCategorie: produit.categorie,
                            },
                        }
                        : undefined 
                    )
                },
                Vendeur: {
                    connect: {
                        idVendeur: 0,
                    },
                },
            },
        });
        res.status(200).json({ data: "ok" });
    }
}