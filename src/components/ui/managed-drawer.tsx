"use client";
import { drawerAtom } from "@/store/drawer-atom";
import { useAtom } from "jotai";
import Drawer from "./drawer";
import dynamic from "next/dynamic";

const MobileMenu = dynamic(() => import("../navbar/mob-sidebar"));

export default function ManagedDrawer() {
  const [{ display, view, data }, setDrawerState] = useAtom(drawerAtom);

  return (
    <Drawer
      open={display}
      onClose={() => setDrawerState({ display: false, view: "" })}
      variant={
        ["DISPLAY_CART", "DISPLAY_MAINTENANCE_MORE_INFO"].includes(view)
          ? "right"
          : "left"
      }
      className={
        ["DISPLAY_MAINTENANCE_MORE_INFO"]?.includes(view)
          ? "max-w-sm md:max-w-xl"
          : ""
      }
    >
      <MobileMenu />
    </Drawer>
  );
}
