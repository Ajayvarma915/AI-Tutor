'use client'
import React, { useState } from 'react'
// import { doCredentialsLogin } from '../actions/actions'
import { useRouter } from 'next/navigation'
import { doSocialLogin } from '../actions/actions'
const CredentialsLogin = () => {
    const [isError,setIsError]=useState("");
    const router=useRouter();
    const handleFormSubmit=async (event)=>{
        event.preventDefault();
        console.log("Submit form prevented");
        
        // try{
        //     setIsError(false);
        //     const formData=new FormData(event.currentTarget);
        //     console.log(formData);
            
        //     const response=await doCredentialsLogin(formData);
        //     console.log(response);
            
        //     if(!!response.error){
        //         setIsError(response.error.message);
        //     }
        //     else{
        //         setIsError("");
        //         router.push('/home')
        //     }
        // }
        // catch(error){
        //     setIsError("Check your credentials");
        // }
    }
  return (
    <>
    <div className='text-red-600 flex justify-center mt-6'>
        {isError}
        </div>
    <div className='w-[30rem]'>
        <form onSubmit={handleFormSubmit}>
              <div className='flex justify-evenly mt-6'>
                  <label htmlFor="email" value='email'>Email :</label>
                  <input type="email" id='email' name='email' />
              </div>
              <div className='flex justify-evenly mt-6'>
                  <label htmlFor="password" value='email'>Password :</label>
                  <input type="password" id='password' name='password'/>
              </div>
              <button type='submit' className='bg-blue-500 p-2 rounded-md mt-6 ml-[10rem]'>Credentials Login</button>
        </form>
        <form action={doSocialLogin}>
            <div className='flex justify-evenly mt-5'>
                <button className="bg-pink-400 text-white p-1 rounded-md m-1 text-lg" type="submit" name="action" value="google">
                    Sign In With Google
                </button>

                <button className="bg-black text-white p-1 rounded-md m-1 text-lg" type="submit" name="action" value="github">
                    Sign In With GitHub
                </button>
            </div>
        </form>2
    </div>
      </>
  )
}

export default CredentialsLogin
