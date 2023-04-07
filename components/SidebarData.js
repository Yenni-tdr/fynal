import React from "react";
import * as GiIcons from 'react-icons/gi'
import * as BsIcons from 'react-icons/bs'
import * as RiIcons from 'react-icons/ri'

export const SidebarData = [
    
    {
        title: 'High-Tech',
        path: '/Categorie/1',
        icon: <BsIcons.BsFillLaptopFill/>,
        iconClosed : <RiIcons.RiArrowDownSFill/>,
        iconOpened : <RiIcons.RiArrowUpSFill />,
        
    },
    {
        title: 'Meuble et déco',
        path: '/Categorie/2',
        icon: <GiIcons.GiSofa/>,
        iconClosed : <RiIcons.RiArrowDownSFill/>,
        iconOpened : <RiIcons.RiArrowUpSFill />,
    },
    {
        title: 'Electroménager',
        path: '/Categorie/3',
        icon: <GiIcons.GiWashingMachine/>,
        iconClosed : <RiIcons.RiArrowDownSFill/>,
        iconOpened : <RiIcons.RiArrowUpSFill />,
    }


]

export default SidebarData