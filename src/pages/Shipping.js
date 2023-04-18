import React from 'react'
import CheckoutStepsOrder from '../components/CheckoutStepsOrder'
import Layout from '../components/Layout'
import { getCategorieIdData } from "../fonctions/SidebarData";
import {useForm} from 'react-hook-form'
import { useState } from 'react';

export async function getServerSideProps() {
    const categoriesSideMenu = await getCategorieIdData();
    const InitialCart = await prisma.commande.findMany({
      where: { 
        idCommande: 8,
        etatCommande : 0,
      },
      include: {
        PanierProduit: {
          include: {
            Produit: true,
          },
        },
        Adresse : true,
        Utilisateur : {
            include : {
                Adresse : true,
            }
        }
      },
    });
    return {
      props: {
        categoriesSideMenu,
        InitialCart,
      },
    };
}

// const wait = function(duration = 1000){
//     return new Promise((resolve) =>{
//         window.setTimeout(resolve, duration)
//     })
// }

export default function Shipping({InitialCart}){
    const [cart, setCart] = useState(InitialCart);


    const{
        handleSubmit,
        register,
        formState: {errors},
        setValue,
        getValues,
        formState,
    } = useForm();

    const {isSubmitting} = formState;

    const submitHandler = async ({ numeroNomRue , ville, codePostal, pays}) => {
        // await wait(1000)
        const response = await fetch("/api/shippingAdress", {
            method: "POST",
            body: JSON.stringify({
              idCommande: cart[0].idCommande,
              idUtilisateur : cart[0].idUtilisateur,
              AdressePrev : cart[0].Utilisateur.Adresse,
              numeroNomRue : numeroNomRue,
              ville : ville,
              codePostal : parseInt(codePostal),
              pays : pays,
            }),
          });
        
          if (!response.ok) {
            throw new Error(response.statusText);
          }
        
          const updatedProduct = await response.json();
          return updatedProduct;

        // const cartData = {idCommande: cart[0].idCommande,
        //       idUtilisateur : cart[0].idUtilisateur,
        //       AdressePrev : cart[0].Utilisateur.Adresse,
        //       numeroNomRue : numeroNomRue,
        //       ville : ville,
        //       codePostal : parseInt(codePostal),
        //       pays : pays,}
        // if((cartData.numeroNomRue === cartData.AdressePrev.numeroNomRue) && (cartData.ville === cartData.AdressePrev.ville) && (cartData.pays === cartData.AdressePrev.pays) && (cartData.codePostal === cartData.AdressePrev.codePostal)){
        //     console.log(true)
        //     console.log(cartData.numeroNomRue === cartData.AdressePrev.numeroNomRue);
        //     console.log(cartData.ville === cartData.AdressePrev.ville)
        //     console.log(cartData.pays === cartData.AdressePrev.pays)
        //     console.log(cartData.codePostal === cartData.AdressePrev.codePostal)
        // }else{
        //     console.log(false);
        //     console.log(cartData.numeroNomRue === cartData.AdressePrev.numeroNomRue);
        //     console.log(cartData.ville === cartData.AdressePrev.ville)
        //     console.log(cartData.pays === cartData.AdressePrev.pays)
        //     console.log(cartData.codePostal === cartData.AdressePrev.codePostal)
        // }

        // console.log(cartData)
    }


  return (
    <>
    <CheckoutStepsOrder activeStep={1}/>
    <form className='mx-auto max-w-screen-md' onSubmit={handleSubmit(submitHandler)}>
        <h1 className='mb-4 text-xl'>Adresse de livraison</h1>
        <div className='mb-4'>
            <label htmlFor='Nom'>Rue</label>
            <input defaultValue={cart[0].Utilisateur.Adresse.numeroNomRue} className='w-full border-solid border-2  rounded border-black' id="numeroNomRue" autoFocus {...register('numeroNomRue',{required : 'Veuillez rentrer une rue',})}/>
            {errors.numeroNomRue && (
                <div className='text-red-500'>{errors.numeroNomRue.message}</div>
            )}
        </div>
        <div className='mb-4'>
            <label htmlFor='Nom'>Ville</label>
            <input defaultValue={cart[0].Utilisateur.Adresse.ville} className='w-full border-solid border-2  rounded border-black' id="ville" autoFocus {...register('ville',{required : 'Veuillez rentrer une ville',})}/>
            {errors.ville && (
                <div className='text-red-500'>{errors.ville.message}</div>
            )}
        </div>
        <div className='mb-4'>
            <label htmlFor='Nom'>codePostal</label>
            <input defaultValue={cart[0].Utilisateur.Adresse.codePostal} className='w-full border-solid border-2  rounded border-black' id="codePostal" autoFocus {...register('codePostal',{required :'Veuillez rentrer un code postal' ,})}/>
            {errors.codePostal && (
                <div className='text-red-500'>{errors.codePostal.message}</div>
            )}
        </div>
        <div className='mb-4'>
            <label htmlFor='Nom'>Pays</label>
            <input defaultValue={cart[0].Utilisateur.Adresse.pays} className='w-full border-solid border-2  rounded border-black' id="pays" autoFocus {...register('pays',{required : 'Veuillez rentrer un pays',})}/>
            {errors.pays && (
                <div className='text-red-500'>{errors.pays.message}</div>
            )}
        </div>
        <div className='mb-4 flex justify-between'>
            <button disabled={isSubmitting} className="rounded-lg bg-blue-500 px-5 py-3 text-base mb-3 font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700">Next</button>
        </div>
    </form>


    </>
    

  )
}
