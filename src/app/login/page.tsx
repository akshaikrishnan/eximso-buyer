import Loader from "@/components/common/loader/loader";
import { redirect } from "next/navigation";
import React from "react";

export default async function LoginPage({ searchParams }: any) {
  const { callbackUrl, token, newUser } = searchParams;
  const res = await fetch(
    `/api
    3?token=${token}&newUser=${newUser}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();
  console.log(data);
  if (res.ok) {
    if (data?.user?.role === "admin") {
      redirect("/admin/dashboard");
    } else {
      redirect(callbackUrl || "/");
    }
  }
  if (res.status === 401) {
    redirect("/");
  }

  return <Loader text="Hold On.." fullScreen />;
}
