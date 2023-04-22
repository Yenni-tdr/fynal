import React, { useEffect } from "react";
import CheckoutStepsOrder from "../components/CheckoutStepsOrder";
import Link from "next/link";
import Image from "next/image";
import { getCategorieIdData } from "../fonctions/SidebarData";
import { useState } from "react";
import { useRouter } from "next/router";

export async function getServerSideProps() {
  const categoriesSideMenu = await getCategorieIdData();
  const Cart = await prisma.commande.findMany({
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
      Adresse: true,
      Utilisateur: {
        include: {
          Adresse: true,
        },
      },
    },
  });
  const InitialCart = Cart.length !== 0 ? Cart : [{ idCommande: 0, method_payment : false, idAdresse : false, Utilisateur : false, PanierProduit : false }];
  if (!InitialCart[0].method_payment) {
    return {
      redirect: {
        destination: '/payment',
        permanent: false,
      },
    }
  }
  return {
    props: {
      categoriesSideMenu,
      InitialCart,
    },
  };
}

export default function order({ InitialCart }) {
  const [cart, setCart] = useState(InitialCart[0]);
  const router = useRouter();

  useEffect(() => {
    if (!cart.method_payment) {
      return router.push("/payment");
    }
  }, [cart.method_payment, router]);

  const [load, setLoad] = useState(false);

  const orderHandler = async () => {
    setLoad(true);
    const response = await fetch("/api/orderEnd", {
      method: "POST",
      body: JSON.stringify({
        idCommande: cart.idCommande,
      }),
    });
    const updatedProduct = await response.json();

    console.log(response);
    if (!response.ok) {
      console.log(response);
      setLoad(false);
      throw Error(response.statusText);
    }

    setLoad(false);
    router.push("/");
  };

  const totalPrice = cart.PanierProduit.reduce(
    (acc, currentValue) =>
      acc + currentValue.Produit.prix * currentValue.quantite,
    0
  );
  const TVA = totalPrice * 0.2;

  return (
    <>
      <CheckoutStepsOrder activeStep={3} />
      <h1 className="mb-4 text-xl mx-6 font-bold overline">Achat</h1>
      {cart.PanierProduit.length === 0 ? (
        <div>
          Panier vide qu'estce que tu fais la coquin
          <Link>Retour aux achats</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5 mx-4">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5  border-t-[1px] border-l-2 border-r-2 border-b-4 shadow-md">
              <h2 className="mb-2 text-xl font-semibold">
                Adresse de livraison
              </h2>
              <div>
                {cart.Utilisateur.nom}
                &nbsp;
                {cart.Utilisateur.prenom}
                <br />
                {cart.Adresse.numeroNomRue}
                <br />
                {cart.Adresse.complement}
                <br />
                {cart.Adresse.ville.toUpperCase()},&nbsp;
                {cart.Adresse.codePostal}
                <br />
                {cart.Adresse.pays}
              </div>
              <Link
                className=" mt-4 w-full text-center border-zinc-300 border-5 px-5 py-2.5 font-medium bg-gray-200 hover:bg-gray-300 hover:text-gray-800  text-gray-800 rounded-lg text-sm"
                href="/Shipping"
              >
                Modifier
              </Link>
            </div>
            <div className="card p-5  mt-8 border-t-[1px] border-l-2 border-r-2 border-b-4 shadow-md">
              <h2 className="mb-2 text-xl font-semibold">Moyen de paiement</h2>
              <div>{cart.method_payment}</div>
              <Link
                className="mt-4 w-full text-center border-zinc-300 border-5 px-5 py-2.5 font-medium bg-gray-200 hover:bg-gray-300 hover:text-gray-800  text-gray-800 rounded-lg text-sm"
                href="/Shipping"
              >
                Modifier
              </Link>
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
                  {cart.PanierProduit.map((product) => (
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
                      <td className="p-5 text-right">
                        ${product.Produit.prix}
                      </td>
                      <td className="p-5 text-right">
                        ${product.Produit.prix * product.quantite}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-5">
                <Link
                  className="mt-10 w-full text-center border-zinc-300 border-5 px-5 py-2.5 font-medium bg-gray-200 hover:bg-gray-300 hover:text-gray-800  text-gray-800 rounded-lg text-sm"
                  href="/Cart"
                >
                  Modifier
                </Link>
              </div>
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
                  {cart.PanierProduit.map((product) => (
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

              <Link
                className="mt-5 mb-4 w-full text-center border-zinc-300 border-5 px-5 py-2.5 font-medium bg-gray-200 hover:bg-gray-300 hover:text-gray-800  text-gray-800 rounded-lg text-sm"
                href="/Cart"
              >
                Modifier
              </Link>
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
                  <button
                    disabled={load}
                    onClick={orderHandler}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {load ? "Chargement..." : "Commande"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
