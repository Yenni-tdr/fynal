import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import * as FaIcons from 'react-icons/fa';

const prisma = new PrismaClient();

export async function getServerSideProps() {
    const produits = await prisma.produit.findMany({
        select: {
            nom: true,
            prix: true,
            idCategorie: true,
        },
    });

    return {
        props: { produits },
    };
}

function Categorie(props) {
    const router = useRouter();
    const { id } = router.query;

    switch(id){
        case '1' :
            return (
                <div>
                    <h1 className='text-center mt-8 font-semibold text-2xl italic'>High Tech</h1>
                    <div className="bg-white">
                        <div className="mx-auto max-w-2xl -mt-16 px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                {props.produits.map((produit) => {
                                    if(produit.idCategorie == "1") {
                                        return (
                                            <a key={produit.id} href={'/'} className="group">
                                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                                <img
                                                src={produit.imageSrc}
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
                                                <button id='addCart' className="bg-slate-200 hover:bg-slate-300 text-black  text-xl font-semibold py-2 px-4 mt-4 rounded shadow"
                                                        onClick={() => addToCart(produit)}> <FaIcons.FaCartPlus/>
                                                </button>
                                            </div>
                                            </a>
                                        );
                                    }else{
                                        return null;
                                    }
                            })}
                            </div>
                        </div>
                    </div>
                </div>
            );
        case '2' :
            return (
                <div>
                    <h1 className='text-center mt-8 font-semibold text-2xl italic'>Maison et déco</h1>
                    <div className="bg-white">
                        <div className="mx-auto max-w-2xl -mt-16 px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                {props.produits.map((produit) => {
                                    if(produit.idCategorie == "2") {
                                        return (
                                            <a key={produit.id} href={'/'} className="group">
                                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                                <img
                                                src={produit.imageSrc}
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
                                                <button id='addCart' className="bg-slate-200 hover:bg-slate-300 text-black  text-xl font-semibold py-2 px-4 mt-4 rounded shadow"
                                                        onClick={() => addToCart(produit)}> <FaIcons.FaCartPlus/>
                                                </button>
                                            </div>
                                            </a>
                                        );
                                    }else{
                                        return null;
                                    }
                            })}
                            </div>
                        </div>
                    </div>
                </div>
            );
        case '3' :
            return (
                <div>
                <h1 className='text-center mt-8 font-semibold text-2xl italic'>Electroménager</h1>
                    <div className="bg-white">
                        <div className="mx-auto max-w-2xl -mt-16 px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                {props.produits.map((produit) => {
                                    if(produit.idCategorie == "3") {
                                        return (
                                            <a key={produit.id} href={'/'} className="group">
                                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                                <img
                                                src={produit.imageSrc}
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
                                                <button id='addCart' className="bg-slate-200 hover:bg-slate-300 text-black  text-xl font-semibold py-2 px-4 mt-4 rounded shadow"
                                                        onClick={() => addToCart(produit)}> <FaIcons.FaCartPlus/>
                                                </button>
                                            </div>
                                            </a>
                                        );
                                    }else{
                                        return null;
                                    }
                            })}
                            </div>
                        </div>
                    </div>
                </div>
            );
    }
};

export default Categorie;