// Ce fichier est une route dynamique. Grâce à cela, on peut automatiquement générer des pages en fonctions des catégories présentes dans la base de données.

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getAllCategoriesID,
  getCategorieProductsData,
} from "../../fonctions/categorie";
import { getCategorieIdData } from "../../fonctions/SidebarData";
import { updateProducts } from "../../fonctions/filter";
import { ProductCard } from "../../components/ProductCard";
import { useCookies } from "react-cookie";
import isNotConnected from "../../fonctions/isNotConnected";
import cookie from "cookie";
import useSWR from "swr";

// récupération des cookies
// function isAuth(req) {
//   return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
// }

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
  FILTRE_DELAIS_20_SUP,
} from "../../const/filtre";

// Cette fonction permet de générer tous les chemins possibles en fonction des catégories présentes dans la BDD
export async function getStaticPaths() {
  const paths = await getAllCategoriesID();

  return {
    paths,
    fallback: false,
    // fallback: true,
  };
}

// Cette fonction permet de récupérer les produits liés à la catégorie choisie
// On récupère aussi les informations sur les catégories pour le menu sur le côté
export async function getStaticProps({ params }) {
  // const cookies = isAuth(req);

  // // si l'user est pas connecté, on le renvois vers signin
  // isNotConnected(cookies);
  // const user = cookies.user;
  // const user = JSON.parse(cookies.user);
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
];

const delaisLivraisonArray = [
  FILTRE_DELAIS_1_5,
  FILTRE_DELAIS_6_10,
  FILTRE_DELAIS_11_20,
  FILTRE_DELAIS_20_SUP,
];

// Object permettant de savoir l'état du tri et des filtres appliqués
let actualSort = {
  sortType: false,
  delaisLivraisonType: false,
  stockCheckbox: false,
  reductionCheckbox: false,
  vendeurArray: [],
  entrepriseArray: [],
};

async function newCartData(product, commande, idUtilisateur) {
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
  const response = await fetch("../api/panierAddButton", {
    method: "POST",
    body: JSON.stringify({
      idProduit: product.idProduit,
      idCommande: IDCOMMANDE,
      quantite: quantity,
      exist: exist,
      idUtilisateur: idUtilisateur,
    }),
  });

  if (!response.ok) {
    console.log(response);
    throw new Error(response.statusText);
  }

  const updatedCart = await response.json();
  return updatedCart;
}

