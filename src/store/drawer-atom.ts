import { atom } from "jotai";

export type DRAWER_VIEWS =
  | "DISPLAY_FILTER"
  | "DISPLAY_MOBILE_MENU"
  | "DISPLAY_CART"
  | "DISPLAY_MAINTENANCE_MORE_INFO"
  | "";

interface DrawerState {
  display: boolean;
  view: DRAWER_VIEWS;
  data?: any;
}

export const drawerAtom = atom<DrawerState>({
  display: false,
  view: "",
  data: null,
});
