"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/loader/Loader";

export default function StudentCoursePage({ params }) {
    const router = useRouter();
    const courseId = params.id;
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Button onClick={() => router.push("/student")} className="mb-6">
                Back to Courses
            </Button>
            {course && (
                <Card className="w-full shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl sm:text-3xl">{course.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-600">{course.description}</p>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Classes:</h3>
                            {course.classes && course.classes.length > 0 ? (
                                <ul className="space-y-4">
                                    {course.classes.map((eachClass, index) => (
                                        <li key={index} className="flex items-center justify-between">
                                            <p>{eachClass.name}</p>
                                            <Button onClick={() => router.push(`/student/courses/${courseId}/quiz/${eachClass.id}`)}>
                                                Take Quiz
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No Classes available yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
            <ToastContainer position="top-right" />
        </div>
    );
}

