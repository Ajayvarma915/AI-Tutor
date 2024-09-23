import React from 'react'
import { auth } from '../../auth'
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Logout from '../components/Logout';
const Home = async () => {
    const session = await auth();

    if (!session?.user) redirect('/');

    return (
        <>
            <div className='flex flex-col items-center m-4'>
                <h1>{session?.user?.name}</h1>
                <Image src={session?.user?.image} alt='missing' width={72} height={72}></Image>
            </div>
            <div className='flex justify-center'>
                <Logout/>
            </div>
        </>
    )
}

export default Home