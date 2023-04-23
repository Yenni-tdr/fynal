import React, { useState, useEffect } from "react";
import { prisma } from "../../db";

const Historique = ({ commandes }) => {
  const [total, setTotalItem] = useState(0);

  return (
    <div>
      <div className="py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-semibold ">Historique des commandes</h1>
        </div>
        {commandes.map((commande) => {
          return (
            <div key={commande.idCommande}>
              <div className="bg-gray-200 flex gap-4 rounded-lg p-4 mt-4 mx-4 md:mx-10 lg:mx-20 xl:mx-32">
                <p className="text-gray-600 text-sm">
                  Date de commande : {commande.dateCommande}
                </p>
                <p className="text-gray-600 text-sm">
                  ID de commande : {commande.idCommande}
                </p>
                <p className="text-gray-600 text-sm">
                  Etat de la commande : {commande.etatCommande}
                </p>
                <p className="text-gray-600 text-sm">Total : {total} €</p>
              </div>
              <div className="bg-gray-200 rounded-lg p-4 mt-4 mx-4 md:mx-10 lg:mx-20 xl:mx-32">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-gray-600 text-left">
                        Produit
                      </th>
                      <th className="px-4 py-2 text-gray-600 text-left">
                        Quantité
                      </th>
                      <th className="px-4 py-2 text-gray-600 text-left">
                        Prix unitaire
                      </th>
                      <th className="px-4 py-2 text-gray-600 text-left">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {commande.PanierProduit.map((Data) => {
                      useEffect(() => {
                        const sum = commande.PanierProduit.map(
                          (item) => item.Produit.prix * item.quantite
                        ).reduce((acc, val) => acc + val, 0);
                        setTotalItem(sum);
                      }, [commande.PanierProduit]);
                      console.log("Neyzz", Data);
                      return (
                        <tr
                          className="border-b pb-4"
                          key={Data.Produit.idProduit}
                        >
                          <td className="px-4 py-2">
                            <img
                              src={Data.Produit.image}
                              alt={Data.Produit.nom}
                              className="ml-4 h-20 w-20 object-contain rounded-full"
                            />
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {Data.quantite}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {Data.Produit.prix} €
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {Data.Produit.prix * Data.quantite} €
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const UtilisateurId = 4;
  const Utilisateur = prisma.utilisateur;

  try {
    //const utilisateurs = await Utilisateur.findMany();

    const utilisateur = await Utilisateur.findUnique({
      where: {
        idUtilisateur: UtilisateurId,
        /*
        idUtilisateur: {
          in: utilisateurs.map((utilisateur) => utilisateur.idUtilisateur),
        },
        */
      },
      include: {
        Commande: {
          include: {
            PanierProduit: {
              include: {
                Produit: true,
              },
            },
          },
        },
      },
    });

    const commandes = utilisateur.Commande;

    return {
      props: {
        commandes,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        commandes: [],
      },
    };
  }
}

export default Historique;
