import {prisma} from "../../../../db";
import {idUserSchema} from "../../../const";

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

    try {
        const contract = await prisma.contrat.updateMany({
            where: {
                idUtilisateur: userId,
                etat: 1
            },
            data:{
                etat: 2
            }
        })
        console.log(contract)
        return res.status(200).json({message: ""})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Une erreur est survenue"})
    }
}