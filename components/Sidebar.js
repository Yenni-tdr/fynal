    import React, {useRef, useEffect, useState} from 'react';
    import SidebarData  from './SidebarData';
    import SidebarMenu  from './SidebarMenu';
    import styled from 'styled-components';
    import { useRouter } from 'next/router';
    import Link from 'next/link';

    const SidebarNav = styled.nav`
        background: rgb(28 25 23);
        width: 250px;
        height: 100vh;
        display: flex;
        justify-content: center;
        position : fixed;
        left : ${({ sidebar }) => (sidebar ? '0' : '-100%')};
        transition : 350ms;
        color: white;
    `
    const SidebarWrap = styled.div`
        width: 100%;
    `

    const Sidebar = ({ sidebarState }) => {
        if(!sidebarState) return null;

        const [isOpen, setIsOpen] = useState(sidebarState);

        let menuRef = useRef();

        useEffect(() => {
            let handler = (e)=>{    
                if(!menuRef.current.contains(e.target)){
                    setIsOpen(false);
                }
            };

            document.addEventListener("mousedown", handler);

            return() =>{
                document.removeEventListener("mousedown", handler);
            }
        });

        return(
        <>
            <SidebarNav className="sticky top-25 z-50" sidebar={isOpen} ref={menuRef}>
                <SidebarWrap>
                    {SidebarData.map((item, index) => {
                        return <SidebarMenu item={item} key={index} closeSidebar={() => setIsOpen(false)} />
                    })}
                </SidebarWrap>
            </SidebarNav>   
        </>
        );
    };


    export default Sidebar;
