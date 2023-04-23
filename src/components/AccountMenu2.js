import Link from "next/link";
import {useCookies} from "react-cookie";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

export default function AccountMenu(){

    const [hasMounted, setHasMounted] = useState(false);
    const [cookies] = useCookies(['user']);
    const user = cookies['user']

    // Hooks
    useEffect(() => {
        setHasMounted(true);
    }, [])

    // Render
    if (!hasMounted) return null;

    if(user.idUtilisateur === 0){
        return (
            <>
                    <li><Link href="/manageCategory" className="justify-between">Gestion des catégories</Link></li>
                    <li><Link href="/addProduct" className="justify-between">Ajouter un produit</Link></li>
                    <li><Link href="/contractAdmin" className="justify-between">Contrat</Link></li>
                
            </>
        )
    }
    else if(user.idUtilisateur === 1){
        return (
            <>
                <li><Link href="/addProduct" className="justify-between">Ajouter un produit</Link></li>
                <li><Link href="/Stats" className="justify-between">Statistiques</Link></li>
              
            </>
        )
    }
    else if(user.idUtilisateur === 2){
        return (
            <>
                <li><Link href="/Delivery" className="justify-between">Gestion des livraisons</Link></li>
             
            </>
        )
    }
    
}