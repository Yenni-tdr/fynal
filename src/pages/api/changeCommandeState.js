import { prisma } from "../../../db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { commandes } = JSON.parse(req.body);
    console.log("SKIA", commandes);
    try {
      await prisma.commande.updateMany({
        where: {
          idCommande: { in: commandes },
        },
        data: {
          etatCommande: 2,
        },
      });

      res.status(200).json({ message: "État des commandes mis à jour avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour de l'état des commandes" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(400).json({ error: "Mauvaise méthode de requête. Utilisez la méthode POST" });
  }
}
