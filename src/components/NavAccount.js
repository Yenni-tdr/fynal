import Link from "next/link";
import {useRouter} from "next/router";

export default function NavAccount(){
    const router = useRouter();
    const {pathname} = router;
    return (
        <nav className="">
            <ul className="flex flex-col m-3">
                <li className={`${pathname === "/account" ? "underline" : ""} text-xl`}><Link href="/account">Espace utilisateur</Link></li>
                <li className={`${pathname === "/register" ? "underline" : ""} text-xl`}><Link href="/register">Historique</Link></li>
                <li className={`${pathname === "/register" ? "underline" : ""} text-xl`}><Link href="/register">Contrats</Link></li>

            </ul>
        </nav>
    )
}