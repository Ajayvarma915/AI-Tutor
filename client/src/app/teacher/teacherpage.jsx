"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/loader/Loader";

const TeacherDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({ name: "", description: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loader, setLoader] = useState(false);
    const [deleteCourseId, setDeleteCourseId] = useState(null);

    const getAllCourses = async () => {
        try {
            setLoader(false);
            const response = await fetch("http://localhost:8000/api/v1/courses");
            if (response.ok) {
                const data = await response.json();
                setCourses(data.data || []);
                setLoader(true);
            } else {
                console.error("Failed to fetch courses:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        if (newCourse.name && newCourse.description) {
            try {
                const response = await fetch("http://localhost:8000/api/v1/courses", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: newCourse.name,
                        description: newCourse.description,
                    }),
                });

                if (response.ok) {
                    setNewCourse({ name: "", description: "" });
                    setIsDialogOpen(false);
                    toast.success("Course added successfully!");
                    getAllCourses();
                } else {
                    toast.error("Failed to add course");
                    console.error("Failed to add course:", response.statusText);
                }
            } catch (error) {
                console.error("Error adding course:", error);
                toast.error("Error adding course");
            }
        } else {
            toast.error("Please fill in all fields");
        }
    };

    const handleDeleteCourse = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/v1/courses/${deleteCourseId}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                const data = await response.json();
                toast.success(
                    `Course "${data.deletedCourse.name}" deleted successfully!`
                );
                setDeleteCourseId(null);
                getAllCourses();
            } else {
                toast.error("Failed to delete course");
                console.error("Failed to delete course:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting course:", error);
            toast.error("Error deleting course");
        }
    };

    const filteredCourses = courses.filter(
        (course) =>
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        getAllCourses();
    }, []);

    if (!loader) {
        return (
            <Loader /> 
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">
                Teacher Dashboard
            </h1>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-xl font-semibold">Your Courses</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">Add New Course</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Course</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddCourse} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="courseName">Course Name</Label>
                                <Input
                                    id="courseName"
                                    value={newCourse.name}
                                    onChange={(e) =>
                                        setNewCourse({ ...newCourse, name: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="courseDescription">Course Description</Label>
                                <Textarea
                                    id="courseDescription"
                                    value={newCourse.description}
                                    onChange={(e) =>
                                        setNewCourse({
                                            ...newCourse,
                                            description: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Add Course
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="mb-6">
                <Input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md mx-auto sm:mx-0"
                />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                    <Card key={course.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl">{course.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between">
                            <div>
                                <p className="mb-2 text-sm text-gray-600">
                                    {course.description}
                                </p>
                                <p className="mb-4 text-sm font-medium">
                                    {course.students} students enrolled
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Link href={`/teacher/courses/${course.id}`} passHref>
                                    <Button variant="outline" className="w-full">
                                        View Course
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => setDeleteCourseId(course.id)}
                                >
                                    Remove Course
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <ToastContainer position="top-right" />
            {deleteCourseId && (
                <Dialog open={!!deleteCourseId} onOpenChange={() => setDeleteCourseId(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete this course?</p>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button onClick={() => setDeleteCourseId(null)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleDeleteCourse}>
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default TeacherDashboard;
