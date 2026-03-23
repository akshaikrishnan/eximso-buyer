"use client";

import dynamic from "next/dynamic";

const NotFoundPage = dynamic(() => import("./NotFound"), {
  ssr: false,
});

export default NotFoundPage;
