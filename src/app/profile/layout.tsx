import ProfileNavbar from "@/components/profile/profile-navbar";
import React from "react";
import { unauthorized } from "next/navigation";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
export default function layout({ children }: { children: React.ReactNode }) {
  type UserRecord = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    gender?: "male" | "female" | "other" | "";
    country?: string; // ISO code
    address?: string;
    logo?: string;
  };

  function getUser(): Promise<UserRecord> {
    return api.get(endpoints.user).then((r) => r?.data?.result ?? {});
  }
  const user = getUser();
  if (!user) {
    unauthorized();
  }
  return (
    <>
      <ProfileNavbar />
      <div className="xl:px-8 px-4">{children}</div>
    </>
  );
}
