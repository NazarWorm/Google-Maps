import React, { useState } from 'react';
import {AiOutlineInfoCircle, AiFillInfoCircle} from 'react-icons/ai';
import {FaMapMarkerAlt} from 'react-icons/fa';
import NavbarTab from './NavbarTab';

interface INavbar{
}

function Navbar ( props: INavbar ){
   
   const url = window.location.href.split('/');
   const currPage = url[url.length-1].toLowerCase();

   return (
      <>
         <div className='
         flex
         flex-row
         items-center
         w-screen
         h-[7%]
         bg-secondary
         shadow-md'>

            <div id='logoDiv' className='
            h-full
            w-[10%]
            flex
            items-center
            place-content-center'>

               {
                  (currPage === "main") ? <FaMapMarkerAlt className='scale-[1.25] transition-all hover:fill-slate-500 hover:scale-[1.5]'/>:<></>
               }

            </div>

            <div id='navDiv' className='
            h-full
            w-full
            flex
            items-center
            place-content-center
            p-1
            '>

               <NavbarTab page='Main' tooltip='main'/>
               <NavbarTab page='about' tooltip='about'/>

            </div>

            <div id='miscDiv' className='
            h-full
            w-[10%]
            flex
            items-center
            place-content-center'>

            </div>

         </div>
      </>
   );
}

export default Navbar