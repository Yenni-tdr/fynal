import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {addressSchema, profileSchema} from "../const";
import {useCookies} from "react-cookie";
import {useRouter} from "next/router";

const AccountBody = () => {

    const [cookies, setCookies] = useCookies(['user']);
    const router = useRouter();

    // Permet de revenir à l'accueil si l'on est pas connecté
    useEffect(()=>{
        if(!cookies['user']){
            router.push('/')
        }
    })

    // Fonction permettant d'obtenir un index
    function formatMonth(indexMonth) {
        return (indexMonth < 10) ? '0' + indexMonth.toString() : indexMonth.toString();
    }

    const [changeOnProfile, setChangeOnProfile] = useState(false);
    const [changeOnPassword, setChangeOnPassword] = useState(false);
    const [changeOnAddress, setChangeOnAddress] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    function birthDateString(date){
        const dateFormat = new Date(date)
        return dateFormat.getFullYear()  + "-" + formatMonth(dateFormat.getMonth()+1)+ "-" + dateFormat.getDate();
    }

    const birthDateDisplay = birthDateString(cookies?.user?.dateNaissance)

    const {register: registerProfile, handleSubmit: handleSubmitProfile, formState: {errors: errorsProfile}, reset: resetProfile} = useForm({
        resolver: yupResolver(profileSchema),
        mode: "onChange",
        defaultValues: {
            firstName:cookies?.user?.prenom,
            lastName:cookies?.user?.nom,
            email:cookies?.user?.email,
            birthDate:birthDateDisplay,
            sex:cookies?.user?.genre,
        }
    });

    const {register: registerAddress, handleSubmit: handleSubmitAddress, formState: {errors: errorsAddress}, reset: resetAddress} = useForm({
        resolver: yupResolver(addressSchema),
        mode: "onChange",
        defaultValues: {
            addressBody:cookies?.user?.adresse?.numeroNomRue,
            addressAddition: cookies?.user?.adresse?.complement,
            postcode:cookies?.user?.adresse?.codePostal,
            city:cookies?.user?.adresse?.ville,
            country:cookies?.user?.adresse?.pays,

        }
    });

    const {register: registerPassword, handleSubmit: handleSubmitPassword, formState: {errors: errorsPassword}, reset: resetPassword} = useForm({
        resolver: yupResolver(addressSchema),
        mode: "onChange",
    });

    const handleCancelProfile = () => {
        resetProfile();
        setChangeOnProfile(false);
    }

    const handleCancelAddress = () => {
        resetAddress();
        setChangeOnAddress(false);
    }

    const handleCancelPassword = () => {
        resetPassword();
        setChangeOnPassword(false);
    }

    const onSubmitProfile = async (data) => {
        setIsLoading(true);
        setError("");
        console.log("test1")
        try{
            const userIdObj = {userId: cookies?.user?.idUtilisateur}
            const birthDateObj = {birthDate: new Date(birthDateString(data.birthDate))};
            const sendData = {...userIdObj, ...data, ...birthDateObj}
            console.log(JSON.stringify(sendData));
            const response = await fetch('/api/user/updateProfile',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendData)
            });
            const result = await response.json();
            console.log("test2 :", result)
            if(response.ok){
                await router.reload();
            }else{
                setError(result.message);
            }
        }catch (err){
            console.error(err);
            setError("Une erreur est survenue. Réessayez plus tard s'il vous plait")
        }
        setIsLoading(false);
    }

    const onSubmitAddress = async (data) => {
        setIsLoading(true);
        setError("");
        console.log("test1")
        try{
            const userIdObj = {userId: cookies?.user?.idUtilisateur}
            const sendData = {...userIdObj, ...data}
            console.log(JSON.stringify(sendData));
            const response = await fetch('/api/user/updateAddress',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendData)
            });
            const result = await response.json();
            console.log("test2 :", result)
            if(response.ok){
                await router.reload();
            }else{
                setError(result.message);
            }
        }catch (err){
            console.error(err);
            setError("Une erreur est survenue. Réessayez plus tard s'il vous plait")
        }
        setIsLoading(false);
    }

    const onSubmitPassword = async (data) => {
        setIsLoading(true);
        setError("");
        console.log("test1")
        try{
            const userIdObj = {userId: cookies?.user?.idUtilisateur}
            const sendData = {...userIdObj, ...data}
            console.log(JSON.stringify(sendData));
            const response = await fetch('/api/user/updatePassword',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendData)
            });
            const result = await response.json();
            console.log("test2 :", result)
            if(response.ok){
                await router.reload();
            }else{
                setError(result.message);
            }
        }catch (err){
            console.error(err);
            setError("Une erreur est survenue. Réessayez plus tard s'il vous plait")
        }
        setIsLoading(false);
    }

    return (
        <div className="flex flex-col items-center flex-1">
            <h2>Espace utilisateur</h2>
            <section className="flex flex-col items-center flex-1 w-full bg-blue-50">
                <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="w-full flex flex-col items-center">
                    <div className="w-full flex justify-between">
                        <div className="mx-10">
                            <h3>Profil</h3>
                        </div>
                        <div className="">
                            {changeOnProfile &&
                                <>
                                    <input type="submit" value="Enregistrer"/>
                                    <button onClick={()=> handleCancelProfile()}>Annuler</button>
                                </>
                            }
                            {!changeOnProfile &&
                                <button onClick={()=> setChangeOnProfile(true)}>Modifier</button>
                            }
                        </div>
                    </div>
                    <table className="w-3/4 bg-red-300">
                        <tbody>
                            <tr className="w-full">
                                <td className="w-1/2"><label htmlFor="firstName" className="">Prénom</label></td>
                                <td className="w-1/2">
                                    <input {...registerProfile("firstName")} type="text" id="firstName" className={`peer ${!changeOnProfile ? "border-0" : errorsProfile.firstName ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required disabled={!changeOnProfile}/>
                                    <p className="error-form">
                                        {errorsProfile.firstName && <span>{errorsProfile.firstName.message}</span>}
                                    </p>
                                </td>
                            </tr>
                            <tr className="">
                                <td><label htmlFor="lastName">Nom</label></td>
                                <td>
                                    <input {...registerProfile("lastName")} type="text" id="lastName" className={`peer ${!changeOnProfile ? "border-0" : errorsProfile.lastName ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`}  required disabled={!changeOnProfile}/>
                                    <p className="error-form">
                                        {errorsProfile.lastName && <span>{errorsProfile.lastName.message}</span>}
                                    </p>
                                </td>
                            </tr>
                            <tr className="">
                                <td><label htmlFor="email">Adresse e-mail</label></td>
                                <td>
                                    <input {...registerProfile("email")} type="email" id="email" className={`peer ${!changeOnProfile ? "border-0" : errorsProfile.email ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required disabled={!changeOnProfile}/>
                                    <p className="error-form">
                                        {errorsProfile.email && <span>{errorsProfile.email.message}</span>}
                                    </p>
                                </td>
                            </tr>
                            <tr className="">
                                <td><label htmlFor="birthDate">Date de naissance</label></td>
                                <td>
                                    <input {...registerProfile("birthDate")} type="date" id="birthDate" className={`peer ${!changeOnProfile ? "border-0" : errorsProfile.birthDate ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} disabled={!changeOnProfile}/>
                                    <p className="error-form">
                                        {errorsProfile.birthDate && <span>{errorsProfile.birthDate.message}</span>}
                                    </p>
                                </td>
                            </tr>
                            <tr className="">
                                <td><p>Genre</p></td>
                                <td>
                                    {changeOnProfile &&
                                        <>
                                            <label>
                                                <input {...registerProfile("sex")} type="radio" name="sex" id="radio-man" value="Homme" className={`peer ${errorsProfile.sex ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} />
                                                Homme
                                            </label>
                                            <label>
                                                <input {...registerProfile("sex")} type="radio" name="sex" id="radioWoman" value="Femme" className={`peer ${errorsProfile.sex ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} />
                                                Femme
                                            </label>
                                            <label>
                                                <input {...registerProfile("sex")} type="radio" name="sex" id="radioOther" value="Autre" className={`peer ${errorsProfile.sex ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} />
                                                Autre
                                            </label>
                                            <p className="error-form">
                                                {errorsProfile.sex && <span>{errorsProfile.sex.message}</span>}
                                            </p>
                                        </>
                                    }
                                    {!changeOnProfile &&
                                        <p>{cookies?.user?.genre}</p>
                                    }
                                </td>
                            </tr>
                        </tbody>

                    </table>


                </form>
            </section>
            <section>
                <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                    {!changeOnPassword &&
                        <div>
                            <button onClick={()=> setChangeOnPassword(true)}>Changer le mot de passe</button>
                        </div>
                    }
                    {changeOnPassword &&
                        <>
                            <div>
                                <input type="submit" value="Enregistrer"/>
                                <button onClick={()=> handleCancelPassword()}>Annuler</button>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="actualPassword">Mot de passe</label>
                                    <input {...registerPassword("actualPassword")} type="password" id="actualPassword" className={`peer ${errorsPassword.actualPassword ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                                    <p className="error-form">
                                        {errorsPassword.actualPassword && errorsPassword.actualPassword.message}
                                    </p>
                                </div>
                                <div>
                                    <label htmlFor="password">Mot de passe</label>
                                    <input {...registerPassword("password")} type="password" id="password" className={`peer ${errorsPassword.password ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                                    <p className="error-form">
                                        {errorsPassword.password && errorsPassword.password.message}
                                    </p>
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword">Confirmation du mot de passe *</label>
                                    <input {...registerPassword("confirmPassword")} type="password" id="confirmPassword" className={`peer ${errorsPassword.confirmPassword ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                                    <p className="error-form">
                                        {errorsPassword.confirmPassword && <span>{errorsPassword.confirmPassword.message}</span>}
                                    </p>
                                </div>
                            </div>
                        </>
                    }
                </form>
            </section>
            <section className="flex flex-col items-center flex-1 w-full bg-blue-50">
                <form onSubmit={handleSubmitAddress(onSubmitAddress)} className="w-full flex flex-col items-center">
                    <div className="w-full flex flex-row justify-between">
                        <div>

                        </div>
                        <h3>Adresse</h3>
                        <div>
                            {changeOnAddress &&
                                <>
                                    <input type="submit" value="Enregistrer"/>
                                    <button onClick={()=> handleCancelAddress()}>Annuler</button>
                                </>
                            }
                            {!changeOnAddress &&
                                <button onClick={()=> setChangeOnAddress(true)}>Modifier</button>
                            }
                        </div>
                    </div>
                    <table className="w-2/3 bg-red-300">
                        <tbody>
                            <tr className="w-full">
                                <td className="w-1/2"><label htmlFor="addressBody" className="">Corps de l'adresse</label></td>
                                <td className="w-1/2">
                                <input {...registerAddress("addressBody")} type="textarea" id="addressBody" className={`peer ${!changeOnAddress ? "border-0" : errorsAddress.addressBody ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required disabled={!changeOnAddress}/>
                                    <p className="error-form">
                                        {errorsAddress.addressBody && <span>{errorsAddress.addressBody.message}</span>}
                                    </p>
                                </td>
                            </tr>
                            <tr className="">
                                <td><label htmlFor="addressAddition">Complément</label></td>
                                <td>
                                    <input {...registerAddress("addressAddition")} type="text" id="addressAddition" className={`peer ${!changeOnAddress ? "border-0" : errorsAddress.addressAddition ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`}  required disabled={!changeOnAddress}/>
                                    <p className="error-form">
                                        {errorsAddress.addressAddition && <span>{errorsAddress.addressAddition.message}</span>}
                                    </p>
                                </td>
                            </tr>
                            <tr className="">
                                <td><label htmlFor="postcode">Code postal</label></td>
                                <td>
                                    <input {...registerAddress("postcode")} type="number" id="postcode" className={`peer ${!changeOnAddress ? "border-0" : errorsAddress.postcode ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required disabled={!changeOnAddress}/>
                                    <p className="error-form">
                                        {errorsAddress.postcode && <span>{errorsAddress.postcode.message}</span>}
                                    </p>
                                </td>
                            </tr>
                            <tr className="">
                                <td><label htmlFor="city">Ville</label></td>
                                <td>
                                    <input {...registerAddress("city")} type="text" id="city" className={`peer ${!changeOnAddress ? "border-0" : errorsAddress.city ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} disabled={!changeOnAddress}/>
                                    <p className="error-form">
                                        {errorsAddress.city && <span>{errorsAddress.city.message}</span>}
                                    </p>
                                </td>
                            </tr>
                            <tr className="">
                                <td><label htmlFor="country">Pays</label></td>
                                <td>
                                    <input {...registerAddress("country")} type="text" id="country" className={`peer ${!changeOnAddress ? "border-0" : errorsAddress.country ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} disabled={!changeOnAddress}/>
                                    <p className="error-form">
                                        {errorsAddress.country && <span>{errorsAddress.country.message}</span>}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </section>
        </div>
    )
}

export default AccountBody;
