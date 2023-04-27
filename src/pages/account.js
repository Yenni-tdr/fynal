import NavAccount from '../components/NavAccount'
import AccountBody from "../components/AccountBody";

export default function AccountPage(){
    return (
        <main className="flex max-sm:flex-col flex-1">
            <NavAccount />
            <AccountBody />
        </main>
    )
}