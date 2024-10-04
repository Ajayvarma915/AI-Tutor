"use client";
import { useState } from "react";
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

const initialCourses = [
  {
    id: 1,
    name: "Introduction to React",
    description: "Learn the basics of React",
    students: 50,
  },
  {
    id: 2,
    name: "Advanced JavaScript",
    description: "Deep dive into JavaScript concepts",
    students: 30,
  },
  {
    id: 3,
    name: "Web Design Fundamentals",
    description: "Master the principles of web design",
    students: 45,
  },
];

const TeacherDashboard = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [newCourse, setNewCourse] = useState({ name: "", description: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (newCourse.name && newCourse.description) {
      const course = {
        id: courses.length + 1,
        ...newCourse,
        students: 0,
      };
      setCourses([...courses, course]);
      setNewCourse({ name: "", description: "" });
      setIsDialogOpen(false);
      toast.success("Course added successfully!");
    } else {
      toast.error("Please fill in all fields");
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    setNewCourse({ ...newCourse, description: e.target.value })
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
              <Link href={`/teacher/courses/${course.id}`} passHref>
                <Button variant="outline" className="w-full">
                  View Course
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default TeacherDashboard;
