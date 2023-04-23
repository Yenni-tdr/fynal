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

    const {contractId, userId} = req.body;

    try {
        const contract = await prisma.contrat.update({
            where: {
                idContrat: contractId
            },
            data:{
                etat: 1
            },
            include:{
                ContratVendeur: true,
                ContratLivreur: true,
            }
        })

        if(contract.ContratVendeur !== null){
            const vendeur = await prisma.vendeur.update({
                where: {
                    idUtilisateur: contract.idUtilisateur
                },
                data:{
                    valid: true
                }
            })
        }
        else if(contract.ContratLivreur !== null){
            const livreur = await prisma.livreur.update({
                where: {
                    idUtilisateur: contract.idUtilisateur
                },
                data:{
                    valid: true
                }
            })
        }
        console.log(contract)
        return res.status(200).json({message: ""})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Une erreur est survenue"})
    }
}