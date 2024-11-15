import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Studentpage = () => {
    const [courses, setCourses] = useState([]);

    const fetchAllCourses = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/courses");
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            } else {
                console.error("Failed to fetch courses:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    useEffect(() => {
        fetchAllCourses();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Courses Available</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <Card key={course.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl">{course.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between">
                            <p className="mb-2 text-sm text-gray-600">
                                {course.description}
                            </p>
                            <p className="mb-4 text-sm font-medium">
                                {course.students} students enrolled
                            </p>
                            <Button variant="outline" className="w-full">
                                Enroll
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
