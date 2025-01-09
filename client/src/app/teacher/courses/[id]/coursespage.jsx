"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // For animations
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PdfUpload from "@/app/components/fileUploder";

export default function CoursePage({ params }) {
    const router = useRouter();
    const courseId = params.id;
    const [course, setCourse] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [file, setFile] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newClassName, setNewClassName] = useState("");

    const getCourseName = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/courses/${courseId}`);
            if (response.ok) {
                const data = await response.json();
                setCourse(data.data.course);
            } else {
                toast.error("Failed to fetch Course Data");
            }
        } catch (error) {
            toast.error("Error Getting Course Name");
        }
    };

    const handleUpdatePDF = async (e) => {
        e.preventDefault();
        if (!file) return toast.error("Please upload a PDF file.");

        const formData = new FormData();
        formData.append("pdffile", file);
        formData.append("name", selectedClass);

        try {
            const response = await fetch(
                `http://localhost:8000/api/v1/courses/${courseId}/updateclasspdf`,
                {
                    method: "PUT",
                    body: formData,
                }
            );
            if (response.ok) {
                toast.success("PDF updated successfully.");
                setIsDialogOpen(false);
                setFile(null);
                getCourseName();
            } else {
                toast.error("Failed to update PDF.");
            }
        } catch (error) {
            toast.error("Error updating PDF.");
        }
    };

    const handleAddClass = async (e) => {
        e.preventDefault();
        if (!file || !newClassName.trim()) {
            return toast.error("Please provide a class name and upload a PDF.");
        }

        const formData = new FormData();
        console.log(formData)
        formData.append("name", newClassName);
        formData.append("courseId", courseId);

        try {
            const response = await fetch(`http://localhost:8000/api/v1/classes/`, {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                toast.success("Class added successfully.");
                setIsAddDialogOpen(false);
                setFile(null);
                setNewClassName(""); 
                getCourseName(); 
            } else {
                toast.error("Failed to add class.");
            }
        } catch (error) {
            toast.error("Error adding class.");
        }
    };

    const handleViewPDF = async (classId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/classes/pdf/${classId}`);
            if (response.ok) {
                const data = await response.json();
                const pdfBytes = Object.values(data.pdf); // Convert response object to byte array
                const pdfBlob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
                const pdfURL = URL.createObjectURL(pdfBlob);
                window.open(pdfURL, "_blank"); // Open the PDF in a new tab
            } else {
                toast.error("Failed to fetch PDF.");
            }
        } catch (error) {
            toast.error("Error fetching PDF.");
        }
    };

    useEffect(() => {
        getCourseName();
    }, []);

    return (
        <motion.div
            className="container mx-auto px-4 py-8 max-w-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Button onClick={() => router.push("/teacher")} className="mb-6">
                Back to Dashboard
            </Button>
            <Card className="w-full shadow-lg hover:shadow-2xl transition-shadow">
                <CardHeader>
                    <CardTitle className="text-2xl sm:text-3xl text-center sm:text-left">
                        {course.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <motion.p
                        className="text-gray-600"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        {course.description}
                    </motion.p>
                    <p className="font-medium">{course.students} students enrolled</p>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Classes:</h3>
                        {course.classes && course.classes.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-4">
                                {course.classes.map((eachClass, index) => (
                                    <motion.li
                                        key={index}
                                        className="flex items-center space-x-4"
                                    >
                                        <p>{eachClass.name}</p>
                                        <Button variant="outline" onClick={() => handleViewPDF(eachClass.id)}>
                                            View PDF
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setSelectedClass(eachClass.name);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            Edit PDF
                                        </Button>
                                    </motion.li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No Classes added yet.</p>
                        )}
                    </div>
                    <Button onClick={() => setIsAddDialogOpen(true)} className="mt-4">
                        Add New Class
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Update PDF for {selectedClass}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleUpdatePDF} className="space-y-4">
                                    <PdfUpload onUpload={(file) => setFile(file)} />
                                    <Button type="submit" className="w-full">
                                        Update PDF
                                    </Button>
                                </form>
                            </DialogContent>
                        </motion.div>
                    </Dialog>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Class</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddClass} className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="className"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Class Name
                                        </label>
                                        <input
                                            id="className"
                                            type="text"
                                            value={newClassName}
                                            onChange={(e) => setNewClassName(e.target.value)}
                                            placeholder="Enter class name"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                                        />
                                    </div>
                                    <PdfUpload onUpload={(file) => setFile(file)} />
                                    <Button type="submit" className="w-full">
                                        Add Class
                                    </Button>
                                </form>
                            </DialogContent>
                        </motion.div>
                    </Dialog>
                </CardContent>
            </Card>
            <ToastContainer position="top-right" />
        </motion.div>
    );
}
