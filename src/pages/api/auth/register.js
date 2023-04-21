import * as Yup from "yup";
import {registerSchema, saltRounds} from "../../../const";

const bcrypt = require("bcryptjs");
import { prisma } from '../../../../db';

export default async function handler(req, res){


    if(req.method !== 'POST'){
        return res.status(405).json({message: 'Méthode non autorisée.'});
    }

    try {
        await registerSchema.validate(req.body);
    }catch (error){
        return res.status(400).json({error, message: 'Erreur dans le formulaire'})
    }

    const {firstName, lastName, email, password, confirmPassword} = req.body;

    const existingUser = await prisma.utilisateur.findUnique({
        where: { email },
    });

    if(existingUser){
        return res.status(409).json({message: 'Un utilisateur avec cet email existe déjà.'})
    }

    /*
    const hashedPassword = bcrypt.hash(password, saltRounds, function (err, hash) {
        if(err){
            return res.status(500).json({error, message: 'Erreur lors du hashage du mot de passe'})
        }
        return hash
    });

    console.log(password +" " + hashedPassword)
     */

    const hashedPassword = await bcrypt
        .hash(password, saltRounds)
        .catch(err => console.error(err.message))

    console.log(password +" " + hashedPassword)

    const newUser = await prisma.utilisateur.create({
        data: {
            nom: lastName,
            prenom: firstName,
            email: email,
            motDePasse: hashedPassword,
        }
    });

    return res.status(200).json({message: 'Succès de l\'enregistrement'});

}