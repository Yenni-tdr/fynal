import {addressSchema} from "../../../const";

const bcrypt = require("bcryptjs");
import { prisma } from '../../../../db';

export default async function handler(req, res){


    if(req.method !== 'POST'){
        return res.status(405).json({message: 'Méthode non autorisée.'});
    }

    try {
        await addressSchema.validate(req.body);
    }catch (error){
        return res.status(400).json({error, message: 'Erreur dans le formulaire'})
    }

    const {userId, addressBody, addressAddition, postcode, city, country} = req.body;

    try{
        const changedUser = await prisma.utilisateur.update({
            where:{
                idUtilisateur: userId
            },
            include:{
                Adresse: true
            },
            data: {
                adresse: {
                    numeroNomRue: addressBody,
                    complement: addressAddition,
                    codePostal: postcode,
                    ville: city,
                    pays: country
                }
            }
        });

        return res.status(200).json({});

    }catch (err){
        console.log(err);
        return res.status(500).json({err, message: 'Erreur lors de l\'enregistrement'});
    }


    return res.status(500).json({ message: 'Erreur lors de l\'enregistrement'});

}