import React, {useState} from "react";
import * as FaIcons from 'react-icons/fa';
import Sidebar from './Sidebar';
import Link from "next/link";
import confetti from 'canvas-confetti';

export default function Nav({ childrenProps }) {

    // console.log(childrenProps);

    const [sidebar, setSidebar] = useState(false);

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
        <header className="sticky z-50 top-0"> 
            <div className="navbar bg-slate-200">
                <div className="navbar-start"></div>  
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
                                <span className="badge badge-sm indicator-item">8</span>
                            </div>
                        </label>
                        <div tabIndex={0} className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow">
                            <div className="card-body">
                                <span className="font-bold text-lg">8 Articles</span>
                                <span className="text-info">Total: 999€</span>
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
                            <li><Link href="/signin" className="justify-between">Connexion</Link></li>
                            <li><Link href="/register">Inscription</Link></li>
                        </ul>
                    </div>  
                </div>  
            </div>
            <div className="py-2 pl-6 bg-stone-900 text-white">
                <button className="flex space-x-2" onClick={handleSidebarClick}>
                    <FaIcons.FaBars className="mt-1"/><span>Catégories</span>
                </button>
            </div>
        </header>
        {sidebar && <Sidebar sidebarState={sidebar} childrenProps={childrenProps} onClose={() => setSidebar(false)}/>}
        </>
        )
}
