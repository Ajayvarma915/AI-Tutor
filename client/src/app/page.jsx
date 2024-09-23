'use client'
import Image from "next/image";
import Login from "./components/CredentialsLogin";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
    const router=useRouter();
    useEffect(()=>{
        router.push('/login');
    },[router])
}
