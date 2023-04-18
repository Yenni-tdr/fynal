// import { createContext, useReducer } from 'react';
// import { PrismaClient, Commande, PanierProduit } from "@prisma/client";
// import React from 'react';

// type AppState = {
//   cart: Commande | undefined;
// };

// const prisma = new PrismaClient();

// export async function getStaticProps() {
//   const commandes = await prisma.commande.findMany({ where: { idUtilisateur: 1 } });
//   return {
//     props: {
//       initialCart: commandes[0] || undefined,
//     },
//   };
// }


// const initialState = ({ initialCart }: { initialCart?: Commande }): AppState => {
//   let cart: Commande;
//   if (initialCart) {
//     cart = initialCart;
//   } else {
//     const now = new Date();
//     cart = {
//       idCommande: 0,
//       etatCommande: 0,
//       idUtilisateur: 1,
//       dateCommande: now,
//       dateLivraison: null,
//       idLivreur: null,
//       idAdresse: null,
//       PanierProduit: [],
//     };
//   }
//   return {
//     cart,
//   };
// };

// type Action = { type: 'ADD_TO_CART'; payload: PanierProduit };

// function reducer(state: AppState, action: Action): AppState {
//   switch (action.type) {
//     case 'ADD_TO_CART':
//       console.log(state);
//       const newItem = action.payload;
//       const existItem = state.cart?.PanierProduit?.find((item: PanierProduit) => item.idProduit === existItem.idProduit);
//       const PanierProduit = existItem
//         ? state.cart.PanierProduit?.map((item: PanierProduit) => (item.idProduit === existItem.idProduit ? existItem : item))
//         : [...(state.cart?.PanierProduit || []), newItem];

//       return { ...state, cart: state.cart ? { ...state.cart, PanierProduit } : undefined };
//     default:
//       return state;
//   }
// }

// const defaultDispatch: React.Dispatch<Action> = () => initialState({ initialCart: undefined });

// const Store = React.createContext({
//   state: initialState({ initialCart: undefined }),
//   dispatch: defaultDispatch,
// });

// function StoreProvider(props: React.PropsWithChildren<{}>) {
//   const [state, dispatch] = React.useReducer<React.Reducer<AppState, Action>>(reducer, initialState({ initialCart: undefined }));

//   return <Store.Provider value={{ state, dispatch }} {...props} />;
// }

// export { Store, StoreProvider };
