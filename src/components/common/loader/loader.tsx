"use client";
import clsx from "clsx";
import "./spinner.css";
import { useEffect } from "react";

export default function Loader({
  text,
  fullScreen,
  overlay,
  color,
}: {
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  color?: string;
}) {
  useEffect(() => {
    if (overlay) document.body.style.overflow = "hidden";
    return () => {
      if (overlay) document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className={clsx(
        overlay && "h-[100dvh] w-[100dvw] fixed inset-0 z-[1000] bg-black/30"
      )}
    >
      <div
        className={clsx(
          "loaderWrapper",
          fullScreen && "h-[60dvh]",
          overlay &&
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
        )}
      >
        <div>
          <div
            className="spinner "
            style={
              {
                "--clr": color || "rgb(188, 159, 247)",
              } as React.CSSProperties
            }
          >
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="text-center text-gray-500 mt-14">{text}</div>
        </div>
      </div>
    </div>
  );
}
