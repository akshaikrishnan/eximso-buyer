import PostRequirementPage from "@/components/post-requirements/post-requirement-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a Product Requirement | Eximso",
  description:
    "Share your sourcing needs with Eximso. Submit product requirements, choose categories, and let our experts find the best suppliers for you.",
};

export default function PostRequirements() {
  return <PostRequirementPage />;
}
