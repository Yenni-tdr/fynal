import Link from "next/link";
import {useCookies} from "react-cookie";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

export default function AccountMenu(){

    // State / Props
    const [hasMounted, setHasMounted] = useState(false);

    const router = useRouter();
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const user = cookies['user']

    const removeCookieUser = () =>{
        removeCookie('user');
        router.replace('/');
        //router.push('/')
    }

    // Hooks
    useEffect(() => {
        setHasMounted(true);
    }, [])

    // Render
    if (!hasMounted) return null;

    if(!user){
        return (
            <>
                <li><Link href="/signin" className="justify-between">Connexion</Link></li>
                <li><Link href="/register">Inscription</Link></li>
            </>
        )
    }
    else if(user.status === 0){
        return (
            <>
                <li><Link href="/account" className="justify-between">Espace utilisateur</Link></li>
                <li><Link href="/" className="justify-between">Historique</Link></li>
                <li><button onClick={() => removeCookieUser()}>Deconnexion</button></li>
            </>
        )
    }
    else if(user.status === 1){
        return (
            <>
                <li><Link href="/account" className="justify-between">Espace utilisateur</Link></li>
                <li><Link href="/" className="justify-between">Dashboard Vendeur</Link></li>
                <li><button onClick={() => removeCookieUser()}>Deconnexion</button></li>
            </>
        )
    }
    else if(user.status === 2){
        return (
            <>
                <li><Link href="/account" className="justify-between">Espace utilisateur</Link></li>
                <li><Link href="/" className="justify-between">Dashboard Livreur</Link></li>
                <li><button onClick={() => removeCookieUser()}>Deconnexion</button></li>
            </>
        )
    }
    else if(user.status === 3){
        return (
            <>
                <li><Link href="/account" className="justify-between">Espace utilisateur</Link></li>
                <li><Link href="/" className="justify-between">Dashboard Admin</Link></li>
                <li><button onClick={() => removeCookieUser()}>Deconnexion</button></li>
            </>
        )
    }

    else{
        /*
        return (
            <>
                {user.status === 0 &&
                    <>
                        <li><Link href="" className="justify-between">Historique</Link></li>
                    </>
                }
                {user.status === 1 &&
                    <>
                        <li><Link href="/" className="justify-between">Dashboard Vendeur</Link></li>
                    </>
                }
                {user.status === 2 &&
                    <>
                        <li><Link href="/" className="justify-between">Dashboard Livreur</Link></li>
                    </>
                }
                {user.status === 3 &&
                    <>
                        <li><Link href="/" className="justify-between">Dashboard Admin</Link></li>
                    </>
                }
                <li><button onClick={() => removeCookieUser()}>Deconnexion</button></li>
            </>
        )

         */
    }

    /*
    return (
        <>
            {!user &&
                <>
                    <li><Link href="/signin" className="justify-between">Connexion</Link></li>
                    <li><Link href="/register">Inscription</Link></li>
                </>
            }
            {user &&
                <>
                    <li><Link href="/account" className="justify-between">Espace utilisateur</Link></li>
                    {user?.status === 0 &&
                        <>
                            <li><Link href="" className="justify-between">Historique</Link></li>
                        </>
                    }
                    {user?.status === 1 &&
                        <>
                            <li><Link href="/" className="justify-between">Dashboard Vendeur</Link></li>
                        </>
                    }
                    {user?.status === 2 &&
                        <>
                            <li><Link href="/" className="justify-between">Dashboard Livreur</Link></li>
                        </>
                    }
                    {user?.status === 3 &&
                        <>
                            <li><Link href="/" className="justify-between">Dashboard Admin</Link></li>
                        </>
                    }
                    <li><button onClick={() => removeCookieUser()}>Deconnexion</button></li>
                </>
            }


        </>
    )

     */
}