export default function Categorie({ catData }) {
  // voir pour peut être faire une page de chargement avec fallback: true
  // si on le fait ici, le faire aussi pour les pages produits
  // const router = useRouter();

  // if(router.isFallback) {
  //     return <div>Loading...</div>
  // }

  // Récupération des cookies user
  const [cookies] = useCookies(["user"]);
  const router = useRouter();

  const [cart, setCartItems] = useState(0);

  const fetcher = (url) =>
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idUtilisateur: cookies?.user?.idUtilisateur }),
    })
      .then((res) => res.json())
      .then((data) => {
        const InitialCart = data
          ? data
          : [{ idCommande: 0, idUtilisateur: cookies?.user?.idUtilisateur }];
        setCartItems(InitialCart[0]);
      });

  // Envoie de la requête à chaque chargement de la page à l'aide d'SWR
  const {
    data,
    error: errorSWR,
    isLoading: isLoadingSWR,
  } = useSWR(cookies["user"] ? "../api/getCommandStaticProps" : null, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  console.log(cart);

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

  useEffect(() => {
    // A chaque changement de catégorie, on remet à 0 toutes les informations d'état et on reload la page pour bien afficher les produits de la nouvelle catégorie
    // (Le reload ne devrait pas petre nécessaire en principe mais avec la manière dont on a utilisé les hooks d'état, nous sommes obligés de le faire)
    const handleRouteChange = (url) => {
      actualSort.sortType = false;
      actualSort.delaisLivraisonType = false;
      actualSort.stockCheckbox = false;
      actualSort.reductionCheckbox = false;
      (actualSort.vendeurArray = []),
        (actualSort.entrepriseArray = []),
        router.reload();
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    // On vérifie quelle action a été effectuée, si c'est le choix d'un nouveau tri ou l'application d'un filtre
    if (sorts.includes(filter.filterValue))
      actualSort.sortType = filter.filterValue;
    else if (delaisLivraisonArray.includes(filter.filterValue))
      actualSort.delaisLivraisonType = filter.filterValue;
    else if (filter.filterValue === FILTRE_STOCK)
      actualSort.stockCheckbox = !actualSort.stockCheckbox;
    else if (filter.filterValue === FILTRE_REDUCTION)
      actualSort.reductionCheckbox = !actualSort.reductionCheckbox;
    else if (actualSort.entrepriseArray.includes(filter.filterValue)) {
      actualSort.entrepriseArray.splice(
        actualSort.entrepriseArray.indexOf(filter.filterValue),
        1
      );
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

  async function handleNewCartData(product, commande, idUtilisateur) {
    try {
      if (!cookies["user"]) {
        alert("Veuillez vous connecter pour ajouter un produit");
        router.push("/signin");
      }
      console.log(idUtilisateur);
      console.log(commande);
      const updatedProduct = await newCartData(
        product,
        commande,
        idUtilisateur
      );
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

  /*
    Gestion des filtres :
    - delaisLivraison : faire un slider (si possible, sinon un menu deroulant), directement regarder dans le tableau 'produits', pas besoin de récupérer d'information au préalable
    - categorie : cases à cocher '[case] Nom catégorie', comparer avec les valeurs dans le tableau, récupérer au préalable les catégories des produits affichés sur la page (donc afficher ce filtre seulement si l'utilisateur fait une recherche)
    */

  // Affichage de la page
  console.log(cart);
  return (
    <div>
      <h1 className="text-center mt-8 font-semibold text-3xl italic">
        {infosCategorie.libelle}
      </h1>
      <h2 className="text-center mt-8 font-semibold text-xl italic">
        {infosCategorie.description}
      </h2>
      {/* Affichage des filtres */}

      <div className="flex justify-end gap-4 mr-10 mt-10">
        <select
          className="select select-bordered w-full max-w-xs"
          defaultValue={DEFAULT}
          onChange={(e) => handleFilter(e.target.value)}
        >
          <option disabled value={DEFAULT}>
            Trier par :
          </option>
          <option value={FILTRE_PRIX_CROISSANT_STRING}>
            {FILTRE_PRIX_CROISSANT_STRING}
          </option>
          <option value={FILTRE_PRIX_DECROISSANT_STRING}>
            {FILTRE_PRIX_DECROISSANT_STRING}
          </option>
          <option value={FILTRE_ALPHABETIQUE_CROISSANT_STRING}>
            {FILTRE_ALPHABETIQUE_CROISSANT_STRING}
          </option>
          <option value={FILTRE_ALPHABETIQUE_DECROISSANT_STRING}>
            {FILTRE_ALPHABETIQUE_DECROISSANT_STRING}
          </option>
        </select>
        <select
          className="select select-bordered w-full max-w-xs"
          defaultValue={DEFAULT}
          onChange={(e) => handleFilter(e.target.value)}
        >
          <option disabled value={DEFAULT}>
            Delais de livraison :
          </option>
          <option value={FILTRE_DELAIS_1_5}>{FILTRE_DELAIS_1_5}</option>
          <option value={FILTRE_DELAIS_6_10}>{FILTRE_DELAIS_6_10}</option>
          <option value={FILTRE_DELAIS_11_20}>{FILTRE_DELAIS_11_20}</option>
          <option value={FILTRE_DELAIS_20_SUP}>{FILTRE_DELAIS_20_SUP}</option>
        </select>
        <div className="flex flex-col gap-1">
          <span>
            <input
              type="checkbox"
              id="stockCheckbox"
              className="checkbox"
              onClick={(eventCheckbox) =>
                handleFilter(FILTRE_STOCK, eventCheckbox)
              }
            />{" "}
            {FILTRE_STOCK}
          </span>
          <span>
            <input
              type="checkbox"
              id="reductionCheckbox"
              className="checkbox"
              onClick={(eventCheckbox) =>
                handleFilter(FILTRE_REDUCTION, eventCheckbox)
              }
            />{" "}
            {FILTRE_REDUCTION}
          </span>
        </div>
        {entreprises.length > 1 && (
          <div className="flex flex-col gap-1">
            <label>Vendeurs</label>
            {entreprises.map((entreprise) => {
              return (
                <span key={entreprise.idEntreprise}>
                  <input
                    type="checkbox"
                    id="entrepriseCheckbox"
                    className="checkbox"
                    onClick={(eventCheckbox) =>
                      handleFilter(entreprise.idEntreprise, eventCheckbox)
                    }
                  />{" "}
                  {entreprise.nom}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white">
        <div className="mx-auto max-w-2xl -mt-16 px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {/* Affichage des produits de la catégorie */}
            {produitsTries.map((produit) => {
              return (
                // <div className='group' key={produit.idProduit}>
                //     <Link
                //         href={`/products/${produit.idProduit}`}
                //         key={produit.idProduit}
                //     >
                //         <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                //             <img
                //             src={produit.image}
                //             alt={produit.nom}
                //             height={10}
                //             width={10}
                //             className="h-full w-full object-cover object-center group-hover:opacity-75"
                //             />
                //         </div>
                //     </Link>
                //     <div className='flex flex-row'>
                //         <div>
                //         <h3 className="mt-4 text-sm text-gray-700">
                //             {produit.nom}
                //         </h3>
                //         <p className="mt-1 text-lg font-medium text-gray-900">
                //             {produit.prix} €
                //         </p>
                //         </div>
                //         <button className=" mt-7 text-normal px-4 py-2 ml-auto text-white  bg-stone-800 hover:bg-stone-950 rounded-lg transition ease-in duration-200 focus:outline-none"
                //             onClick={async (e) => {
                //                 try {
                //                 await handleNewCartData(produit, cart);
                //                 e.target.reset();
                //                 } catch (err) {
                //                 console.log(err);
                //                 }
                //             }}
                //         >
                //             Ajouter au panier
                //         </button>
                //     </div>
                // </div>

                <ProductCard
                  key={produit.idProduit}
                  produit={produit}
                  cart={cart}
                  idUtilisateur={cookies?.user?.idUtilisateur}
                  handleNewCartData={handleNewCartData}
                ></ProductCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
