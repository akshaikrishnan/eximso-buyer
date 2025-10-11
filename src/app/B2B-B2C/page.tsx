import React from "react";
import {
  ShieldCheckIcon,
  GlobeAltIcon,
  UserGroupIcon,
  SparklesIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  TruckIcon,
  CreditCardIcon,
  ChartBarIcon,
  LifebuoyIcon,
  HeartIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  StarIcon,
  LinkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Contact from "@/components/navbar/contact/contact-page";
import { LeafIcon, DollarSignIcon } from "lucide-react";

const coreValues = [
  {
    name: "Global Marketplace Access",
    icon: GlobeAltIcon,
    description: "Enabling sellers from anywhere in the world to showcase and sell their products worldwide."
  },
  {
    name: "Smart Logistics Integration",
    icon: UserGroupIcon,
    description: " Partnered with leading logistics companies to manage seamless door-to-door delivery globally."
  },
  {
    name: "Secure Cross-Border Payments",
    icon: ShieldCheckIcon,
    description: "Facilitating smooth and reliable international transactions."
  },
  {
    name: "Localized Customer Experience",
    icon: SparklesIcon,
    description: "Providing multilingual and multi-currency support to enhance user satisfaction globally."
  },
];
// const howItWorks = [
//   {
//     name: "Connecting Businesses & Customers",
//     icon: BuildingStorefrontIcon,
//     description: "We connect businesses with customers across borders, creating opportunities for sellers to expand their reach and buyers to access unique products from around the world. Whether you're a business looking to go global or a customer exploring international brands, our platform makes the process simple and straightforward."
//   },
//   {
//     name: "User-Friendly Platform",
//     icon: CubeIcon,
//     description: "Our platform is designed with simplicity in mind, enabling businesses and customers to interact effortlessly. Sellers can list their products easily, while buyers can browse and shop through an intuitive interface. We prioritize a hassle-free experience for everyone."
//   },
//   {
//     name: "End-to-End Logistics",
//     icon: TruckIcon,
//     description: "From product sourcing to final delivery, we handle every step of the logistics chain. Our robust shipping solutions, powered by 1shipping.in, ensure timely and cost-effective transportation of goods. We manage customs, duties, and compliance so you can focus on growing your business."
//   },
//   {
//     name: "Secure Payments",
//     icon: CreditCardIcon,
//     description: "We offer secure payment gateways for both businesses and customers. Our system supports multiple currencies and ensures that all transactions are encrypted and protected, fostering trust and reliability."
//   },
//   {
//     name: "Advanced Analytics",
//     icon: ChartBarIcon,
//     description: "Our technology-driven platform leverages AI and data analytics to provide insights into market trends, customer preferences, and more. This helps businesses optimize their offerings and improve customer satisfaction."
//   },
//   {
//     name: "Comprehensive Support",
//     icon: LifebuoyIcon,
//     description: "Our team is dedicated to supporting you at every step. From setting up your online store to navigating international trade regulations, our experts provide guidance and assistance tailored to your needs."
//   },
//   {
//     name: "Sustainability",
//     icon: LeafIcon,
//     description: "We are committed to promoting sustainable and ethical trade practices. By optimizing our operations and encouraging eco-friendly practices, we aim to minimize our impact on the environment."
//   },
//   {
//     name: "Seamless Integration",
//     icon: LinkIcon,
//     description: "Our platform integrates with popular marketplaces and social media channels for maximum exposure."
//   },
//   {
//     name: "Cost-Effective Solutions",
//     icon: DollarSignIcon,
//     description: "We support multiple languages, enabling businesses to reach a broader audience and customers to shop."
//   },
//   {
//     name: "Customer-Centric Approach",
//     icon: UserIcon,
//     description: "We prioritize customer satisfaction with responsive service and easy returns."
//   }
// ];
const brandOnDemandSteps = [
  "B2B Excellence : Bulk Order Management for exporters and manufacturers,Hassle free documentation for sellers,Global shipping & logistics via our integrated logistics partners.",
  "B2C Global Reach : Sell to international consumers directly through localized storefronts,Enable multi-currency and multi-language support,Offer secured payments and fast international shipping,Simplified returns and customer service across borders.",
  "Why Choose Eximso for B2B & B2C?: End-to-end cross-border solution for all seller types,Global visibility for your brand and products,Tech-powered platform designed for scalability,Support for MSMEs, D2C brands, and exporters of all sizes.",
];

export default function B2BandB2C() {
  return (
    <div className="bg-white scroll-smooth md:scroll-auto">
     
    {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Focus on Both B2B & B2C  Empowering Every Global Seller & Buyer</h2>
            <p className="mt-4 text-lg text-gray-600">
            At Eximso, we understand the evolving landscape of global trade. That&apos;s why our platform is 
            strategically built to cater to both B2B (Business-to-Business) and B2C (Business-to
            Consumer) needs making global commerce easier, faster, and more efficient for every 
            kind of seller and buyer.
            </p>
          </div>
          <div className="relative">
            <div className="relative z-10">
              <img
                src="/images/common/working.jpg"
                width={600}
                height={400}
                className="rounded-lg shadow-lg w-full h-auto"
                alt="Working environment"
              />
            </div>
          </div>
        </div>
      </div>

 {/* BrandOnDemand Section */}
      <div className="bg-indigo-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
             <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">One Platform, Dual Power</h2>
              <p className="mt-4 text-lg text-gray-600">
            Whether you&apos;re a manufacturer, wholesaler, exporter, or a direct-to-consumer (D2C) 
            brand, Eximso empowers you to reach international customers and businesses without 
            barriers. Our integrated cross-border e-commerce system ensures smooth operations, from 
            product listing to shipping, payment, and customer support. 
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-indigo-600 mb-6">Why Choose EXIMSO ? </h3>
              <div>
                {brandOnDemandSteps.map((step, index) => (
                  <div key={index} className="flex mb-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 mr-3 shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
 </div>
  );
}