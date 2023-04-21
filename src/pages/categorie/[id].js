import {
  getAllCategoriesID,
  getCategorieProductsData,
} from "../../fonctions/categorie";
import { getCategorieIdData } from "../../fonctions/SidebarData";
import { useState } from "react";
import Link from "next/link";

export async function getStaticPaths() {
  const paths = await getAllCategoriesID();
  // const paths = await dbCategoriesID();
  console.log(paths);

  return {
    paths,

    fallback: false,
  };
}

// voir pour utiliser getServerSideProps
export async function getStaticProps({ params }) {
  const catData = await getCategorieProductsData(params.id);
  const Cart = await prisma.commande.findMany({
    where: { idCommande: 8, etatCommande: 0 },
    include: {
      PanierProduit: true,
    },
  });
  const categoriesSideMenu = await getCategorieIdData();

  const InitialCart = Cart ? Cart : [{ idCommande: 0 }];

  // console.log(catData[0]);
  // catData.produits.forEach(produit => {
  //     console.log(produit.nom);
  // });
  // const TrueInitialCart = InitialCart ? : ;

  return {
    props: {
      catData,
      categoriesSideMenu,
      InitialCart,
    },
  };
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

export default function Categorie({ catData, InitialCart }) {
  // const {state, dispatch} = useContext(Store);
  // const {cart} = state

  // const addToCartHandler = (product) =>{
  //     const existItem = state.cart.PannierProduit.find((item) => item.idProduit === product.idProduit);
  //     const quantity = existItem ? existItem.quantite + 1 : 1;
  //     if(product.stock<quantity){
  //         alert("produit plus en stock");
  //         return
  //     }
  //     dispatch({type:'ADD_TO_CART', payload: {...item, quantity}});
  // }

  const [cart, setCartItems] = useState(InitialCart[0]);
  console.log(cart);
  // console.log(InitialCart.ProduitPanier[0].idProduit);

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
      <h1 className="text-center mt-8 font-semibold text-3xl italic">
        {catData[0].libelle}
      </h1>
      <h2 className="text-center mt-8 font-semibold text-xl italic">
        {catData[0].description}
      </h2>

      <div className="bg-white">
        <div className="mx-auto max-w-2xl -mt-16 px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {catData.produits.map((produit) => {
              return (
                <div className="group">
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
                  <div className="flex flex-row space-x-44">
                    <div>
                      <h3 className="mt-4 text-sm text-gray-700">
                        {produit.nom}
                      </h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        {produit.prix}
                      </p>
                    </div>
                    <button
                      onClick={async (e) => {
                        try {
                          await handleNewCartData(produit, cart);
                          e.target.reset();
                        } catch (err) {
                          console.log(err);
                        }
                      }}
                    >
                      ADD TO CART
                    </button>
                    {/* <button id='addCart' className="bg-slate-200 hover:bg-slate-300 text-black  text-xl font-semibold py-2 px-4 mt-4 rounded shadow"
                                            onClick={() => addToCart(produit)}> <FaIcons.FaCartPlus/>
                                    </button> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
