import React from "react";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { getCategorieIdData } from "../../fonctions/SidebarData";

export async function getServerSideProps() {
  const categoriesSideMenu = await getCategorieIdData();
  const InitialCart = await prisma.commande.findMany({
    where: {
      idCommande: 8,
      etatCommande: 0,
    },
    include: {
      PanierProduit: {
        include: {
          Produit: true,
        },
      },
    },
  });
  return {
    props: {
      categoriesSideMenu,
      InitialCart,
    },
  };
}

export default function OrderCommand({ InitialCart }) {
  const { query } = useRouter();
  const idCommande = query.id;

  const [commande, setCart] = useState(InitialCart);
  //je récupère l'id dans l'url : https//[...]/orders/:id

  //construction de l'étatInitial de ma commande
  //   const InitialState = {};
  //le useReducer part du meme principe qu'un useState mais plus personnalisable, ici il prend un paramètre 1 la fonction d'appel d'action, et en 2 l'état initial
  //   const [commande, setCommande] = useState();
  //le useEffect s'active au début de chargement d'une page et prend en deuxieme paramètre un tableau dont les effets dépends, donc quand on aura un changement d'idCommande le useEffect se remettrea à jour
  //   useEffect(() => {
  //     const fetchCommande = async () => {
  //       const response = await fetch(`/api/orders/${idCommande}`);

  //       console.log(response);
  //       if (!response.ok) {
  //         console.log(response);
  //         throw new Error(response.statusText);
  //       }
  //       const updatedProduct = await response.json();
  //       console.log(updatedProduct);
  //       setCommande(updatedProduct);
  //     };
  //si ma commande n'existe pas ou bien que ma commande existe mais qu'elle est différente de celle de l'URL alors on effectue la fonction fetch
  // if (
  //   !commande.idCommande ||
  //   (commande.idCommande && commande.idCommande !== idCommande)
  // ) {
  //     fetchCommande();
  //     // }
  //   }, [idCommande]);

  //   console.log(commande);

  return (
    <>
      <h1 className="mb-4 text-xl">{`Commande ${idCommande}`}</h1>
      <div className="grid md:grid-cols-4 md-gap-5">
        <div className="overflow-x-auto md:col-span-3">
          <div className="card p-5  border-t-[1px] border-l-2 border-r-2 border-b-4 shadow-md">
            <h2 className="mb-2 text-xl font-semibold">Adresse de livraison</h2>
            <div>
              {commande.Utilisateur.nom}
              &nbsp;
              {commande.Utilisateur.prenom}
              <br />
              {commande.Adresse.numeroNomRue}
              <br />
              {commande.Adresse.complement}
              <br />
              {commande.Adresse.ville.toUpperCase()},&nbsp;
              {commande.Adresse.codePostal}
              <br />
              {commande.Adresse.pays}
            </div>
          </div>
          <div className="card p-5  mt-8 border-t-[1px] border-l-2 border-r-2 border-b-4 shadow-md">
            <h2 className="mb-2 text-xl font-semibold">Moyen de paiement</h2>
            <div>{commande.method_payment}</div>
          </div>
          <div className="card p-5 overflow-auto mt-8 border-t-[1px] border-l-2 border-r-2 border-b-4 shadow-md hidden md:block">
            <h2 className="mb-2 text-xl font-semibold">Commandé</h2>

            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-5 text-left">Produit</th>
                  <th className="px-5 text-left">Nom</th>
                  <th className="p-5 text-right">Quantité</th>
                  <th className="p-5 text-right">Prix</th>
                  <th className="p-5 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {commande.PanierProduit.map((product) => (
                  <tr key={product.idProduit} className="border-b">
                    <td className="content-end">
                      <Link href={`/products/${product.idProduit}`}>
                        <Image
                          className="ml-5"
                          src={product.Produit.image}
                          alt={product.Produit.nom}
                          width={50}
                          height={50}
                        ></Image>
                        &nbsp;
                        {product.name}
                      </Link>
                    </td>
                    <td className="p-5">{product.Produit.nom}</td>
                    <td className="p-5 text-right">{product.quantite}</td>
                    <td className="p-5 text-right">${product.Produit.prix}</td>
                    <td className="p-5 text-right">
                      ${product.Produit.prix * product.quantite}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-5"></div>
          </div>
          <div className="mb-12"></div>
          <div className="card p-5 mb-4 mt-8 border-t-[1px] border-l-2 border-r-2 border-b-4 shadow-md md:hidden">
            <h2 className="mb-2 text-lg">Commandé</h2>

            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-5 text-left">Produit</th>
                  <th className="p-5 text-right">Quantité et Prix</th>
                  <th className="p-5 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {commande.PanierProduit.map((product) => (
                  <tr key={product.idProduit} className="border-b">
                    <td className="text-right">
                      <Link href={`/products/${product.idProduit}`}>
                        <Image
                          className="ml-5"
                          src={product.Produit.image}
                          alt={product.Produit.nom}
                          width={50}
                          height={50}
                        ></Image>
                        &nbsp;
                        {product.name}
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      {product.quantite} &nbsp; ${product.Produit.prix}
                    </td>
                    <td className="p-5 text-right">
                      ${product.Produit.prix * product.quantite}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className=" mb-10">
          <div className="card p-5 border-t-[1px] border-l-2 border-r-2 border-b-4 shadow-md">
            <h2 className="mb-2 text-lg">Résumé de la commande</h2>
            <ul>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Panier</div>
                  <div>${totalPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>TVA</div>
                  <div>${TVA}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Total</div>
                  <div>${TVA + totalPrice}</div>
                </div>
              </li>
              <li>
                {/* <button
                  disabled={load}
                  onClick={orderHandler}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {load ? "Chargement..." : "Commande"}
                </button> */}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
