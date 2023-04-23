import { useCookies } from "react-cookie";
import { prisma } from "../../db";
import { getCategorieIdData } from "../fonctions/SidebarData";

export async function getStaticProps() {
    const categoriesSideMenu = await getCategorieIdData();
    const categories = await prisma.categorie.findMany();

    return {
        props: {
            categories : categories,
            categoriesSideMenu: categoriesSideMenu,
        }
    }
}
  
export default function ModifCategoryHome({ categories }) {
    
    const [cookies] = useCookies(['user']);

    return (
        <div className="flex flex-col gap-2 mt-5">
            { categories.map((categorie) => {
                return (
                    <div className="flex rounded-lg">
                        <div className="md:w-1/5 invisible"></div>
                        <div className="flex md:w-3/5 border-5 bg-slate-200 rounded-lg">
                            <div className="align-middle">{categorie.libelle}</div>
                            <a href={["/modifCategory/", categorie.idCategorie].join('')} className="text-normal px-3 py-2 ml-auto text-white  bg-stone-800 hover:bg-stone-950 rounded-lg transition ease-in duration-200 focus:outline-none">Modifier</a>
                        </div>
                        <div className="md:w-1/5 invisible"></div>
                    </div>
                )
            }) }
        </div>
    )
}