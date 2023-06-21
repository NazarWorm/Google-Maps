import React from 'react';
import Navbar from '../components/navbar/Navbar';
import {AiOutlineArrowDown} from 'react-icons/ai';

interface IAbout{
}

function About ( props: IAbout ){

   return (
      <>
         <div className='backgroundScreen'>
            <Navbar/>

            <div className='flex flex-col h-[93%] items-center place-content-center'>

               <div className='mb-[100px] scale-[8] rotate-180'>
                     <AiOutlineArrowDown className='animate-bounce'/>
               </div>

               <div className='w-[75%] my-3'>
                  <span className='uppercase font-extralight text-6xl text-text'>This Is a School Assignment</span>
               </div>

               <div className='w-[75%] my-3'>
                  <span className='uppercase font-extralight text-4xl text-text opacity-50'>
                     To View The Main Feature Of The Website, Choose The "Main" Tab From The Navigation Bar Above
                     </span>
               </div>

            </div>
         </div>
      </>
   );
}

export default About