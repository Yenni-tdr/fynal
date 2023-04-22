import { useState } from "react";
import { useRouter } from "next/router";
import { getCategorieIdData } from "../fonctions/SidebarData";
import { ErrorDiv } from "../components/ErrorDiv";

export async function getStaticProps() {
    const categoriesSideMenu = await getCategorieIdData();
    
    return {
        props: {
            categoriesSideMenu: categoriesSideMenu,
        },
    };
}

const errorsDefault = {
    libelle: false,
    description: false,
}

export default function AddCategory() {

    const [errors, setErrors] = useState(errorsDefault);
    const [buttonState, setButtonState] = useState(false);

    const router = useRouter();

    const handleSubmit = async (event) => {
        setButtonState(true);
        event.preventDefault();

        const data = {
            libelle: event.target.libelle.value,
            description: event.target.description.value,
        };

        const JSONdata = JSON.stringify(data);

        const endpoint = '/api/addCategoryToDB';

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONdata
        };

        const response = await fetch(endpoint, options);
        const result = await response.json();

        if(result.data === "ok") router.push('/successAddCategory');
        else {
            setButtonState(false);
            setErrors(result.data);
        }
        
    }

    const formFields = [
        { labelString: "Libellé* :", id: "libelle" },
        { labelString: "Description* :", id: "description" },
    ]

    return(
        <div>
            <h1 className='text-center mt-8 font-semibold text-3xl italic'>Ajouter une categorie</h1>
            <h2 className='block text-gray-500 font-bold mt-5 ml-5 md:mb-0 pr-4'>Pour ajouter une catégorie, remplissez les champs suivants et appuyez sur le bouton en fin de page pour confirmer. Les champs avec une étoile doivent être obligatoirement remplis.</h2>
            <div className="flex items-center justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-sm mt-5">
                    { formFields.map((formField) => {
                        return (
                            <div key={formField.id} className="mb-6">
                                <div className="md:flex md:items-center">
                                    <div className="md:w-1/3">
                                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor={formField.id}>{formField.labelString}</label>
                                    </div>
                                    <div className="md:w-2/3">
                                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" id={formField.id}></input>
                                    </div>
                                </div>
                                <ErrorDiv condition={errors[formField.id.toString()].toString()}>Ce champs n'est pas valide.</ErrorDiv>
                            </div>
                        );
                    }) }
                    <div className="md:flex md:items-center mb-20">
                        <div className="md:w-1/3"></div>
                        <div className="md:w-2/3">
                            <button type="submit" disabled={buttonState} className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">Ajouter</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}