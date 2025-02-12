import ProfileNavbar from "@/components/profile/profile-navbar";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProfileNavbar />
      <div className="xl:px-8 px-4">{children}</div>
    </>
  );
}
