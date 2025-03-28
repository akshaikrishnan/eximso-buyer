import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";

// Define interface for banner item
interface BannerItem {
  id: string;
  image: string;
  linkUrl: string;
  width: number;
  height: number;
  alt: string;
}

// ✅ Fetch banners with proper response handling
async function fetchBanners(): Promise<BannerItem[]> {
  try {
    const res = await api.get(endpoints.banner);
    console.log("API Response:", res.data); // Debugging log

    // ✅ Ensure correct data format
    const banners = res.data.result || res.data || [];

    return banners.slice(0, 3).map((banner: any) => ({
      id: banner._id || crypto.randomUUID(),
      image: banner.image || "/placeholder-image.jpg",
      linkUrl: banner.link || "#",
      width: 370,
      height: 450,
      alt: banner.title || "Banner",
    }));
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
}

export default async function HeroThreeGrid() {
  const banners = await fetchBanners();

  // ✅ Handle empty state
  if (banners.length === 0) {
    return (
      <div className="col-span-full lg:col-span-5 xl:col-span-5 row-span-full lg:row-auto grid grid-cols-2 gap-2 md:gap-3.5 lg:gap-5 xl:gap-7">
        <div className="col-span-2 text-center text-gray-500">
          No banners available
        </div>
      </div>
    );
  }

  return (
    <div
      className={`col-span-full lg:col-span-5 xl:col-span-5 row-span-full lg:row-auto grid ${
        banners.length === 3 ? "grid-cols-2" : "grid-cols-1"
      } gap-2 md:gap-3.5 lg:gap-5 xl:gap-7`}
    >
      {banners.map((banner: BannerItem, index: number) => (
        <div
          key={banner.id}
          className={`mx-auto ${
            banners.length === 3 && index === 0 ? "col-span-2" : "col-span-1"
          } w-full`}
        >
          <Link
            className="h-full group flex justify-center relative overflow-hidden"
            href={banner.linkUrl}
          >
            <Image
              className="bg-gray-300 object-cover w-full rounded-md h-[150px] sm:h-[200px] md:h-[300px] lg:h-[300px] xl:h-[350px]"
              src={banner.image}
              width={banner.width}
              height={banner.height}
              alt={banner.alt}
              priority={index < 2} 
            />
          </Link>
        </div>
      ))}
    </div>
  );
}
