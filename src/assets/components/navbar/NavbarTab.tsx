import React, { useEffect, useState } from 'react';
import {DiGoogleCloudPlatform} from 'react-icons/di';
import {Navigate, useNavigate} from 'react-router-dom';

interface INavbarTab{
   page?: string,
   tooltip?: string,
}

function NavbarTab ( props: INavbarTab ){

   const url = window.location.href.split('/');
   const currPage = url[url.length-1];
   const [selected, setSelected] = useState<boolean>(false);

   useEffect(() => {
      if(props.page?.toLowerCase() !== currPage.toLowerCase()){
         setSelected(true);
      }
   }, []);

   const navigate = useNavigate();
   const onClickHandler = () => {
      if(selected){
         console.log("CLICKED!");
         props.page && (navigate(`/${props.page}`) )
      }
   };

   const checkSelected = () => {
      if(selected){
         return (
         <>
            <div className='
            flex
            items-center
            place-content-center
            h-full aspect-square
            rounded-md
            border
            border-accent
            shadow-md
            group
            transition-all
            mx-[2px]
            hover:bg-accent
            hover:scale-[1.15]
            hover:mx-[5px]
            ' onClick={onClickHandler}>

               <DiGoogleCloudPlatform className='transition-all group-hover:fill-secondary'/>

               <div id='tooltip' className='
               absolute
               translate-y-8
               bg-primary
               py-1
               px-2
               rounded-lg
               flex
               items-center
               place-content-center
               scale-0
               transition
               group-hover:scale-100
               '>

                  <span className='text-[8px] uppercase text-secondary'>{props.tooltip ? props.tooltip: 'Tooltip'}</span>

               </div>

            </div>
         </>
         )
      } else {
         return (
         <>
            <div className='
            flex
            items-center
            place-content-center
            h-full aspect-square
            rounded-md
            border
            border-accent
            shadow-md
            group
            transition-all
            mx-[5px]
            scale-[1.15]
            bg-accent
            ' onClick={onClickHandler}>

               <DiGoogleCloudPlatform className='transition-all group-hover:fill-secondary'/>

               <div id='tooltip' className='
               absolute
               translate-y-8
               bg-primary
               py-1
               px-2
               rounded-lg
               flex
               items-center
               place-content-center
               scale-0
               transition
               group-hover:scale-100
               '>

                  <span className='text-[8px] uppercase text-secondary'>{props.tooltip ? props.tooltip: 'Tooltip'}</span>

               </div>

            </div>
         </>
         );
      }
   }

   return (
      <>
         {
            checkSelected()
         }
      </>
   );
}

export default NavbarTab