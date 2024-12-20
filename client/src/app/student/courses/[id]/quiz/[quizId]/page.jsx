import { redirect } from "next/navigation";
import { auth } from "@/auth";
import QuizPage from "./QuizPage";

export default async function Page({ params }) {
    const session = await auth();
    if (!session) redirect("/login");
    else return <QuizPage params={params} />;
}

