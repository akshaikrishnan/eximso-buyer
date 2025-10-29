import PostRequirementPage from "@/components/post-requirements/post-requirement-page";
import { endpoints } from "@/lib/data/endpoints";
import type { Metadata } from "next";

async function getCategories() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${endpoints.categoryPage}`,
      {
        cache: "force-cache",
        next: {
          revalidate: 60 * 60,
          tags: ["cache", "post-requirement-categories"],
        },
      }
    );

    const payload = await response.json();
    const categories = payload?.result ?? payload;

    if (Array.isArray(categories)) {
      return categories;
    }
  } catch (error) {
    console.error("Failed to fetch categories for post requirements", error);
  }

  return [];
}

export const metadata: Metadata = {
  title: "Post a Product Requirement | Eximso",
  description:
    "Share your sourcing needs with Eximso. Submit product requirements, choose categories, and let our experts find the best suppliers for you.",
};

export default async function PostRequirements() {
  const categories = await getCategories();
  return <PostRequirementPage categories={categories} />;
}
