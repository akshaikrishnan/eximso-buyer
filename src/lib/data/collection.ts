interface Product {
  title: string;
  href: string;
  image: string;
  description?: string;
}

interface CollectionGroupProps {
  title: string;
  products: Product[];
}

export const collectionGroup: CollectionGroupProps[] = [
  {
    title: "Recently Viewed",
    products: [
      {
        title: "Smartphone",
        href: "https://example.com/smartphone",
        image: "/images/products/p-1.png",
        description: "Latest model smartphone with advanced features.",
      },
      {
        title: "Laptop",
        href: "https://example.com/laptop",
        image: "/images/products/p-2.png",
        description: "High-performance laptop for all your needs.",
      },
      {
        title: "Smartwatch",
        href: "https://example.com/smartwatch",
        image: "/images/products/p-3.png",
        description: "Smartwatch with various health tracking features.",
      },
      {
        title: "Tablet",
        href: "https://example.com/tablet",
        image: "/images/products/p-4.png",
        description: "Versatile tablet for work and play.",
      },
    ],
  },
  {
    title: "Buy again",
    products: [
      {
        title: "Refrigerator",
        href: "https://example.com/refrigerator",
        image: "/images/products/p-5.png",
        description: "Energy-efficient refrigerator with large capacity.",
      },
      {
        title: "Washing Machine",
        href: "https://example.com/washing-machine",
        image: "/images/products/p-6.png",
        description: "Top-load washing machine with multiple wash settings.",
      },
      {
        title: "Microwave",
        href: "https://example.com/microwave",
        image: "/images/products/p-7.png",
        description: "Compact microwave with quick-cook features.",
      },
      {
        title: "Air Conditioner",
        href: "https://example.com/air-conditioner",
        image: "/images/products/p-8.png",
        description: "Efficient air conditioner with fast cooling.",
      },
    ],
  },
  {
    title: "Featured Products",
    products: [
      {
        title: "Novel",
        href: "https://example.com/novel",
        image: "/images/products/p-9.png",
        description: "Bestselling novel with gripping storyline.",
      },
      {
        title: "Biography",
        href: "https://example.com/biography",
        image: "/images/products/p-10.png",
        description: "Inspirational biography of a famous personality.",
      },
      {
        title: "Science Fiction",
        href: "https://example.com/science-fiction",
        image: "/images/products/p-11.png",
        description: "Exciting science fiction book with futuristic themes.",
      },
      {
        title: "Cookbook",
        href: "https://example.com/cookbook",
        image: "/images/products/p-12-m.png",
        description: "Cookbook with recipes from around the world.",
      },
    ],
  },
  {
    title: "Trending Products",
    products: [
      {
        title: "Dress",
        href: "https://example.com/dress",
        image: "/images/products/p-13.png",
        description: "Stylish dress for any occasion.",
      },
      {
        title: "Shoes",
        href: "https://example.com/shoes",
        image: "/images/products/p-14.png",
        description: "Comfortable and fashionable shoes.",
      },
      {
        title: "Watch",
        href: "https://example.com/watch",
        image: "/images/products/p-15.png",
        description: "Elegant watch with leather strap.",
      },
      {
        title: "Handbag",
        href: "https://example.com/handbag",
        image: "/images/products/p-16.png",
        description: "Chic handbag with ample storage space.",
      },
    ],
  },
  {
    title: "Toys",
    products: [
      {
        title: "Action Figure",
        href: "https://example.com/action-figure",
        image: "/images/products/p-17.png",
        description: "Detailed action figure for kids.",
      },
      {
        title: "Board Game",
        href: "https://example.com/board-game",
        image: "/images/products/p-18.png",
        description: "Fun board game for family and friends.",
      },
      {
        title: "Puzzle",
        href: "https://example.com/puzzle",
        image: "/images/products/p-19.png",
        description: "Challenging puzzle for all ages.",
      },
      {
        title: "Doll",
        href: "https://example.com/doll",
        image: "/images/products/p-20.png",
        description: "Beautiful doll with accessories.",
      },
    ],
  },
  {
    title: "Sports",
    products: [
      {
        title: "Soccer Ball",
        href: "https://example.com/soccer-ball",
        image: "/images/products/p-21.png",
        description: "Durable soccer ball for outdoor play.",
      },
      {
        title: "Tennis Racket",
        href: "https://example.com/tennis-racket",
        image: "/images/products/p-22.png",
        description: "Lightweight tennis racket for beginners.",
      },
      {
        title: "Basketball",
        href: "https://example.com/basketball",
        image: "/images/products/p-23.png",
        description: "High-quality basketball for indoor and outdoor use.",
      },
      {
        title: "Running Shoes",
        href: "https://example.com/running-shoes",
        image: "/images/products/p-24-m.png",
        description: "Comfortable running shoes for long-distance runs.",
      },
    ],
  },
  {
    title: "Kids",
    products: [
      {
        title: "Fruits",
        href: "https://example.com/fruits",
        image: "/images/products/p-20-1.png",
        description: "Fresh fruits and vegetables.",
      },
      {
        title: "Bakery",
        href: "https://example.com/bakery",
        image: "/images/products/p-20-2.png",
        description: "Delicious bread and pastries.",
      },
      {
        title: "Meat",
        href: "https://example.com/meat",
        image: "/images/products/p-20-3.png",
        description: "Prepared meats and seafood.",
      },
      {
        title: "Dairy",
        href: "https://example.com/dairy",
        image: "/images/products/p-20-4.png",
        description: "Healthy dairy products.",
      },
    ],
  },
  {
    title: "Beauty & Personal Care",
    products: [
      {
        title: "Lipstick",
        href: "https://example.com/lipstick",
        image: "/images/products/p-21.png",
        description: "Luxury lipstick with matte finish.",
      },
      {
        title: "Mascara",
        href: "https://example.com/mascara",
        image: "/images/products/p-25-m.png",
        description: "Shampoo and conditioner for smooth and glossy skin.",
      },
      {
        title: "Eye Makeup",
        href: "https://example.com/eye-makeup",
        image: "/images/products/p-26-m.png",
        description: "Eyeliner and mascara for beautiful eye makeup.",
      },
      {
        title: "Hair Serum",
        href: "https://example.com/hair-serum",
        image: "/images/products/p-27-m.png",
        description: "Natural hair serum for healthy and vibrant hair.",
      },
    ],
  },
];
