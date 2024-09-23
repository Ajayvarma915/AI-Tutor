'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Mail, User, UserCog } from "lucide-react"
import Link from 'next/link'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { doSocialLogin } from '../actions/actions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'

const Login = () => {
    const [isStudent, setIsStudent] = useState(true);
    const [error, setIsError] = useState(false);
    const router = useRouter();

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        console.log("Submit form prevented");

        try {
            setIsError(false);
            const formData = new FormData(event.currentTarget);
            console.log(formData);

            // Handle credential login here
            // const response = await doCredentialsLogin(formData);
            // console.log(response);

            // if (response.error) {
            //   setIsError(true);
            // } else {
            //   setIsError(false);
            //   router.push('/home')
            // }
        } catch (error) {
            setIsError(true);
            toast.error("User Does Not Exist!");
        }
    }

    const handleSocialLogin = async (provider) => {
        const formData = new FormData();
        formData.append('action', provider);
        formData.append('userType', isStudent ? 'student' : 'teacher');

        const result = await doSocialLogin(formData);
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
                    <div className="flex items-center justify-center space-x-2">
                        <GraduationCap className="h-8 w-8 text-blue-500" />
                        <h1 className="text-2xl font-bold text-gray-900">AI Tutor</h1>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <Button
                            variant={isStudent ? "default" : "outline"}
                            onClick={() => setIsStudent(true)}
                            className="flex items-center space-x-2"
                        >
                            <User className="h-4 w-4" />
                            <span>Student</span>
                        </Button>
                        <Button
                            variant={!isStudent ? "default" : "outline"}
                            onClick={() => setIsStudent(false)}
                            className="flex items-center space-x-2"
                        >
                            <UserCog className="h-4 w-4" />
                            <span>Teacher</span>
                        </Button>
                    </div>

                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email">{isStudent ? 'Student' : 'Teacher'} Email</Label>
                            <Input
                                id="email"
                                placeholder={isStudent ? "student@example.com" : "teacher@example.com"}
                                required
                                type="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" required type="password" />
                        </div>

                        <Button className="w-full" type="submit">
                            Log in as {isStudent ? 'Student' : 'Teacher'}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <a className="text-blue-600 hover:underline" href="#">
                            Forgot password?
                        </a>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={() => handleSocialLogin('google')} className="w-full gap-2" variant="outline">
                            <Mail className='h-5 w-5' />
                            Google
                        </Button>
                        <Button onClick={() => handleSocialLogin('github')} className="w-full gap-2" variant="outline">
                            <GitHubLogoIcon className='h-5 w-5' />
                            GitHub
                        </Button>
                    </div>
                </div>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link className="text-blue-600 hover:underline" href="/signup">
                        Sign up
                    </Link>
                </p>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login