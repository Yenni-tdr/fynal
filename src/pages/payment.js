import React from "react";
import CheckoutStepsOrder from "../components/CheckoutStepsOrder";
import { getCategorieIdData } from "../fonctions/SidebarData";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";

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
      Adresse: true,
      Utilisateur: {
        include: {
          Adresse: true,
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

export default function payment({ InitialCart }) {
  const [cart, setPaymentMeth] = useState(InitialCart);
  console.log(cart);

  const router = useRouter();

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <CheckoutStepsOrder activeStep={2} />
    </>
  );
}
