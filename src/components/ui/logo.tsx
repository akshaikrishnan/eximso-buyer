import Link from "next/link";
import React from "react";
import Image from "next/image";
import cn from "classnames";

export default function Logo({
  className,
  ...props
}: React.AnchorHTMLAttributes<{}>) {
  return (
    <Link
      href="/"
      className={cn("inline-flex focus:outline-none shrink-0", className)}
      {...props}
    >
      <Image
        className="h-full"
        src={"/images/common/logo.png"}
        alt="Eximso.com"
        height={200}
        width={400}
        loading="eager"
        sizes="(max-width: 768px) 100vw"
      />
    </Link>
  );
}
