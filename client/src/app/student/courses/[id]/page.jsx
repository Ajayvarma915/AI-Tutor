import { redirect } from "next/navigation";
import { auth } from "@/auth";
import StudentCoursePage from "./studentcoursepage";

export default async function Page({ params }) {
    const session = await auth();
    if (!session) redirect("/login");
    else return <StudentCoursePage params={params} />;
}

