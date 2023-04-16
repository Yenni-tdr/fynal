import { getAllCategoriesID, getCategorieProductsData } from '../../fonctions/categorie';
import { getCategorieIdData } from '../../fonctions/SidebarData';

export async function getStaticPaths() {
    const paths = await getAllCategoriesID();
    // const paths = await dbCategoriesID();
    // console.log(paths);
    
    return {
        paths,
        fallback: false,
    }
}

// voir pour utiliser getServerSideProps
export async function getStaticProps({ params }) {
    const catData = await getCategorieProductsData(params.id);
    const categoriesSideMenu = await getCategorieIdData();

    // console.log(catData[0]);
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

export default function Categorie({ catData }) {
    return (
        <div>
            <h1 className='text-center mt-8 font-semibold text-3xl italic'>{ catData[0].libelle }</h1>
            <h2 className='text-center mt-8 font-semibold text-xl italic'>{ catData[0].description }</h2>
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
                                <div className='flex flex-row space-x-44'>
                                    <div>
                                        <h3 className="mt-4 text-sm text-gray-700">{produit.nom}</h3>
                                        <p className="mt-1 text-lg font-medium text-gray-900">{produit.prix}</p>
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