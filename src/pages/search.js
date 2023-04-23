import { getProductsData } from '../fonctions/search';
import { getCategorieIdData } from '../fonctions/SidebarData';
import * as FaIcons from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { updateProducts } from '../fonctions/filter';
import Link from 'next/link';

import {
    DEFAULT,
    FILTRE_PRIX_CROISSANT_STRING,
    FILTRE_PRIX_DECROISSANT_STRING,
    FILTRE_ALPHABETIQUE_CROISSANT_STRING,
    FILTRE_ALPHABETIQUE_DECROISSANT_STRING,
    FILTRE_STOCK,
    FILTRE_REDUCTION,
    FILTRE_DELAIS_1_5,
    FILTRE_DELAIS_6_10,
    FILTRE_DELAIS_11_20,
    FILTRE_DELAIS_20_SUP
} from '../const/filtre';

export async function getServerSideProps(context) {
    const catData = await getProductsData(context.query.q);
    const Cart = await prisma.commande.findMany({
        where: { idCommande: 8, etatCommande: 0 },
        include: {
            PanierProduit: true,
        },
    });
    const categoriesSideMenu = await getCategorieIdData();

    const InitialCart = Cart ? Cart : [{ idCommande: 0 }];
    
    return {
        props: {
            catData,
            categoriesSideMenu,
            InitialCart,
        },
    };
}

// Tableau contenant tous les types de tri possible
const sorts = [
    FILTRE_PRIX_CROISSANT_STRING,
    FILTRE_PRIX_DECROISSANT_STRING,
    FILTRE_ALPHABETIQUE_CROISSANT_STRING,
    FILTRE_ALPHABETIQUE_DECROISSANT_STRING,
]

const delaisLivraisonArray = [
    FILTRE_DELAIS_1_5,
    FILTRE_DELAIS_6_10,
    FILTRE_DELAIS_11_20,
    FILTRE_DELAIS_20_SUP,
]

