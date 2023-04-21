import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Commande } from "@prisma/client";

const prisma = new PrismaClient();

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "error method" });
  }
  const cartData = JSON.parse(req.body);

  const newCartData = await prisma.commande.update({
    where: {
      idCommande: cartData.idCommande,
    },
    data: {
      etatCommande: 1,
    },
  });
  res.json(newCartData);
};
