import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const ListItem = ({
  data,
}: {
  data: {
    name: string;
    image: string;
    slug: string;
    count: number | string;
  };
}) => {
  return (
    <Link
      className="flex justify-between items-center bg-gray-100 rounded-md px-5 2xl:px-3.5 py-3 xl:py-3.5 2xl:py-2.5 3xl:py-3.5 transition hover:bg-gray-100"
      href={`/products/${data?.slug}`}
    >
      <div className="flex items-center">
        <Image
          className="w-50 h-50 rounded-full aspect-1"
          src={data?.image}
          width={50}
          height={50}
          alt={data?.name}
        />
        <p className="text-sm text-gray-600 ml-4">{data?.name}</p>
      </div>
      <div className="flex items-center">
        <span className="text-xs font-medium w-5 h-5 flex flex-shrink-0 justify-center items-center bg-gray-300 rounded ltr:2xl:mr-2 rtl:2xl:ml-2">
          {data?.count}
        </span>
        <ChevronRightIcon className="w-5 h-5 text-gray-600" />
      </div>
    </Link>
  );
};

export default async function CategoryList() {
  // const categories = await api
  //   .get(`${endpoints.categories}/top?limit=9`)
  //   .then((res) => res.data);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/${endpoints.categories}/top?limit=9`,
    {
      cache: "force-cache",
      next: { revalidate: 3600, tags: ["cache", "categories"] },
    } // revalidate every hour
  );
  const categories = await res.json();
  return (
    <div className="space-y-2">
      {categories.map((item: any) => (
        <ListItem key={item.slug} data={item} />
      ))}
    </div>
  );
}
