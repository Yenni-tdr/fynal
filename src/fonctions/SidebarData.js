// import React from "react";
// import * as GiIcons from 'react-icons/gi';
// import * as BsIcons from 'react-icons/bs';
// import * as RiIcons from 'react-icons/ri';

import { prisma } from '../../db';

export async function getCategorieIdData() {
  const categories = await prisma.categorie.findMany();

  const sidebarCategories = categories.map((categorie) => {
    return {
      title: categorie.libelle,
      path: "/categorie/".concat(categorie.idCategorie),
    };
  });

  return sidebarCategories;
}
