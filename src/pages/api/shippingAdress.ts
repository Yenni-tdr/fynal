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
    cartData.codePostal === cartData.AdressePrev.codePostal &&
    cartData.complement === cartData.AdressePrev.complement
  ) {
    const addShippingAdress = await prisma.commande.updateMany({
      where: {
        idCommande: cartData.idCommande,
      },
      data: {
        idAdresse: cartData.AdressePrev.idAdresse,
      },
    });
  } else {
    const changeAdress = await prisma.adresse.create({
      data: {
        ville: cartData.ville,
        numeroNomRue: cartData.numeroNomRue,
        codePostal: cartData.codePostal,
        pays: cartData.pays,
        complement: cartData.complement,
      },
    });

    const addShippingAdress = await prisma.commande.update({
      where: {
        idCommande: cartData.idCommande,
      },
      data: {
        idAdresse: changeAdress.idAdresse,
      },
    });
  }

  const returnData = await prisma.commande.findUnique({
    where: { idCommande: cartData.idCommande },
    include: {
      PanierProduit: {
        include: {
          Produit: true,
        },
      },
      Adresse: true,
    },
  });

  res.json(returnData);
};
