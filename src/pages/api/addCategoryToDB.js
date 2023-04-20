import { prisma } from "../../../db";
import verifCategory from "../../fonctions/verifCategory";

export default async function handler(req, res) {
    let categorie = req.body;

    console.log(categorie);

    const errors = verifCategory(categorie);

    if(Object.values(errors).includes(true)) res.status(200).json({ data: errors });
    else {
        const categorieAjoutee = await prisma.categorie.create({
            data: {
                libelle: categorie.libelle,
                description: categorie.description,
            }
        });
        res.status(200).json({ data: "ok" });
    }
}