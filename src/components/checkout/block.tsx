import React, { useEffect, useRef, useState } from "react";
import AnimateHeight, { Height } from "react-animate-height";

export default function CheckoutBlock({
  children,
}: {
  children: React.ReactNode;
}) {
  const [height, setHeight] = useState<Height>("auto");
  const contentDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = contentDiv.current as HTMLDivElement;

    const resizeObserver = new ResizeObserver(() => {
      setHeight(element.clientHeight);
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <AnimateHeight
      duration={500}
      height={height}
      contentClassName=" pb-16"
      contentRef={contentDiv}
      className="bg-white shadow-xs ring-1 ring-gray-900/5 sm:rounded-xl px-4 py-6 sm:p-8 mb-4"
    >
      {children}
    </AnimateHeight>
  );
}
