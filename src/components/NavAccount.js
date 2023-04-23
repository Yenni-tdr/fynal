import Link from "next/link";
import {useRouter} from "next/router";

export default function NavAccount(){
    const router = useRouter();
    const {pathname} = router;
    return (
        <nav className="fixed">
            <ul className="flex flex-col m-3">
                <li className={`${pathname === "/account" ? "underline" : ""} text-xl`}><Link href="/account">Espace utilisateur</Link></li>
                <li className={`${pathname === "/history" ? "underline" : ""} text-xl`}><Link href="/history">Historique</Link></li>
                <li className={`${pathname === "/" ? "underline" : ""} text-xl`}><Link href="/">Contrats</Link></li>
            </ul>
        </nav>
    )
}