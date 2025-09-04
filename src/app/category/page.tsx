import CategoryMenu from "@/components/layout/home/all-categories";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";

export default async function AllCategories() {
  const categories = await api
    .get(endpoints.categoryPage)
    .then((res) => res.data);
  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-6 ps-3">All Categories</h1> */}
      <CategoryMenu categories={categories} />
    </div>
  );
}
