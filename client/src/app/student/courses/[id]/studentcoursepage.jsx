"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/loader/Loader";
import SearchIcon from "@mui/icons-material/Search";

export default function StudentCoursePage({ params }) {
    const router = useRouter();
    const courseId = params.id;
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const getCourseData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/api/v1/courses/${courseId}`);
            if (response.ok) {
                const data = await response.json();
                setCourse(data.data.course);
            } else {
                toast.error("Failed to fetch Course Data");
            }
        } catch (error) {
            toast.error("Error Getting Course Data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCourseData();
    }, []);

    if (loading) {
        return <Loader />;
    }

    const filteredClasses = course?.classes?.filter((eachClass) =>
        eachClass.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl h-screen flex flex-col">
            <Button
                onClick={() => router.push("/student")}
                className="mb-6 bg-blue-600 text-white hover:bg-blue-700"
            >
                Back to Courses
            </Button>
            {course && (
                <Card className="w-full shadow-lg flex-1 flex flex-col">
                    <div className="p-6 bg-blue-50 sticky top-0 z-10 border-b">
                        <CardHeader>
                            <CardTitle className="text-2xl sm:text-3xl text-blue-700 font-bold">
                                {course.name}
                            </CardTitle>
                        </CardHeader>
                        <p className="text-gray-700">{course.description}</p>
                        <div className="mt-4 relative flex items-center">
                            <SearchIcon className="absolute left-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search for a class..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 border rounded-lg p-3 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <CardContent className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredClasses && filteredClasses.length > 0 ? (
                                filteredClasses.map((eachClass, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow bg-white flex flex-col justify-between"
                                    >
                                        <div>
                                            <p className="text-lg font-semibold text-gray-800 mb-4">
                                                {eachClass.name}
                                            </p>
                                            <div className="space-y-2">
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-blue-500 text-blue-500 hover:bg-blue-100"
                                                    onClick={() =>
                                                        router.push(
                                                            `/student/courses/${courseId}/quiz/${eachClass.id}`
                                                        )
                                                    }
                                                >
                                                    Take Quiz
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-green-500 text-green-500 hover:bg-green-100"
                                                    onClick={() =>
                                                        router.push(
                                                            `/student/courses/${courseId}/quiz/${eachClass.id}/test1`
                                                        )
                                                    }
                                                >
                                                    Test 1
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-100"
                                                    onClick={() =>
                                                        router.push(
                                                            `/student/courses/${courseId}/quiz/${eachClass.id}/test2`
                                                        )
                                                    }
                                                >
                                                    Test 2
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-red-500 text-red-500 hover:bg-red-100"
                                                    onClick={() =>
                                                        router.push(
                                                            `/student/courses/${courseId}/quiz/${eachClass.id}/final`
                                                        )
                                                    }
                                                >
                                                    Final Test
                                                </Button>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="mt-4 bg-gray-100 hover:bg-gray-200"
                                            onClick={() =>
                                                router.push(`/student/courses/${courseId}/pdf/${eachClass.id}`)
                                            }
                                        >
                                            View PDF
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 col-span-full text-center">
                                    No Classes available yet.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
            <ToastContainer position="top-right" />
        </div>
    );
}
