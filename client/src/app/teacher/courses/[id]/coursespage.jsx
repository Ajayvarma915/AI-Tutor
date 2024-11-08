"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PdfUpload from "@/app/components/fileUploder";

// const coursesData = {
//   1: {
//     id: 1,
//     name: "Introduction to React",
//     description: "Learn the basics of React",
//     students: 50,
//     topics: [],
//   },
//   2: {
//     id: 2,
//     name: "Advanced JavaScript",
//     description: "Deep dive into JavaScript concepts",
//     students: 30,
//     topics: [],
//   },
//   3: {
//     id: 3,
//     name: "Web Design Fundamentals",
//     description: "Master the principles of web design",
//     students: 45,
//     topics: [],
//   },
// };

export default function CoursePage({ params }) {
  const router = useRouter();
  const courseId = params.id;
  const [course, setCourse] = useState(coursesData[courseId]);
  const [file, setFile] = useState(0);
  const [newTopic, setNewTopic] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Course not found
      </div>
    );
  }
  // const handleUpload = async (pdfFile) => {
  //   const formData = new FormData();
  //   formData.append("pdffile", pdfFile);
  //   try {
  //     const responce = await axios.post(
  //       `http://localhost:8000/api/v1/teacher/courses/${courseId}/addclassesdetails`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     console.log(responce.status);
  //   } catch (err) {
  //     console.log("error");
  //   }
  // };
    const getCourseName=async()=>{
        try {
            const response = await fetch(`GET http://localhost:8000/api/v1/courses/${params.id}`)
            if(response.ok){
                const data = await response.json();
                setCourse(data);
            }
            else toast.error("Failed to fetch Course Data");
        } catch (error) {
            toast.error("Error Getting Course Name");
        }
    }
  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopic) toast.error("Please enter a topic");
    if (!file) toast.error("Please add the pdf");
    const formData = new FormData();
    formData.append("name", newTopic);
    formData.append("pdffile", file);
    try {
        const response = await fetch(`http://localhost:8000/api/v1/courses/2`, {
            method: "POST",
            body: formData,
        });
      console.log(responce.status);
      setIsDialogOpen(false);
      setNewTopic("");
      setFile(null);
      toast.success("Topic added successfully");
    } catch (err) {
      console.log("error");
      toast.error("Error 404");
    }
  };

  useEffect(()=>{
    getCourseName();
  },[]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button onClick={() => router.push("/teacher")} className="mb-6">
        Back to Dashboard
      </Button>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl text-center sm:text-left">
            {course.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{course.description}</p>
          <p className="font-medium">{course.students} students enrolled</p>
          <div>
            <h3 className="text-xl font-semibold mb-2">Classes:</h3>
            {course.topics.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {course.topics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No Classes added yet.</p>
            )}
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">Add New Class</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTopic} className="space-y-4">
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="topicName">Topic Name</Label>
                  <Input
                    id="topicName"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    required
                  />
                  <PdfUpload onUpload={(file) => setFile(file)} />
                </div>
                <Button type="submit" className="w-full">
                  Add Topic
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      <ToastContainer position="top-right" />
    </div>
  );
}
