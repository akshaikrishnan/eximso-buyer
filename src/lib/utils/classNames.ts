import clsx from "clsx";
import { twMerge } from "tw-merge";

function mergeClasses(...classes: string[]): string {
  return twMerge(clsx(...classes));
}

export default mergeClasses;
