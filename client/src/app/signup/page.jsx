'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, User, UserCog, Book, School, Github, Mail } from "lucide-react"
import Link from 'next/link'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

export default function page() {
    const [isStudent, setIsStudent] = useState(true)

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
                    <div className="flex items-center justify-center space-x-2">
                        <GraduationCap className="h-8 w-8 text-blue-500" />
                        <h1 className="text-2xl font-bold text-gray-900">EduSignup</h1>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <Button
                            variant={isStudent ? "default" : "outline"}
                            onClick={() => setIsStudent(true)}
                            className="flex items-center space-x-2"
                        >
                            <Book className="h-4 w-4" />
                            <span>Student</span>
                        </Button>
                        <Button
                            variant={!isStudent ? "default" : "outline"}
                            onClick={() => setIsStudent(false)}
                            className="flex items-center space-x-2"
                        >
                            <School className="h-4 w-4" />
                            <span>Teacher</span>
                        </Button>
                    </div>

                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" required />
                        </div>
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
                        {!isStudent && (
                            <div className="space-y-2">
                                <Label htmlFor="school-code">School Code</Label>
                                <Input id="school-code" placeholder="Enter school code" required />
                            </div>
                        )}
                        <Button className="w-full" type="submit">
                            Sign up as {isStudent ? 'Student' : 'Teacher'}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or sign up with</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button className="w-full flex items-center justify-center space-x-2" variant="outline">
                            <Mail className="h-5 w-5" />
                            <span>Google</span>
                        </Button>
                        <Button className="w-full flex items-center justify-center space-x-2" variant="outline">
                            <GitHubLogoIcon className="h-5 w-5" />
                            <span>GitHub</span>
                        </Button>
                    </div>
                </div>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link className="text-blue-600 hover:underline" href="/login">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}