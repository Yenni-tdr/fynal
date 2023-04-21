import {signInSchema, saltRounds} from "../../../const";
const bcrypt = require("bcryptjs");
import { prisma } from '../../../../db';


export default async function handler(req, res){
    //return res.status(402).json({message: 'Test'});

    if(req.method !== 'POST'){
        return res.status(405).json({message: 'Méthode non autorisée.'});
    }

    try {
        await signInSchema.validate(req.body);
    }catch (error){
        return res.status(400).json({error, message: 'Erreur dans le formulaire'})
    }

    const {email, password} = req.body;

    const existingUser = await prisma.utilisateur.findUnique({
        where: { email },
        include: {Adresse: true}
    });

    if(!existingUser){
        return res.status(409).json({message: 'L\'email ou le mot de passe est faux.'})
    }

    console.log(existingUser);


    const isValidPassword = await bcrypt
        .compare(password, existingUser.motDePasse)
        .catch(err => console.error(err.message))


    if (!isValidPassword) {
        return res.status(409).json({ message: 'L\'email ou le mot de passe est invalide.' });
    }


    const status = 0;

    if(existingUser.idUtilisateur === 0){
        const status = 2;
    }
    else{
        try{
            const sellerStatus = await prisma.vendeur.findUnique({
                where: { idUtilisateur: existingUser.idUtilisateur },
            });
            if(sellerStatus){
                const status = 1;
            }
        }catch (err){
            console.log(err)
            return res.status(400).json({message: 'Erreur lors de la requête à la base de données'});
        }

    }


    const user = {
        idUtilisateur: existingUser.idUtilisateur,
        nom: existingUser.nom,
        prenom: existingUser.prenom,
        email: existingUser.email,
        status: status,
        genre: existingUser.genre,
        dateNaissance: existingUser.dateNaissance,
        adresse: existingUser.Adresse,
    }

    return res.status(200).json(user);

}