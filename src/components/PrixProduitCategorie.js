import { prixReductionArrondi } from "../fonctions/prixReductionArrondi"

export const PrixProduitCategorie = ({ prix, reduction }) => {
    if(reduction > 0) {
        return (
            <div>
                <div className="flex gap-1">
                    <p className="mt-1 text-lg font-medium text-gray-400 line-through">
                        {prix} €
                    </p>
                    <p className="mt-1 text-lg font-bold text-red-600"> 
                        -{reduction}%
                    </p>
                </div>
                <p className="mt-1 text-lg font-medium text-gray-900">
                    {prixReductionArrondi(prix, reduction)} €
                </p>
            </div>
        )
    } else {
        return (
            <div>
                <p className="mt-1 mb-8 text-lg font-medium text-gray-900">
                    {prix} €
                </p>
            </div>
        )
    }
}