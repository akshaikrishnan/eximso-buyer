import type React from "react";
import {
  UserIcon,
  HomeIcon,
  ShoppingBagIcon,
  SparklesIcon,
  UserGroupIcon,
  GiftIcon,
  SwatchIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

interface SubCategory {
  name: string;
  image: string;
  slug?: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  image?: string;
  subcategories: SubCategory[];
}

export const categories: Category[] = [
  {
    id: "women-ethnic",
    name: "Women Ethnic",
    icon: SwatchIcon,
    image: "/women-ethnic-clothing-icon.jpg",
    subcategories: [
      {
        name: "All Sarees",
        image: "/red-traditional-saree.jpg",
        slug: "sarees",
      },
      {
        name: "Silk Sarees",
        image: "/silk-saree-with-gold-border.jpg",
        slug: "silk-sarees",
      },
      {
        name: "Banarasi Silk Sarees",
        image: "/banarasi-silk-saree-golden.jpg",
      },
      { name: "Cotton Sarees", image: "/cotton-saree-white-with-prints.jpg" },
      { name: "Georgette Sarees", image: "/georgette-saree-blue-flowy.jpg" },
      { name: "Chiffon Sarees", image: "/chiffon-saree-elegant-black.jpg" },
      {
        name: "Heavy Work Sarees",
        image: "/heavy-work-saree-red-embroidered.jpg",
      },
      { name: "Net Sarees", image: "/net-saree-brown-with-embellishments.jpg" },

      { name: "All Kurtis", image: "/yellow-kurti-traditional.jpg" },
      { name: "Anarkali Kurtis", image: "/anarkali-kurti-blue-flared.jpg" },
      { name: "Rayon Kurtis", image: "/rayon-kurti-black-printed.jpg" },
      { name: "Cotton Kurtis", image: "/cotton-kurti-mint-green.jpg" },
      {
        name: "Chikankan Kurtis",
        image: "/chikankari-kurti-pink-embroidered.jpg",
      },

      { name: "All Kurta Sets", image: "/kurta-set-yellow-with-dupatta.jpg" },
      {
        name: "Kurta Palazzo Sets",
        image: "/kurta-palazzo-set-black-elegant.jpg",
      },
      { name: "Rayon Kurta Sets", image: "/rayon-kurta-set.jpg" },
      { name: "Kurta Pant Sets", image: "/kurta-pant-set.jpg" },
      { name: "Cotton Kurta Sets", image: "/cotton-kurta-set.jpg" },
      { name: "Sharara Sets", image: "/sharara-set.jpg" },
    ],
  },
  {
    id: "women-western",
    name: "Women Western",
    icon: UserIcon,
    image: "/women-western-clothing-icon.jpg",
    subcategories: [
      { name: "Casual Dresses", image: "/casual-dress.jpg" },
      { name: "Party Dresses", image: "/party-dress.jpg" },
      { name: "Maxi Dresses", image: "/flowing-maxi-dress.png" },
      { name: "Mini Dresses", image: "/stylish-woman-mini-dress.png" },

      { name: "T-Shirts", image: "/women-t-shirt.jpg" },
      { name: "Blouses", image: "/elegant-woman-silk-blouse.png" },
      { name: "Crop Tops", image: "/stylish-woman-crop-top.png" },
      { name: "Tank Tops", image: "/simple-tank-top.png" },
    ],
  },
  {
    id: "men",
    name: "Men",
    icon: UserIcon,
    image: "/men-clothing-icon.png",
    subcategories: [
      { name: "Casual Shirts", image: "/men-casual-shirt.jpg" },
      { name: "Formal Shirts", image: "/men-formal-shirt.jpg" },
      { name: "T-Shirts", image: "/men-t-shirt.jpg" },
      { name: "Polo Shirts", image: "/men-polo-shirt.jpg" },

      { name: "Jeans", image: "/men-jeans.png" },
      { name: "Chinos", image: "/men-chinos.jpg" },
      { name: "Formal Pants", image: "/men-formal-pants.jpg" },
      { name: "Shorts", image: "/men-shorts.jpg" },
    ],
  },
  {
    id: "kids",
    name: "Kids",
    icon: UserGroupIcon,
    subcategories: [
      { name: "T-Shirts", image: "/placeholder.svg?height=120&width=90" },
      { name: "Shirts", image: "/placeholder.svg?height=120&width=90" },
      { name: "Pants", image: "/placeholder.svg?height=120&width=90" },
      { name: "Shorts", image: "/placeholder.svg?height=120&width=90" },

      { name: "Dresses", image: "/placeholder.svg?height=120&width=90" },
      { name: "Tops", image: "/placeholder.svg?height=120&width=90" },
      { name: "Skirts", image: "/placeholder.svg?height=120&width=90" },
      { name: "Leggings", image: "/placeholder.svg?height=120&width=90" },
    ],
  },
  {
    id: "home-kitchen",
    name: "Home & Kitchen",
    icon: HomeIcon,
    subcategories: [
      { name: "Cookware", image: "/placeholder.svg?height=120&width=90" },
      { name: "Appliances", image: "/placeholder.svg?height=120&width=90" },
      { name: "Utensils", image: "/placeholder.svg?height=120&width=90" },
      { name: "Storage", image: "/placeholder.svg?height=120&width=90" },
      { name: "Wall Art", image: "/placeholder.svg?height=120&width=90" },
      { name: "Cushions", image: "/placeholder.svg?height=120&width=90" },
      { name: "Curtains", image: "/placeholder.svg?height=120&width=90" },
      { name: "Rugs", image: "/placeholder.svg?height=120&width=90" },
    ],
  },
  {
    id: "beauty-health",
    name: "Beauty & Health",
    icon: SparklesIcon,
    subcategories: [
      { name: "Face Wash", image: "/placeholder.svg?height=120&width=90" },
      { name: "Moisturizer", image: "/placeholder.svg?height=120&width=90" },
      { name: "Serum", image: "/placeholder.svg?height=120&width=90" },
      { name: "Sunscreen", image: "/placeholder.svg?height=120&width=90" },
      { name: "Lipstick", image: "/placeholder.svg?height=120&width=90" },
      { name: "Foundation", image: "/placeholder.svg?height=120&width=90" },
      { name: "Mascara", image: "/placeholder.svg?height=120&width=90" },
      { name: "Eyeshadow", image: "/placeholder.svg?height=120&width=90" },
    ],
  },
  {
    id: "jewellery-accessories",
    name: "Jewellery & Accessories",
    icon: GiftIcon,
    subcategories: [
      { name: "Necklaces", image: "/placeholder.svg?height=120&width=90" },
      { name: "Earrings", image: "/placeholder.svg?height=120&width=90" },
      { name: "Bracelets", image: "/placeholder.svg?height=120&width=90" },
      { name: "Rings", image: "/placeholder.svg?height=120&width=90" },
      { name: "Watches", image: "/placeholder.svg?height=120&width=90" },
      { name: "Sunglasses", image: "/placeholder.svg?height=120&width=90" },
      { name: "Belts", image: "/placeholder.svg?height=120&width=90" },
      { name: "Scarves", image: "/placeholder.svg?height=120&width=90" },
    ],
  },
  {
    id: "bags-footwear",
    name: "Bags & Footwear",
    icon: ShoppingBagIcon,
    subcategories: [
      { name: "Handbags", image: "/placeholder.svg?height=120&width=90" },
      { name: "Backpacks", image: "/placeholder.svg?height=120&width=90" },
      { name: "Clutches", image: "/placeholder.svg?height=120&width=90" },
      { name: "Tote Bags", image: "/placeholder.svg?height=120&width=90" },
      { name: "Sneakers", image: "/placeholder.svg?height=120&width=90" },
      { name: "Heels", image: "/placeholder.svg?height=120&width=90" },
      { name: "Sandals", image: "/placeholder.svg?height=120&width=90" },
      { name: "Boots", image: "/placeholder.svg?height=120&width=90" },
    ],
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: DevicePhoneMobileIcon,
    subcategories: [
      { name: "Smartphones", image: "/placeholder.svg?height=120&width=90" },
      { name: "Tablets", image: "/placeholder.svg?height=120&width=90" },
      { name: "Cases", image: "/placeholder.svg?height=120&width=90" },
      { name: "Chargers", image: "/placeholder.svg?height=120&width=90" },
      { name: "Headphones", image: "/placeholder.svg?height=120&width=90" },
      { name: "Speakers", image: "/placeholder.svg?height=120&width=90" },
      { name: "Earbuds", image: "/placeholder.svg?height=120&width=90" },
      { name: "Microphones", image: "/placeholder.svg?height=120&width=90" },
    ],
  },
];
