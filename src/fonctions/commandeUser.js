import { prisma } from "../../db";
import { useCookies } from "react-cookie";

/*
 * Cette fonction permet de récupérer les informations sur les catégories dans la BDD et ensuite générer le lien permettant d'y accéder.
 * Cette fonction est utilisé pour afficher les catégories dans le menu ouvrable à gauche.
 *
 * Valeur de retour : tableau contenant le nom des catégories ainsi que le lien permettant d'y accéder.
 */
export async function commandeUser(user) {
  //   JSON.parse(user);
  console.log(user);
  // const InitialCart = await prisma.commande.findMany({
  //   where: {
  //     idUtilisateur: user.idUtilisateur,
  //     etatCommande: 0,
  //   },
  //   include: {
  //     PanierProduit: {
  //       include: {
  //         Produit: true,
  //       },
  //     },
  //   },
  // });

  //   return InitialCart;
}
