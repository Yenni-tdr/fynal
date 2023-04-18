import React, {useState} from "react";
import {useRouter} from "next/router";
import { useCart } from "../fonctions/CartContext";
import * as FaIcons from 'react-icons/fa';
import Sidebar from './Sidebar';
import Link from "next/link";
import confetti from 'canvas-confetti';

export default function Nav({ childrenProps }) {

    // console.log(childrenProps);

    const [sidebar, setSidebar] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { cartItems, cartTotal } = useCart();
    const router = useRouter();

    const handleSubmit = (event) => {
        event.preventDefault()
        router.push(`/search?q=${searchTerm}`)
    }

    const handleChange = (event) => {
        setSearchTerm(event.target.value)
    }

    const handleSidebarClick = () =>{
        setSidebar(!sidebar);
    }

    function generateConfetti() {
        confetti({
          particleCount: 400,
          spread: 360,
          origin: {
            y: 0.05
          }
        });
      }

    function handleClick() {
        generateConfetti();
    }
    

    return (
    <> 
        <header className="sticky z-40 top-0"> 
            <div className="navbar bg-slate-200">
                <div className="navbar-start">
                </div>  
                <div className="navbar-center" onClick={handleClick}>
                    <Link legacyBehavior href="/">
                        <a className="btn btn-ghost normal-case text-3xl font-bold">fynal</a>
                    </Link>
                </div>
                <div className="navbar-end">
                    <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <div className="indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <span className="badge badge-sm indicator-item">{cartItems.length}</span>
                        </div>
                    </label>
                    <div tabIndex={0} className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow">
                        <div className="card-body">
                        <span className="font-bold text-lg">{cartItems.length} Articles</span>
                        <span className="text-info">Total : {cartTotal} €</span>
                        <div className="card-actions">
                            <Link href="/Cart" ><button className="btn btn-primary btn-block">Voir panier</button></Link>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-8 rounded-full">
                        <img src="/images/user.svg" alt="user"/>
                        </div>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a className="justify-between">Connexion</a></li>
                        <li><a>Inscription</a></li>
                    </ul>
                    </div>  
                </div>  
            </div>
            <div className="py-2 pl-6 bg-stone-900 text-white flex h-10 justify-between">
                <button className="flex space-x-2" onClick={handleSidebarClick}>
                    <FaIcons.FaBars className="mt-1"/><span>Catégories</span>
                </button>
                <div className="flex items-center mr-24">
                    <form onSubmit={handleSubmit}>
                        <label className="sr-only" htmlFor="search"> Rechercher </label>
                        <input
                            className="h-8 w-full rounded-full border-none bg-white pe-10 ps-4 text-sm shadow-sm sm:w-56 text-black"
                            id="search"
                            type="search"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={handleChange}
                        />
                        <button type="submit"
                            className="-translate-x-9 translate-y-0.5 -mt-1 rounded-full bg-gray-50 p-2 text-gray-600 transition hover:text-gray-700"
                        >
                            <span className="sr-only">Rechercher</span>
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                            </svg>
                        </button>
                    </form>
                </div>
                <div></div>
            </div>
        </header>
        {sidebar && <Sidebar sidebarState={sidebar} childrenProps={childrenProps} onClose={() => setSidebar(false)}/>}
        </>
        )
}
