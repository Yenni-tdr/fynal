import { getProductsData } from '../fonctions/search';
import { getCategorieIdData } from '../fonctions/SidebarData';
import * as FaIcons from 'react-icons/fa';

export async function getServerSideProps(context) {
    console.log(context.query.q);   
    const catData = await getProductsData(context.query.q);
    const categoriesSideMenu = await getCategorieIdData();

    console.log(catData[0]);
    // catData.produits.forEach(produit => {
    //     console.log(produit.nom);
    // });
    
    return {
        props: {
            catData,
            categoriesSideMenu,
        },
    };
}

export default function Categorie({ catData, categoriesSideMenu }) {
    return (
        <div>
            {catData.produits.length === 0 ? (
                <div className="flex justify-center mt-24 h-screen">
                <p className="text-2xl text-gray-500">Aucun résultat trouvé</p>
                </div>
            ) : (
            <div className="bg-white">
                <div className="mx-auto max-w-2xl -mt-16 px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {catData.produits.map((produit) => {
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
                                <div className='flex flex-row justify-between'>
                                    <div>
                                        <h3 className="mt-4 text-sm text-gray-700">{produit.nom}</h3>
                                        <p className="mt-1 text-lg font-medium text-gray-900">{produit.prix}</p>
                                    </div>
                                    <button id='addCart' className="bg-slate-200 hover:bg-slate-300 text-black text-xl font-semibold py-2 px-4 mt-4 mr-2 rounded shadow"
                                            onClick={() => addToCart(produit)}> <FaIcons.FaCartPlus/>
                                    </button>
                                </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
            )}
        </div>          
    );
}