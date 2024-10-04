import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CoursePage from "./coursespage";

export default async function Page({ params }) {
  const session = await auth();
  if (!session) redirect("/login");
  else return <CoursePage params={params} />;
}
