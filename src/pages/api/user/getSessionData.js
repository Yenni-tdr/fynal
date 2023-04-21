import {idUserSchema} from "../../../const";

const bcrypt = require("bcryptjs");
import { prisma } from '../../../../db';

export default async function handler(req, res){


    if(req.method !== 'POST'){
        return res.status(405).json({message: 'Méthode non autorisée.'});
    }

    try {
        await idUserSchema.validate(req.body);
    }catch (error){
        return res.status(400).json({error, message: 'Erreur dans le formulaire'})
    }

    const {userId} = req.body;

    try{
        const status = 0
        const userData = await prisma.utilisateur.findUnique({
            where:{
                idUtilisateur: userId
            },
            include:{
                Adresse: true
            },
        });
        if(userData.idUtilisateur === 0){
            const status = 3;
        }
        else{
            const sellerStatus = await prisma.vendeur.findUnique({
                where: { idUtilisateur: userData.idUtilisateur },
            });
            const deliveryStatus = await prisma.livreur.findUnique({
                where: { idUtilisateur: userData.idUtilisateur },
            });
            if(sellerStatus){
                const status = 1;
            }
            else if(deliveryStatus){
                const status = 2;
            }

        }


        const user = {
            idUtilisateur: userData.idUtilisateur,
            nom: userData.nom,
            prenom: userData.prenom,
            email: userData.email,
            status: status,
            genre: userData.genre,
            dateNaissance: userData.dateNaissance,
            adresse: userData.Adresse,
        }

        return res.status(200).json(user);

    }catch (err){
        console.log(err);
        return res.status(500).json({err, message: 'Erreur lors de l\'enregistrement'});
    }


    return res.status(500).json({ message: 'Erreur lors de l\'enregistrement'});

}