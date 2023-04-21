import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Commande } from "@prisma/client";

const prisma = new PrismaClient();

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "error method" });
  }
  const cartData = JSON.parse(req.body);

  if (
    cartData.numeroNomRue === cartData.AdressePrev.numeroNomRue &&
    cartData.ville === cartData.AdressePrev.ville &&
    cartData.pays === cartData.AdressePrev.pays &&
    cartData.codePostal === cartData.AdressePrev.codePostal
  ) {
    const addShippingAdress = await prisma.commande.update({
      where: {
        idCommande: cartData.idCommande,
      },
      data: {
        idAdresse: cartData.AdressePrev.idAdresse,
      },
    });

    const returnData = await prisma.commande.findUnique({
      where: { idCommande: cartData.idCommande },
      include: {
        PanierProduit: {
          include: {
            Produit: true,
          },
        },
      },
    });

    res.json(returnData);
  } else {
    const addShippingAdress = await prisma.commande.update({
      where: {
        idCommande: cartData.idCommande,
      },
      data: {
        Adresse: {
          create: {
            numeroNomRue: cartData.numeroNomRue,
            ville: cartData.ville,
            codePostal: cartData.codePostal,
            pays: cartData.pays,
          },
        },
      },
    });

    const returnData = await prisma.commande.findUnique({
      where: { idCommande: cartData.idCommande },
      include: {
        PanierProduit: {
          include: {
            Produit: true,
          },
        },
      },
    });

    res.json(returnData);
  }
};
