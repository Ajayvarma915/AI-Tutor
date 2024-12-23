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
    const [dropdowns, setDropdowns] = useState({
        test1: false,
        test2: false,
        final: false,
    });

    const fetchCourseData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/api/v1/courses/${courseId}`);
            if (response.ok) {
                const data = await response.json();
                setCourse(data.data.course);
            } else {
                toast.error("Failed to fetch course data.");
            }
        } catch (error) {
            toast.error("Error fetching course data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseData();
    }, []);

    const toggleDropdown = (key) => {
        setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Button
                onClick={() => router.push("/student")}
                className="mb-6 bg-blue-600 text-white hover:bg-blue-700"
            >
                Back to Courses
            </Button>

            {course && (
                <Card className="shadow-lg">
                    <CardHeader className="bg-blue-50 p-6">
                        <CardTitle className="text-2xl font-bold text-blue-700">
                            {course.name}
                        </CardTitle>
                        <p className="text-gray-700">{course.description}</p>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                        {/* Classes Section */}
                        <div className="space-y-4">
                            {course.classes.map((classItem, index) => (
                                <div key={index} className="border rounded-lg p-4 shadow">
                                    <div className="flex justify-between items-center">
                                        <p className="text-lg font-semibold text-gray-800">
                                            {classItem.name}
                                        </p>
                                        <div className="flex space-x-4">
                                            <Button
                                                className="bg-green-500 text-white hover:bg-green-600"
                                                onClick={() => router.push(classItem.pdfLink)}
                                            >
                                                View PDF
                                            </Button>
                                            <Button
                                                className="bg-yellow-500 text-white hover:bg-yellow-600"
                                                onClick={() => router.push(classItem.audioLink)}
                                            >
                                                Audio File
                                            </Button>
                                            <Button
                                                className="bg-blue-500 text-white hover:bg-blue-600"
                                                onClick={() =>
                                                    router.push(
                                                        `/student/courses/${courseId}/quiz/${classItem.id}`
                                                    )
                                                }
                                            >
                                                Take Quiz
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tests Section */}
                        <div className="space-y-4">
                            {["Test 1", "Test 2", "Final Test"].map((test, index) => {
                                const testKey = test.toLowerCase().replace(" ", "");
                                return (
                                    <div key={index} className="border rounded-lg p-4 shadow">
                                        <div
                                            className="flex justify-between items-center cursor-pointer"
                                            onClick={() => toggleDropdown(testKey)}
                                        >
                                            <p className="text-lg font-semibold text-gray-800">{test}</p>
                                            <span
                                                className={`transform transition-transform ${dropdowns[testKey] ? "rotate-180" : "rotate-0"
                                                    }`}
                                            >
                                                ▼
                                            </span>
                                        </div>
                                        {dropdowns[testKey] && (
                                            <div className="mt-4 bg-gray-50 p-4 border rounded">
                                                <p className="text-sm text-gray-600">
                                                    Test Rules: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                </p>
                                                <Button
                                                    className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
                                                    onClick={() =>
                                                        router.push(
                                                            `/student/courses/${courseId}/quiz/${testKey}`
                                                        )
                                                    }
                                                >
                                                    Start {test}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            <ToastContainer position="top-right" />
        </div>
    );
}
