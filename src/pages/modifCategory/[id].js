import { prisma } from "../../../db";
import { useState } from "react";
import { useRouter } from "next/router";
import { getAllCategoriesID } from "../../fonctions/categorie";
import { getCategorieIdData } from "../../fonctions/SidebarData";
import { CategoryForm } from "../../components/categoryForm";

export async function getStaticPaths() {
    const paths = await getAllCategoriesID();
    
    return {
        paths,
        fallback: false,
    }
}

export async function getStaticProps({ params }) {
    const catData = await prisma.categorie.findMany({
        where: {
            idCategorie: parseInt(params.id),
        }
    });
    const categoriesSideMenu = await getCategorieIdData();
    
    return {
        props: {
            catData: catData,
            categoriesSideMenu: categoriesSideMenu,
        },
    };
}

const errorsDefault = {
    libelle: false,
    description: false,
}

export default function ModifCategory({ catData }) {

    const [errors, setErrors] = useState(errorsDefault);
    const [buttonState, setButtonState] = useState(false);

    const router = useRouter();

    const handleSubmit = async (event) => {
        setButtonState(true);
        event.preventDefault();

        const data = {
            libelle: event.target.libelle.value,
            description: event.target.description.value,
            idCategorie : catData[0].idCategorie,
        };

        const JSONdata = JSON.stringify(data);

        const endpoint = '/api/modif/modifCategory';

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONdata
        };

        const response = await fetch(endpoint, options);
        const result = await response.json();

        if(result.data === "ok") router.push('/manageCategory');
        else {
            setButtonState(false);
            setErrors(result.data);
        }
        
    }

    return (
        <div>
            <CategoryForm handleSubmit={handleSubmit} buttonState={buttonState} errors={errors} type={1}></CategoryForm>
        </div>
    )
}