import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import { useNavigate } from 'react-router-dom';

interface IIndex{
}

interface IUserData{
   id: number;
   name: string;
   username: string;
   email: string;
   address: {
       street: string;
       suite: string;
       city: string;
       zipcode: string;
       geo: {
           lat: string;
           lng: string;
       }
   };
   phone: string;
   website: string;
   company: {
       name: string;
       catchPhrase: string;
       bs: string;
   }
}

function Index ( props: IIndex ){

   const navigate = useNavigate();

   const usernameRef = useRef<HTMLInputElement>(null);
   const passwordRef = useRef<HTMLInputElement>(null);
   const [users, setUsers] = useState<IUserData[] | null>(null);
   const [invCred, setInvCred] = useState<0|1|2>(0);

   //fetch users
   useEffect(() => {
      fetch("https://jsonplaceholder.typicode.com/users").then(respone => respone.json()).then((data: IUserData[]) => {
            setUsers(data);
         });
   }, []);

   //Check if user exists
   const checkCredentials = (usr: string, pass: string) => {
      let res: string = "notFound";
      users?.map(user => {
         if(user.username === usr){
            if(user.email === pass){
               localStorage.setItem("USER_AUTH_DATA", JSON.stringify(user));
               res = "valid";
            }else{
               res = "invalid";
            }
         }
      });
      return res;
   }

   //Handles the onClick event of the "Log-in" button
   const onClickHandler = () => {
      const username = usernameRef.current?.value!;
      const password = passwordRef.current?.value!;
      let passed: string = checkCredentials(username, password);
   
      //loop over all users
      if(passed === "valid"){
         navigate("main");
      }else if(passed === "invalid"){
         //invalid credentials
         setInvCred(1);
      }else if(passed === "notFound"){
         //user doesn't exist
         setInvCred(2);
      }

   }

   return (
      <>
         <div className='backgroundScreen flex items-center place-content-center flex-col'>

            <div className='flex flex-col items-center place-content-center p-6 rounded-lg'>
               
               <input type='text' id='username' placeholder='Username' className='
               loginInput
               ' ref={usernameRef}/>

               <input type='password' id='password' placeholder='Password (Email)' className='
               loginInput
               ' ref={passwordRef}/>

               <input type='button' id='btnLogin' value="Log-In" className='
               w-fit
               border
               border-black
               py-1
               px-4
               rounded-xl
               font-extralight
               uppercase
               transition-all
               duration-300
               outline-none
               hover:bg-black
               hover:text-background
               hover:scale-110
               hover:shadow-md
               hover:rounded-sm
               focus:bg-black
               focus:text-background
               focus:scale-110
               focus:shadow-md
               focus:rounded-sm
               ' onClick={onClickHandler}/>

            </div>

            {
               (invCred !== 0) ?
               <div className='
               bg-red-200
               p-3
               rounded-sm
               shadow-sm
               '>

                  <span className='text-red-900 opacity-75'>{(invCred === 1) ? "Wrong Password": "User Does not Exist"}</span>

               </div>:<></> 
            }

         </div>
      </>
   );
}

export default Index