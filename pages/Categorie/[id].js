import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getServerSideProps() {
    const produits = await prisma.Produit.findMany();

    return {
        props: { produits },
    };
}


function Categorie(props) {
    const router = useRouter();
    const { id } = router.query;

    switch(id){
        case '1' :
            return (
                <div>
                <p>High Tech</p>
                {props.produits.map((produit) => (
                    <div key={produit.id}>
                    <h3>{produit.name}</h3>
                    <p>{produit.description}</p>
                    <p>{produit.price}</p>
                    </div>
                ))}
                </div>
            );
        case '2' :
            return (
                <div>
                <p>Maison et déco</p>
                </div>
            );
        case '3' :
            return (
                <div>
                <p>Electroménager</p>
                </div>
            );
    }
};

export default Categorie;