import { prisma } from '../../db';

/*
* Cette fonction permet de récupérer les informations sur les catégories dans la BDD et ensuite générer le lien permettant d'y accéder.
* Cette fonction est utilisé pour afficher les catégories dans le menu ouvrable à gauche.
* 
* Valeur de retour : tableau contenant le nom des catégories ainsi que le lien permettant d'y accéder.
*/
export async function getCategorieIdData() {
    const categories = await prisma.categorie.findMany();

    // categories.map((categorie) => {
    //     console.log(categorie);
    // });

    const sidebarCategories = categories.map((categorie) => {
        return({
            title: categorie.libelle,
            path: '/categorie/'.concat(categorie.idCategorie),
        })
    });

    return sidebarCategories;
}

// export async function getStaticProps() {
//     const catIdData = await getCategorieIdData();

//     return {
//         props: {
//             catIdData,
//         },
//     };
// }

// const SidebarData = "test";

// export const SidebarData = categories.map((categorie) => {
//     return({
//         title: categorie.libelle,
//         path: '/categorie/'.concat(categorie.idCategorie),
//     });
// });

// export const SidebarData = [
    
//     {
//         title: 'High-Tech',
//         path: '/categorie/1',
//         // icon: <BsIcons.BsFillLaptopFill/>,
//         // iconClosed : <RiIcons.RiArrowDownSFill/>,
//         // iconOpened : <RiIcons.RiArrowUpSFill />,
        
//     },
//     {
//         title: 'Meuble et déco',
//         path: '/categorie/2',
//         // icon: <GiIcons.GiSofa/>,
//         // iconClosed : <RiIcons.RiArrowDownSFill/>,
//         // iconOpened : <RiIcons.RiArrowUpSFill />,
//     },
//     {
//         title: 'Electroménager',
//         path: '/categorie/3',
//         // icon: <GiIcons.GiWashingMachine/>,
//         // iconClosed : <RiIcons.RiArrowDownSFill/>,
//         // iconOpened : <RiIcons.RiArrowUpSFill />,
//     }


// ]

// export default SidebarData

}
