import CategoryList from "@/components/layout/home/category-list";
import NotFound from "@/components/layout/not-found";
import { endpoints } from "@/lib/data/endpoints";

export default async function NotFoundPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/${endpoints.categories}/top?limit=6`,
    {
      cache: "force-cache",
      next: { revalidate: 3600, tags: ["cache", "categories"] },
    } // revalidate every hour
  );
  const categories = await res.json();
  return <NotFound categories={categories} />;
}
