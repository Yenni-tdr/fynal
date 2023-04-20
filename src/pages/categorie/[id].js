// Ce fichier est une route dynamique. Grâce à cela, on peut automatiquement générer des pages en fonctions des catégories présentes dans la base de données.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAllCategoriesID, getCategorieProductsData } from '../../fonctions/categorie';
import { getCategorieIdData } from '../../fonctions/SidebarData';
import { updateProducts } from '../../fonctions/filter';

import {
    DEFAULT,
    FILTRE_PRIX_CROISSANT_STRING,
    FILTRE_PRIX_DECROISSANT_STRING,
    FILTRE_ALPHABETIQUE_CROISSANT_STRING,
    FILTRE_ALPHABETIQUE_DECROISSANT_STRING,
    FILTRE_STOCK,
    FILTRE_REDUCTION,
} from '../../const/const';

// Cette fonction permet de générer tous les chemins possibles en fonction des catégories présentes dans la BDD
export async function getStaticPaths() {
    const paths = await getAllCategoriesID();
    
    return {
        paths,
        fallback: false,
        // fallback: true,
    }
}

// Cette fonction permet de récupérer les produits liés à la catégorie choisie 
// On récupère aussi les informations sur les catégories pour le menu sur le côté
export async function getStaticProps({ params }) {
    const catData = await getCategorieProductsData(params.id);
    const categoriesSideMenu = await getCategorieIdData();
    
    return {
        props: {
            catData: catData,
            categoriesSideMenu: categoriesSideMenu,
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

// Object permettant de savoir l'état du tri et des filtres appliqués
let actualSort = {
    sortType: false,
    stockCheckbox: false,
    reductionCheckbox: false,
    vendeurArray: [],
    entrepriseArray: [],
}

export default function Categorie({ catData }) {

    // voir pour peut être faire une page de chargement avec fallback: true
    // si on le fait ici, le faire aussi pour les pages produits
    // const router = useRouter();

    // if(router.isFallback) {
    //     return <div>Loading...</div>
    // }

    // On récupère les informations venant de la BDD et on les organise
    const infosCategorie = {
        libelle: catData[0].libelle,
        description: catData[0].description,
    };
    let produits = catData.produits;
    actualSort.vendeurArray = catData.vendeurs;
    let entreprises = catData.entreprises;

    // Déclaration des hooks d'état permettant d'appliquer les filtres sur la page
    const [filter, setFilter] = useState({
        filterValue: "",
        eventFilter: "",
    });
    const [produitsTries, setProduits] = useState(produits);

    const router = useRouter();

    useEffect(() => {

        // A chaque changement de catégorie, on remet à 0 toutes les informations d'état et on reload la page pour bien afficher les produits de la nouvelle catégorie
        // (Le reload ne devrait pas petre nécessaire en principe mais avec la manière dont on a utilisé les hooks d'état, nous sommes obligés de le faire)
        const handleRouteChange = (url) => {
            actualSort.sortType = false;
            actualSort.stockCheckbox = false;
            actualSort.reductionCheckbox = false;
            actualSort.vendeurArray = [],
            actualSort.entrepriseArray = [],
            router.reload();
        }
        router.events.on('routeChangeComplete', handleRouteChange);

        // On vérifie quelle action a été effectuée, si c'est le choix d'un nouveau tri ou l'application d'un filtre
        if(sorts.includes(filter.filterValue)) actualSort.sortType = filter.filterValue;
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

    /*
    Gestion des filtres :
    - delaisLivraison : faire un slider (si possible, sinon un menu deroulant), directement regarder dans le tableau 'produits', pas besoin de récupérer d'information au préalable
    - categorie : cases à cocher '[case] Nom catégorie', comparer avec les valeurs dans le tableau, récupérer au préalable les catégories des produits affichés sur la page (donc afficher ce filtre seulement si l'utilisateur fait une recherche)
    */

    // Affichage de la page
    return (
        <div>
            <h1 className='text-center mt-8 font-semibold text-3xl italic'>{ infosCategorie.libelle }</h1>
            <h2 className='text-center mt-8 font-semibold text-xl italic'>{ infosCategorie.description }</h2>
            {/* Affichage des filtres */}
            <div className='flex justify-end gap-4 mr-10 mt-10'>
                <select className="select select-bordered w-full max-w-xs" defaultValue={DEFAULT} onChange={(e) => handleFilter(e.target.value)}>
                    <option disabled value={DEFAULT}>Trier par :</option>
                    <option value={FILTRE_PRIX_CROISSANT_STRING}>{FILTRE_PRIX_CROISSANT_STRING}</option>
                    <option value={FILTRE_PRIX_DECROISSANT_STRING}>{FILTRE_PRIX_DECROISSANT_STRING}</option>
                    <option value={FILTRE_ALPHABETIQUE_CROISSANT_STRING}>{FILTRE_ALPHABETIQUE_CROISSANT_STRING}</option>
                    <option value={FILTRE_ALPHABETIQUE_DECROISSANT_STRING}>{FILTRE_ALPHABETIQUE_DECROISSANT_STRING}</option>
                </select>
                <div className='flex flex-col gap-1'>
                    <span><input type="checkbox" id='stockCheckbox' className="checkbox" onClick={(eventCheckbox) => handleFilter(FILTRE_STOCK, eventCheckbox)}/> {FILTRE_STOCK}</span>
                    <span><input type='checkbox' id='reductionCheckbox' className="checkbox" onClick={(eventCheckbox) => handleFilter(FILTRE_REDUCTION, eventCheckbox)}/> {FILTRE_REDUCTION}</span>
                </div>
                {entreprises.length > 1 && <div className='flex flex-col gap-1'>
                    <label>Vendeurs</label>
                    {entreprises.map((entreprise) => {
                        return(
                            <span><input type="checkbox" id='entrepriseCheckbox' className="checkbox" onClick={(eventCheckbox) => handleFilter(entreprise.idEntreprise, eventCheckbox)}/> {entreprise.nom}</span>
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
                                <a key={produit.idProduit} href={'/'} className="group">
                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                    <img
                                    src={produit.image}
                                    alt={produit.nom}
                                    height={10}
                                    width={10}
                                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                                    />
                                </div>
                                <div className='flex flex-row space-x-44'>
                                    <div>
                                        <h3 className="mt-4 text-sm text-gray-700">{produit.nom}</h3>
                                        <p className="mt-1 text-lg font-medium text-gray-900">{produit.prix} €</p>
                                    </div>
                                    {/* <button id='addCart' className="bg-slate-200 hover:bg-slate-300 text-black  text-xl font-semibold py-2 px-4 mt-4 rounded shadow"
                                            onClick={() => addToCart(produit)}> <FaIcons.FaCartPlus/>
                                    </button> */}
                                </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}