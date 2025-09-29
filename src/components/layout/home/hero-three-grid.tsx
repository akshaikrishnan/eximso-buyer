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
  type: string;
}

// ✅ Fetch banners with better handling
async function fetchBanners(): Promise<BannerItem[]> {
  try {
    // const res = await api.get(endpoints.banner);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${endpoints.banner}`,
      {
        cache: "force-cache",
        next: { revalidate: 3600, tags: ["cache", "banners"] },
      } // revalidate every hour
    ).then((res) => res.json());

    // Ensure the response data is in the correct format
    let banners = res.result || res || [];

    // Sort banners by latest, handling missing `createdAt`
    banners = banners.sort(
      (a: any, b: any) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

    return banners.map((banner: any) => ({
      id: banner._id || crypto.randomUUID(),
      image: banner.image || "/placeholder-image.jpg",
      linkUrl: banner.link || "#",
      width: 370,
      height: 450,
      alt: banner.title || "Banner",
      type: banner.type || "homepage",
    }));
  } catch (error: any) {
    console.error(
      "Error fetching banners:",
      error?.response?.data || error.message
    );
    return [];
  }
}

export default async function HeroThreeGrid() {
  const banners = await fetchBanners();

  // Store banner types to avoid multiple `.find()` calls
  const homepageBanner = banners.find((b) => b.type === "homepage");
  const footerBanner = banners.find((b) => b.type === "footer");
  const mainBanner = banners.find((b) => b.type === "main-banner");

  return (
    <div className="col-span-full lg:col-span-5 xl:col-span-5 row-span-full lg:row-auto grid grid-cols-2 gap-2 md:gap-3.5 lg:gap-5 xl:gap-0">
      {homepageBanner && (
        <BannerItemComponent
          banner={homepageBanner}
          className="col-span-2 w-full h-auto"
          imageHeight="h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[24rem]"
        />
      )}
      {footerBanner && (
        <BannerItemComponent
          banner={footerBanner}
          className="col-span-1 w-full"
          imageHeight="h-40 sm:h-48 md:h-56 lg:h-64 xl:h-[18rem]"
        />
      )}
      {mainBanner && (
        <BannerItemComponent
          banner={mainBanner}
          className="col-span-1 w-full"
          imageHeight="h-40 sm:h-48 md:h-56 lg:h-64 xl:h-[18rem]"
        />
      )}
    </div>
  );
}

// ✅ Extracted BannerItemComponent to avoid repetition
function BannerItemComponent({
  banner,
  className,
  imageHeight,
}: {
  banner: BannerItem;
  className: string;
  imageHeight: string;
}) {
  return (
    <div className={`mx-auto ${className}`}>
      <Link
        className="h-full group flex justify-center relative overflow-hidden"
        href={banner.linkUrl}
      >
        <Image
          className={`bg-gray-300 object-cover w-full rounded-md ${imageHeight}`}
          src={banner.image}
          width={banner.width}
          height={banner.height}
          alt={banner.alt}
          // priority={true}
        />
      </Link>
    </div>
  );
}
