import ProfileNavbar from "@/components/profile/profile-navbar";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ProfileNavbar />
      {children}
    </div>
  );
}
