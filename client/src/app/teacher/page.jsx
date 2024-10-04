import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TeacherDashboard from "./teacherpage";

const page = async () => {
  const session = await auth;
  if (!session.user) redirect("/login");
  else {
    return <TeacherDashboard />;
  }
};

export default page;
