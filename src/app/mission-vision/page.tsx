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

// const coreValues = [
//   {
//     name: "Global Reach",
//     icon: GlobeAltIcon,
//     description: "Connect with sellers and buyers from over 190 countries with our localized experiences and logistics solutions."
//   },
//   {
//     name: "Customer-First",
//     icon: UserGroupIcon,
//     description: "Every decision we make starts with our customers. We're committed to delivering exceptional experiences at every touchpoint."
//   },
//   {
//     name: "Reliability",
//     icon: ShieldCheckIcon,
//     description: "Our secure payment systems and buyer protection policies ensure every transaction is protected and worry-free."
//   },
//   {
//     name: "Innovation",
//     icon: SparklesIcon,
//     description: "We're constantly pushing the boundaries of what's possible in e-commerce, from AI-powered recommendations to next-day delivery."
//   },
// ];
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
// const brandOnDemandSteps = [
//   "Market Research: Identify high-demand products and add your brand name.",
//   "Product Sourcing: Share details with us; we connect with manufacturers and provide quotes and samples.",
//   "Order Confirmation: Approve production by making full or partial payments.",
//   "Manufacturing & Storage: We coordinate with manufacturers and offer warehouse storage.",
//   "Product Listing: Upload your inventory on EXIMSO and set your pricing.",
//   "Order Fulfillment: Upon sale, we handle shipping and transfer your earnings."
// ];

export default function Missionandvision() {
  return (
    <div className="bg-white scroll-smooth md:scroll-auto">
      {/* Mission & Vision Section */}
      <div className="bg-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
              EXIMSO
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-8">Revolutionizing Cross-Border E-Commerce</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">Our Mission</h3>
                <p className="text-gray-700">
                  &ldquo;Enabling a hassle-free global shopping experience by leveraging  technology.&rdquo;
                </p>
              </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">Our Vision</h3>
                <p className="text-gray-700">
                  &ldquo;To be the most trusted cross border e-commerce platform that makes global trade and shopping easy for business and consumers everywhere .&ldquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

     {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-12 md:p-12 md:flex items-center justify-between">
            <div className="md:w-2/3 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-white md:text-4xl">Ready to expand your business globally?</h2>
              <p className="mt-4 text-xl text-indigo-100">
                Join EXIMSO today and reach customers and suppliers worldwide.
              </p>
            </div>
            <div className="md:w-1/3 flex flex-col sm:flex-row md:flex-col space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-0 md:space-y-4">
              <button className="px-6 py-3 bg-white text-indigo-700 font-medium rounded-md hover:bg-indigo-50 transition-colors">
                Join as a Seller
              </button>
              <button className="px-6 py-3 bg-indigo-500 text-white font-medium rounded-md border border-indigo-300 hover:bg-indigo-400 transition-colors">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}