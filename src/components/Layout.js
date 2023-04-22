import React, {useEffect} from "react";
import Nav from './Nav';
import Footer from './Footer';
import {useCookies} from "react-cookie";
import useSWR from 'swr'
export default function Layout({ children }) {

    const [cookies, setCookies, removeCookie] = useCookies(['user']);

    const fetcher = url => fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId: cookies?.user?.idUtilisateur})
    })
        .then((res) => res.json())
        .then((data) => {
            const maxAge = cookies.user.maxAge
            setCookies('user', data, {
                path: '/',
                maxAge: maxAge,
            })
        })

    const {error:errorSWR, isLoading: isLoadingSWR} = useSWR(cookies['user'] ? '/api/user/getSessionData' : null, fetcher, {

    })

  return (  
    <>
      <Nav childrenProps={children.props.categoriesSideMenu} />
          {children}  
      <Footer />
    </>
  )
}