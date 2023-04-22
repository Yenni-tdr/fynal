import React, { useContext, useEffect } from "react";
import CheckoutStepsOrder from "../components/CheckoutStepsOrder";
import { getCategorieIdData } from "../fonctions/SidebarData";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import { Commande } from "@prisma/client";

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
  const InitialCart = Cart.length !== 0 ? Cart : [{ idCommande: 0, method_payment : false, idAdresse : false }];
  if (!InitialCart[0].idAdresse) {
    return {
      redirect: {
        destination: '/Shipping',
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

export default function payment({ InitialCart }) {
  const [paymentMethod, setPaymentMeth] = useState("");

  const [cart, setCart] = useState(InitialCart[0]);

  console.log(cart);

  const router = useRouter();

  useEffect(() => {

    if (!cart.idAdresse) {
      router.push("/Shipping");
    }

    setPaymentMeth(cart.method_payment || "");
  }, [cart.method_payment, router, cart.idAdresse]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      return alert("Veuillez choisir un mode de paiement");
    }

    const response = await fetch("/api/setPaymentMethod", {
      method: "POST",
      body: JSON.stringify({
        method_payment: paymentMethod,
        idCommande: cart.idCommande,
      }),
    });

    const updatedProduct = await response.json();
    console.log(response);
    if (!response.ok) {
      console.log(response);
      throw new Error(response.statusText);
    }

    router.push("/order");
  };

  return (
    <>
      <CheckoutStepsOrder activeStep={2} />
      <form className="mx-auto- max-w-screen-md" onSubmit={submitHandler}>
        <ul class="grid gap-6 md:w-8/12 lg:w-6/12 sm:w-full md:grid-cols-1 content-center">
          {["Paypal", "Stripe"].map((payment) => (
            <li key={payment}>
              <input
                type="radio"
                id={payment}
                name="paymentMeth"
                class="hidden peer"
                checked={paymentMethod === payment}
                onChange={() => setPaymentMeth(payment)}
                required
              ></input>
              <label
                htmlFor={payment}
                class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div class="block">
                  <div class="w-full">{payment}</div>
                </div>
                <svg
                  aria-hidden="true"
                  class="w-6 h-6 ml-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </label>
            </li>
          ))}
        </ul>
        <div className="mb-4 flex justify-between py-5 px-7">
          <button
            onClick={() => router.push("/Shipping")}
            type="button"
            className="inline-block rounded bg-info px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#54b4d3] transition duration-150 ease-in-out hover:bg-info-600 hover:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:bg-info-600 focus:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:outline-none focus:ring-0 active:bg-info-700 active:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(84,180,211,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)]"
          >
            Retour
          </button>
          <button className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
            Next
          </button>
        </div>
      </form>
    </>
  );
}
