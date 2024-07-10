import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const mock = [
  {
    name: "Electronics",
    image: "/images/category/bags.jpg",
    slug: "electronics",
    count: 10,
  },
  {
    name: "Fashion",
    image: "/images/category/kid.jpg",
    slug: "fashion",
    count: 20,
  },
  {
    name: "Books",
    image: "/images/category/man.jpg",
    slug: "books",
    count: 30,
  },
  {
    name: "Watch",
    image: "/images/category/watch.jpg",
    slug: "electronics",
    count: 10,
  },
  {
    name: "Sneakers",
    image: "/images/category/sneakers.jpg",
    slug: "fashion",
    count: 20,
  },
  {
    name: "Artwork Tees",
    image: "/images/category/sports.jpg",
    slug: "books",
    count: 30,
  },
  {
    name: "Accessories",
    image: "/images/category/sunglass.jpg",
    slug: "electronics",
    count: 10,
  },
  {
    name: "Watches",
    image: "/images/category/woman.jpg",
    slug: "fashion",
    count: 20,
  },
];

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
          className="w-50 h-50 rounded-full"
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

export default function CategoryList() {
  return (
    <div className="space-y-2">
      {mock.map((item, index) => (
        <ListItem key={index} data={item} />
      ))}
      <ListItem
        data={{
          name: "Fashion",
          image: "/images/category/kid.jpg",
          slug: "fashion",
          count: 20,
        }}
      />
    </div>
  );
}
