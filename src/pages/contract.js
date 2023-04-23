import NavAccount from "../components/NavAccount";
import ContractBody from "../components/ContractBody";
import {useCookies} from "react-cookie";
import ContractAdminBody from "../components/ContractAdminBody";
import {useEffect, useState} from "react";

const Contract = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const [cookies] = useCookies(['user']);
    useEffect(() => {
        setHasMounted(true);
    }, [])

    // Render
    if (!hasMounted) return null;
    return (
        <main className="flex flex-1">
            <NavAccount />
            {cookies?.user?.status === 3 ? <ContractAdminBody/> : <ContractBody/>}
        </main>
    );
};

export default Contract;