import CategoryMenu from "@/components/layout/home/all-categories";
import { endpoints } from "@/lib/data/endpoints";

export default async function AllCategories() {
  // const categories = await api
  //   .get(endpoints.categoryPage)
  //   .then((res) => res.data);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/${endpoints.categoryPage}`,
    {
      cache: "force-cache",
      next: {
        revalidate: 3600,
        tags: ["cache", "categories"],
      },
    } // revalidate every hour
  );
  const categories = await res.json();
  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-6 ps-3">All Categories</h1> */}
      <CategoryMenu categories={categories} />
    </div>
  );
}
