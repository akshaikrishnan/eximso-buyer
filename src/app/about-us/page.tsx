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
  "Global Reach:  opportunities in new markets with ease.",
  "Customer-Centric Approach:  A hassle-free shopping experience for buyers around the globe.",
  "Tech-Driven Solutions: We use advanced tools to simplify logistics, payments, and operations.",
  "Support for Small Businesses: Helping local sellers go global and thrive.Whether you're exploring international products or scaling your business globally, eximso here to make cross-border trade simple, reliable, and efficient.",
];

export default function AboutUs() {
  return (
    <div className="bg-white scroll-smooth md:scroll-auto">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-500 via-indigo-500 to-purple-500 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              We&apos;re on a mission to <span className="text-indigo-200">connect the world</span>
            </h1>
            <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
              We&apos;re building the future of global commerce—where distance and borders no longer limit what you can buy or where you can sell.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      {/* <div className="bg-indigo-50 py-16">
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
                  &ldquo;Enabling a hassle-free global shopping experience by leveraging technology.&rdquo;
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">Our Vision</h3>
                <p className="text-gray-700">
                  &ldquo;To be the most trusted cross-border e-commerce platform, making global trade and shopping easy for businesses and consumers everywhere.&ldquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
              ABOUT US 
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Eximso is a next-generation cross-border e-commerce platform built with a bold 
            mission:</h2>
            <p className="mt-4 text-lg text-gray-600">
            To enable a hassle-free global shopping experience by leveraging technology.Headquartered in India, Eximso empowers local businesses to go global and connects 
            global customers under proxy export and hybrid mode—all through a single, seamless 
            digital platform.
            </p>
            <p className="mt-4 text-lg text-gray-600">
            Whether you're a small manufacturer in any part of the world and  
            looking to expand your reach or a consumer abroad “eximso” bridges that gap with 
            trust, speed, and simplicity.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">190+</div>
                <div className="text-gray-600">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">50M+</div>
                <div className="text-gray-600">Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">$10B+</div>
                <div className="text-gray-600">GMV</div>
              </div>
            </div>
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

      {/* Core Values Section */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
             What We Do 
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">At Eximso, we simplify international commerce by offering end-to-end support</h2>
            {/* <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              These core principles guide our decisions, shape our culture, and help us deliver exceptional experiences.
            </p> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value) => (
              <div key={value.name} className="bg-indigo-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{value.name}</h3>
                <p className="mt-2 text-gray-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How EXIMSO Works Section  */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="inline-block bg-indigo-100 px-4 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
            Our Process
          </div>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">How EXIMSO Works</h2>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            We make global commerce simple, reliable, and efficient with our comprehensive platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {howItWorks.slice(0, 9).map((item) => (
            <div
              key={item.name}
              className="bg-indigo-100 p-6  rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col"
            >
              <div className="flex items-center mb-4 ">
                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 flex items-center justify-center mr-3">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
              </div>
              <p className="text-gray-600 flex-grow">{item.description}</p>
            </div>
          ))}
        </div>
      </div> */}

      {/* BrandOnDemand Section */}
      <div className="bg-indigo-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
             <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Our Vision</h2>
              <p className="mt-4 text-lg text-gray-600">
                To be the most trusted cross-border e-commerce platform that makes global 
                trade and shopping easy for businesses and consumers everywhere.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-indigo-600 mb-6">Why Choose EXIMSO ? </h3>
              <div>
                {brandOnDemandSteps.map((step, index) => (
                  <div key={index} className="flex mb-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 mr-3 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-indigo-600 font-medium">Discover how we're transforming the world of e-commerce—one border at a time.</p>
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