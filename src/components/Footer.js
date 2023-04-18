import React from "react";
import Image from "next/image"

export default function Footer(){
    return(
        <footer className="footer items-center p-3 bg-black text-neutral-content bottom-0 fixed mt-0">
            <div className="items-center grid-flow-col">
                <a className="text-2xl ml-5">fynal</a>
                <p className="mt-1 ml-5">Copyright © 2023</p>
            </div> 
        </footer>
    )
}