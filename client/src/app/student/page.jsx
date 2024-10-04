import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { Studentpage } from "./studentpage";

const page = async () => {
  const session = await auth;
  if (!session) redirect("/login");
  else {
    return <Studentpage />;
  }
};

export default page;
