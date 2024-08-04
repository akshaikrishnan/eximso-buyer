import React from "react";
import CategoryList from "./category-list";
import HeroThreeGrid from "./hero-three-grid";
import FlashSale from "./flashSale";

export default function HeroWithCategories() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 2xl:grid-cols-9 gap-5 xl:gap-7 lg:gap-y-14">
      <div className="col-span-full lg:col-span-2 grid grid-cols-1 gap-3 justify-between">
        <CategoryList />
      </div>
      <HeroThreeGrid />
      <FlashSale />
    </div>
  );
}
