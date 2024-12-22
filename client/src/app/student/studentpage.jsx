"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export const Studentpage = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [testResults, setTestResults] = useState([]);
    const [view, setView] = useState("courses");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const router = useRouter();

    const fetchAllCourses = async () => {
        try {
            setLoading(true); // Start loading
            const response = await fetch("http://localhost:8000/api/v1/courses");
            if (response.ok) {
                const data = await response.json();
                if (data) {
                    setCourses(data.data);
                    setFilteredCourses(data.data);
                }
            } else {
                console.error("Failed to fetch courses:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false); // End loading
        }
    };

    const fetchTestResults = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/student/test-results");
            if (response.ok) {
                const data = await response.json();
                if (data) {
                    setTestResults(data.data);
                }
            } else {
                console.error("Failed to fetch test results:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching test results:", error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredCourses(
            courses.filter((course) =>
                course.name.toLowerCase().includes(query) || course.description.toLowerCase().includes(query)
            )
        );
    };

    useEffect(() => {
        fetchAllCourses();
        fetchTestResults();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">
                Student Dashboard
            </h1>
            <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
                <div className="flex gap-4">
                    <Button
                        variant={view === "courses" ? "solid" : "outline"}
                        className={`px-6 py-2 ${view === "courses" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                        onClick={() => setView("courses")}
                    >
                        Courses
                    </Button>
                    <Button
                        variant={view === "results" ? "solid" : "outline"}
                        className={`px-6 py-2 ${view === "results" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                        onClick={() => setView("results")}
                    >
                        Test Results
                    </Button>
                </div>
                {view === "courses" && (
                    <Input
                        type="text"
                        placeholder="Search courses"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full sm:w-1/3 mt-4 sm:mt-0"
                    />
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                </div>
            ) : view === "courses" ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.map((course) => (
                        <Card key={course.id} className="flex flex-col shadow-lg">
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
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => router.push(`/student/courses/${course.id}`)}
                                >
                                    View Course
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testResults.map((result) => (
                        <Card key={result.id} className="flex flex-col shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    Quiz: {result.quizName}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-2 text-sm">
                                    <span className="font-medium">Date Taken:</span> {new Date(result.dateTaken).toLocaleDateString()}
                                </p>
                                <p className="mb-2 text-sm">
                                    <span className="font-medium">Score:</span> {result.score}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">Class:</span> {result.className}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
