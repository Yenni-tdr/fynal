import prisma from '../../lib/prisma';

export async function getStaticProps() {
  const products = await prisma.product.findMany();

  return {
    props: {
      products
    }
  };
}

export default function Products({ products }) {
  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
}