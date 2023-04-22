import {passwordSchema, saltRounds} from "../../../const";

const bcrypt = require("bcryptjs");
import { prisma } from '../../../../db';

export default async function handler(req, res){


    if(req.method !== 'POST'){
        return res.status(405).json({message: 'Méthode non autorisée.'});
    }

    try {
        await passwordSchema.validate(req.body);
    }catch (error){
        return res.status(400).json({error, message: 'Erreur dans le formulaire'})
    }

    const {userId, actualPassword, password, confirmPassword} = req.body;

    try{
        const existingUser = await prisma.utilisateur.findUnique({
            where:{
                idUtilisateur: userId
            },
        });

        const isValidPassword = await bcrypt
            .compare(actualPassword, existingUser.motDePasse)
            .catch(err => console.error(err.message))


        if (!isValidPassword) {
            return res.status(409).json({ message: 'Le mot de passe est invalide.' });
        }

        const hashedPassword = await bcrypt
            .hash(password, saltRounds)
            .catch(err => console.error(err.message))

        const changedUser = await prisma.utilisateur.update({
            where:{
                idUtilisateur: userId
            },
            data: {
                motDePasse: hashedPassword,
            }
        });

        return res.status(200).json({});

    }catch (err){
        console.log(err);
        return res.status(500).json({err, message: 'Erreur lors de l\'enregistrement'});
    }


    return res.status(500).json({ message: 'Erreur lors de l\'enregistrement'});

}