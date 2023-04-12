import 'tailwindcss/tailwind.css';
import Layout from '../components/Layout';
import '../styles/globals.css';

import NextApp, { AppProps } from 'next/app';

// import { getCategorieIdData } from '../api/SidebarData';
import handler from '../api/SidebarData';
// import { getAllCategoriesID } from '../api/categorie';

// export async function getStaticProps() {
//   const categories = await getAllCategoriesID();
//   // console.log(categories);
//   // console.log("test");
//   return {
//       props: {
//         categories,
//       },
//   };
// }

// export async function getInitialProps() {
//   const categories = await getAllCategoriesID();
//   // console.log(categories);
//   // console.log("test");
//   return {
//       props: {
//         categories,
//       },
//   };
// }

function MyApp({Component, pageProps}){
  console.log(handler());
  return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
  )
}

// MyApp.getInitialProps = async (appContext) => {
//   const appProps = await NextApp.getInitialProps(appContext);
//   const catData = await getCategorieIdData();
//   return { ...appProps, catData };
// }

export default MyApp