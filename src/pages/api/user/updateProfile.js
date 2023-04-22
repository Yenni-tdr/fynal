import {profileSchema} from "../../../const";

const bcrypt = require("bcryptjs");
import { prisma } from '../../../../db';

export default async function handler(req, res){


    if(req.method !== 'POST'){
        return res.status(405).json({message: 'Méthode non autorisée.'});
    }

    try {
        await profileSchema.validate(req.body);
    }catch (error){
        return res.status(400).json({error, message: 'Erreur dans le formulaire'})
    }

    const {userId, firstName, lastName, email, birthDate, sex} = req.body;

    /*
    const hashedPassword = bcrypt.hash(password, saltRounds, function (err, hash) {
        if(err){
            return res.status(500).json({error, message: 'Erreur lors du hashage du mot de passe'})
        }
        return hash
    });

    console.log(password +" " + hashedPassword)
     */
    try{
        const changedUser = await prisma.utilisateur.update({
            where:{
                idUtilisateur: userId
            },
            data: {
                nom: lastName,
                prenom: firstName,
                email: email,
                dateNaissance: birthDate,
                genre: sex
            }
        });

        return res.status(200).json({});

    }catch (err){
        console.log(err);
        return res.status(500).json({err, message: 'Erreur lors de l\'enregistrement'});
    }


    return res.status(500).json({ message: 'Erreur lors de l\'enregistrement'});

}