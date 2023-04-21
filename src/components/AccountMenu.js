import Link from "next/link";
import {useCookies} from "react-cookie";
import {useRouter} from "next/router";

export default function AccountMenu(){
    const router = useRouter();
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const user = cookies['user']

    const removeCookieUser = () =>{
        removeCookie('user');
        router.replace('/');
        //router.push('/')
    }

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
}