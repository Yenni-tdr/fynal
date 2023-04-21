import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategorieIdData } from '../../fonctions/SidebarData';   
import { prisma } from "../../../db";

export async function getStaticPaths(){

    const products = await prisma.produit.findMany({
        where: {},
        select: {
            idProduit: true,
        }
        
    });

    const paths = products.map((produit) => ({
        params: { slug: produit.idProduit.toString() },
    }));
    // console.log(paths);
    return {
        paths,
        fallback: false}
}

export async function getStaticProps(context){

    const id = context.params.slug;
    const categoriesSideMenu = await getCategorieIdData();
    const prodData = await prisma.produit.findMany({
        where: {
            idProduit: parseInt(id),
        },
    });
    return {
        props : {
            produit: prodData,
            categoriesSideMenu,
        },
    };

}

export default function Products({produit}) {
    return (
        <div>                             
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                    
                   
                    <img src={produit[0].image} alt={produit[0].nom} className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded">

                    </img>
                    <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                        <h2 className="text-sm title-font text-gray-500 tracking-widest">Fynal</h2>
                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{produit[0].nom}</h1>
                        <div className="flex mb-4">
                                         
                        </div>
                        <p className="leading-relaxed">{produit[0].description}</p>
                        <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">      
                        <p>Délai de livraison estimé : {produit[0].delaisLivraison} jours</p>                        
                        </div>
                        <div className="flex">
                        <span className="title-font font-medium text-2xl text-gray-900">{produit[0].prix > 0 ? produit[0].prix +" €" : "Rupture de stock"}</span>
                        <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Ajouter au panier</button>
                        </div>
                    </div>
                    </div>
                </div>
            </section>
</div>


    )
}