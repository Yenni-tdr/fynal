// import React from "react";
// import * as GiIcons from 'react-icons/gi';
// import * as BsIcons from 'react-icons/bs';
// import * as RiIcons from 'react-icons/ri';
import { prisma } from '../../db';

// export async function getCategorieIdData() {
//     const categories = await prisma.categorie.findMany();

//     // categories.map((categorie) => {
//     //     console.log(categorie);
//     // });

//     const sidebarCategories = categories.map((categorie) => {
//         return({
//             title: categorie.libelle,
//             path: '/categorie/'.concat(categorie.idCategorie),
//         })
//     });

//     return sidebarCategories;
// }

export default function handler(req, res) {
    // const categories = await prisma.categorie.findMany();

    // // categories.map((categorie) => {
    // //     console.log(categorie);
    // // });

    // const sidebarCategories = categories.map((categorie) => {
    //     return({
    //         title: categorie.libelle,
    //         path: '/categorie/'.concat(categorie.idCategorie),
    //     })
    // });

    // res.status(200).json(sidebarCategories)
    res.status(200).json("test")
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