import Image from "next/image";
import type { FC } from "react";
import cn from "classnames";
import Link, { LinkProps } from "next/link";

interface BannerProps {
  image: any;
  title: any;
  variant?: "rounded" | "default";
  effectActive?: boolean;
  className?: string;
  classNameInner?: string;
  href: LinkProps["href"];
}

const BannerCard: FC<BannerProps> = ({
  image,
  title,
  className,
  variant = "rounded",
  effectActive = true,
  classNameInner,
  href,
}) => {
  return (
    <div className={cn("mx-auto w-full", className)}>
      <Link
        href={href}
        className={cn(
          "group flex justify-center relative overflow-hidden w-full h-full",
          classNameInner
        )}
      >
        <Image
          src={image}
          width={1920}
          height={1080}
          alt={title}
          quality={100}
          className={cn("bg-gray-300 object-cover w-full", {
            "rounded-md": variant === "rounded",
          })}
          // sizes="(max-width: 768px) 100vw"
          priority
        />
        {/* <Image
          src={image.desktop.url}
          fill
          alt={title}
          quality={100}
          className={cn("bg-gray-300 object-cover w-full hidden sm:block", {
            "rounded-md": variant === "rounded",
          })}
          sizes="(max-width: 768px) 100vw"
          priority
        /> */}
        {effectActive && (
          <div className="absolute top-0 block w-1/2 h-full transform -skew-x-12 -left-full z-5 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
        )}
      </Link>
    </div>
  );
};

export default BannerCard;
