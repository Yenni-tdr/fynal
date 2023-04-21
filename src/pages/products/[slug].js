import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategorieIdData } from "../../fonctions/SidebarData";
import { prisma } from "../../../db";
import { useState } from "react";
import { useRouter } from "next/router";

export async function getStaticPaths() {
  const products = await prisma.produit.findMany({
    where: {},
    select: {
      idProduit: true,
    },
  });

  const paths = products.map((produit) => ({
    params: { slug: produit.idProduit.toString() },
  }));
  // console.log(paths);
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const id = context.params.slug;
  const categoriesSideMenu = await getCategorieIdData();
  const prodData = await prisma.produit.findMany({
    where: {
      idProduit: parseInt(id),
    },
  });

  const Cart = await prisma.commande.findMany({
    where: { idCommande: 8, etatCommande: 0 },
    include: {
      PanierProduit: true,
    },
  });

  const InitialCart = Cart.length !== 0 ? Cart : [{ idCommande: 0 }];
  console.log(InitialCart);
  return {
    props: {
      products: prodData,
      categoriesSideMenu,
      InitialCart,
    },
  };
}

function reload() {
  const router = useRouter();
  router.reload();
}

async function newCartData(product, commande) {
  const IDCOMMANDE = commande.idCommande === 0 ? 0 : commande.idCommande;
  const existItem =
    IDCOMMANDE === 0
      ? false
      : commande.PanierProduit.find((x) => x.idProduit === product.idProduit);
  const exist = existItem ? true : false;
  console.log(exist);
  console.log(IDCOMMANDE);
  const quantity = existItem ? existItem.quantite + 1 : 1;
  console.log(quantity);
  // console.log(quantity)
  if (product.stock < quantity) {
    alert("Produit plus en stock");
    reload();
  }
  const response = await fetch("../api/panierAddButton", {
    method: "POST",
    body: JSON.stringify({
      idProduit: product.idProduit,
      idCommande: IDCOMMANDE,
      quantite: quantity,
      exist: exist,
    }),
  });

  if (!response.ok) {
    console.log(response);
    throw new Error(response.statusText);
  }

  const updatedCart = await response.json();
  return updatedCart;
}

export default function Products({ products, InitialCart }) {
  console.log(InitialCart);
  const [product, setProduct] = useState(products[0]);

  const [cart, setCartItems] = useState(InitialCart[0]);
  console.log(cart);

  async function handleNewCartData(product, commande) {
    try {
      const updatedProduct = await newCartData(product, commande);
      console.log(updatedProduct);
      //   setCartItems((prevCart) => {
      //     const updatedProducts = prevCart.PanierProduit.map((p) =>
      //       p.idProduit === updatedProduct.PanierProduit.idProduit ? updatedProduct.PanierProduit : p
      //     );
      //     console.log(updatedProducts);
      //     return { ...prevCart, PanierProduit: updatedProducts };
      setCartItems(updatedProduct);
      console.log(updatedProduct);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              src={product.image}
              alt={product.nom}
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
            ></img>
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                Fynal
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {product.nom}
              </h1>
              <div className="flex mb-4"></div>
              <p className="leading-relaxed">{product.description}</p>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                <p>
                  Délai de livraison estimé : {product.delaisLivraison} jours
                </p>
              </div>
              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">
                  {product.prix > 0 ? product.prix + " €" : "Rupture de stock"}
                </span>
                <button
                  className="flex ml-auto text-white  bg-stone-800 border-0 py-2 px-6 focus:outline-none hover:bg-stone-950 rounded-lg transition ease-in duration-200"
                  onClick={async (e) => {
                    try {
                      await handleNewCartData(product, cart);
                      e.target.reset();
                    } catch (err) {
                      console.log(err);
                    }
                  }}
                >
                  Ajouter au panier
                </button>
              </div>
              <div className="flex">
                <Link href={"/categorie/" + product.idCategorie} className="ml-auto normal-case text-lg mt-4 hover:underline hover:text-black">            
                  Retour aux catégories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
