import Link from "next/link";

export const ProductCard = ({ produit, cart, handleNewCartData }) => {
    return (
        <div className='group'>
            <Link
                href={`/products/${produit.idProduit}`}
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
    )
}