// Object permettant de savoir l'état du tri et des filtres appliqués
let actualSort = {
    sortType: false,
    delaisLivraisonType: false,
    stockCheckbox: false,
    reductionCheckbox: false,
    vendeurArray: [],
    entrepriseArray: [],
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
        return;
    }
    const response = await fetch("/api/panierAddButton", {
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

export default function Categorie({ catData, InitialCart }) {

    let produits = catData.produits;
    actualSort.vendeurArray = catData.vendeurs;
    let entreprises = catData.entreprises;

    // Déclaration des hooks d'état permettant d'appliquer les filtres sur la page
    const [filter, setFilter] = useState({
        filterValue: "",
        eventFilter: "",
    });
    const [produitsTries, setProduits] = useState(produits);
    
    const [cart, setCartItems] = useState(InitialCart[0]);

    const router = useRouter();

    useEffect(() => {

        // A chaque changement de catégorie, on remet à 0 toutes les informations d'état et on reload la page pour bien afficher les produits de la nouvelle catégorie
        // (Le reload ne devrait pas petre nécessaire en principe mais avec la manière dont on a utilisé les hooks d'état, nous sommes obligés de le faire)
        const handleRouteChange = (url) => {
            actualSort.sortType = false;
            actualSort.delaisLivraisonType = false;
            actualSort.stockCheckbox = false;
            actualSort.reductionCheckbox = false;
            actualSort.vendeurArray = [],
            actualSort.entrepriseArray = [],
            router.reload();
        }
        router.events.on('routeChangeComplete', handleRouteChange);

        // On vérifie quelle action a été effectuée, si c'est le choix d'un nouveau tri ou l'application d'un filtre
        if(sorts.includes(filter.filterValue)) actualSort.sortType = filter.filterValue;
        else if(delaisLivraisonArray.includes(filter.filterValue)) actualSort.delaisLivraisonType = filter.filterValue;
        else if(filter.filterValue === FILTRE_STOCK) actualSort.stockCheckbox = !actualSort.stockCheckbox;
        else if(filter.filterValue === FILTRE_REDUCTION) actualSort.reductionCheckbox = !actualSort.reductionCheckbox;
        else if(actualSort.entrepriseArray.includes(filter.filterValue)) {
            actualSort.entrepriseArray.splice(actualSort.entrepriseArray.indexOf(filter.filterValue), 1);
        } else {
            actualSort.entrepriseArray.push(filter.filterValue);
        }

        // On met à jour les produits en fonctions du tri et des filtres
        let filteredProducts = updateProducts(produits, actualSort);
        setProduits([...filteredProducts]);

    }, [filter]);

    // Cette fonction permet de récupérer les informations venant de l'activation d'un tri ou d'un filtre
    function handleFilter(value, eventFilter = "") {
        setFilter({
            filterValue: value,
            eventFilter: eventFilter,
        });
    }

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
            {produits.length === 0 ? (
                <div className="flex justify-center mt-24 h-screen">
                <p className="text-2xl text-gray-500">Aucun résultat trouvé</p>
                </div>
            ) : (
            <div>
                <div className='flex justify-end gap-4 mr-10 mt-10'>
                    <select className="select select-bordered w-full max-w-xs" defaultValue={DEFAULT} onChange={(e) => handleFilter(e.target.value)}>
                        <option disabled value={DEFAULT}>Trier par :</option>
                        <option value={FILTRE_PRIX_CROISSANT_STRING}>{FILTRE_PRIX_CROISSANT_STRING}</option>
                        <option value={FILTRE_PRIX_DECROISSANT_STRING}>{FILTRE_PRIX_DECROISSANT_STRING}</option>
                        <option value={FILTRE_ALPHABETIQUE_CROISSANT_STRING}>{FILTRE_ALPHABETIQUE_CROISSANT_STRING}</option>
                        <option value={FILTRE_ALPHABETIQUE_DECROISSANT_STRING}>{FILTRE_ALPHABETIQUE_DECROISSANT_STRING}</option>
                    </select>
                    <select className="select select-bordered w-full max-w-xs" defaultValue={DEFAULT} onChange={(e) => handleFilter(e.target.value)}>
                        <option disabled value={DEFAULT}>Delais de livraison :</option>
                        <option value={FILTRE_DELAIS_1_5}>{FILTRE_DELAIS_1_5}</option>
                        <option value={FILTRE_DELAIS_6_10}>{FILTRE_DELAIS_6_10}</option>
                        <option value={FILTRE_DELAIS_11_20}>{FILTRE_DELAIS_11_20}</option>
                        <option value={FILTRE_DELAIS_20_SUP}>{FILTRE_DELAIS_20_SUP}</option>
                    </select>
                    <div className='flex flex-col gap-1'>
                        <span><input type="checkbox" id='stockCheckbox' className="checkbox" onClick={(eventCheckbox) => handleFilter(FILTRE_STOCK, eventCheckbox)}/> {FILTRE_STOCK}</span>
                        <span><input type='checkbox' id='reductionCheckbox' className="checkbox" onClick={(eventCheckbox) => handleFilter(FILTRE_REDUCTION, eventCheckbox)}/> {FILTRE_REDUCTION}</span>
                    </div>
                    {entreprises.length > 1 && <div className='flex flex-col gap-1'>
                        <label>Vendeurs</label>
                        {entreprises.map((entreprise) => {
                            return(
                                <span key={entreprise.idEntreprise}><input type="checkbox" id='entrepriseCheckbox' className="checkbox" onClick={(eventCheckbox) => handleFilter(entreprise.idEntreprise, eventCheckbox)}/> {entreprise.nom}</span>
                            )
                        })}
                    </div>}
                </div>

                <div className="bg-white">
                    <div className="mx-auto max-w-2xl -mt-16 px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                            {/* Affichage des produits de la catégorie */}
                            {produitsTries.map((produit) => {
                                return (
                                    <div className='group' key={produit.idProduit}>
                                        <Link
                                            href={`/products/${produit.idProduit}`}
                                            key={produit.idProduit}
                                        >
                                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                                <img
                                                src={produit.image}
                                                alt={produit.nom}
                                                height={10}
                                                width={10}
                                                className="h-full w-full object-cover object-center group-hover:opacity-75"
                                                />
                                            </div>
                                        </Link>
                                        <div className='flex flex-row'>
                                            <div>
                                            <h3 className="mt-4 text-sm text-gray-700">
                                                {produit.nom}
                                            </h3>
                                            <p className="mt-1 text-lg font-medium text-gray-900">
                                                {produit.prix} €
                                            </p>
                                            </div>
                                            <button className=" mt-7 text-normal px-4 py-2 ml-auto text-white  bg-stone-800 hover:bg-stone-950 rounded-lg transition ease-in duration-200 focus:outline-none"
                                                onClick={async (e) => {
                                                    try {
                                                    await handleNewCartData(produit, cart);
                                                    e.target.reset();
                                                    } catch (err) {
                                                    console.log(err);
                                                    }
                                                }}
                                            >
                                                Ajouter au panier
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>          
    );
}