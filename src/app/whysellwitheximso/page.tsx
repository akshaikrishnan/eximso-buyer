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
    name: "Access Untapped Global Markets",
    icon: GlobeAltIcon,
    description: "Reach international customers actively searching for authentic and unique Indian products."
  },
  {
    name: "Diversify Your Revenue",
    icon: UserGroupIcon,
    description: "Reduce dependence on local demand and create stable income streams from multiple countries. "
  },
  {
    name: "Stay Competitive and Resilient",
    icon: ShieldCheckIcon,
    description: "A global presence builds brand credibility and keeps your business thriving year-round,even during seasonal dips."
  },
  {
    name: "Leverage Seasonal Trends Worldwide",
    icon: SparklesIcon,
    description: "Capitalize on holidays and sales cycles across different countries to maximize your yearly revenue."
  },
];
const howItWorks = [
  {
    name: "Connecting Businesses & Customers",
    icon: BuildingStorefrontIcon,
    description: "We connect businesses with customers across borders, creating opportunities for sellers to expand their reach and buyers to access unique products from around the world. Whether you're a business looking to go global or a customer exploring international brands, our platform makes the process simple and straightforward."
  },
  {
    name: "User-Friendly Platform",
    icon: CubeIcon,
    description: "Our platform is designed with simplicity in mind, enabling businesses and customers to interact effortlessly. Sellers can list their products easily, while buyers can browse and shop through an intuitive interface. We prioritize a hassle-free experience for everyone."
  },
  {
    name: "End-to-End Logistics",
    icon: TruckIcon,
    description: "From product sourcing to final delivery, we handle every step of the logistics chain. Our robust shipping solutions, powered by 1shipping.in, ensure timely and cost-effective transportation of goods. We manage customs, duties, and compliance so you can focus on growing your business."
  },
  {
    name: "Secure Payments",
    icon: CreditCardIcon,
    description: "We offer secure payment gateways for both businesses and customers. Our system supports multiple currencies and ensures that all transactions are encrypted and protected, fostering trust and reliability."
  },
  {
    name: "Advanced Analytics",
    icon: ChartBarIcon,
    description: "Our technology-driven platform leverages AI and data analytics to provide insights into market trends, customer preferences, and more. This helps businesses optimize their offerings and improve customer satisfaction."
  },
  {
    name: "Comprehensive Support",
    icon: LifebuoyIcon,
    description: "Our team is dedicated to supporting you at every step. From setting up your online store to navigating international trade regulations, our experts provide guidance and assistance tailored to your needs."
  },
  {
    name: "Sustainability",
    icon: LeafIcon,
    description: "We are committed to promoting sustainable and ethical trade practices. By optimizing our operations and encouraging eco-friendly practices, we aim to minimize our impact on the environment."
  },
  {
    name: "Seamless Integration",
    icon: LinkIcon,
    description: "Our platform integrates with popular marketplaces and social media channels for maximum exposure."
  },
  {
    name: "Cost-Effective Solutions",
    icon: DollarSignIcon,
    description: "We support multiple languages, enabling businesses to reach a broader audience and customers to shop."
  },
  {
    name: "Customer-Centric Approach",
    icon: UserIcon,
    description: "We prioritize customer satisfaction with responsive service and easy returns."
  }
];
const brandOnChallengeSteps = [
  "High international shipping costs and delivery delays.",
  "Complicated import/export laws, duties, and taxes.",
  "Language and cultural barriers in marketing.",
  "Managing foreign currencies and international payments.",
];
const brandOnDemandSteps = [
  "End-to-End Global Shipping Solutions: Our integrated logistics network ensures timely, secure deliveries across the world.",
  "Regulatory & Customs Support: We manage compliance, import/export documentation, duties, and taxes—so you don’t have to. ",
  "Localized Marketing Tools: Get region-specific insights and promotional tools to better connect with diverse audiences .",
  "Easy, Secure Payments in INR: Receive payments directly in your local currency. No worries about exchange rates or remittance hassles.",
  "All-in-One Seller Dashboard: Track inventory, manage orders, and analyze sales from a single, user-friendly platform.",
];
export default function whysellwitheximso() {
  return (
    <div className="bg-white scroll-smooth md:scroll-auto">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-indigo-500 via-indigo-500 to-purple-500 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Sell Globally with Eximso<span className="text-indigo-200"> Unlock the Power of Cross-Border E-Commerce</span>
            </h1>
          </div>
        </div>
      </div>

     {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
              Our Story
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Are you ready to take your business global?</h2>
            <p className="mt-4 text-lg text-gray-600">
            With Eximso, selling internationally is no longer a challenge—it&apos;s an opportunity. Our advanced cross-border e-commerceplatform empowers Indian businesses to reach millions of international customers with ease. Whether you&apos;re a small business or a growing brand, Eximso simplifies global selling so you can scale faster and smarter. 
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

      {/* Core Values Section */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
              Our Values
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Why Sell Internationally with Eximso?</h2>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Expanding your business to global markets offers unmatched growth potential. 
              Here&apos;s why you should go global today: 
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value) => (
              <div key={value.name} className="bg-indigo-100 p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow">
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

 {/* BrandOnDemand Section */}
      <div className="bg-indigo-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-indigo-600 mb-6">Common Challenges in Global Selling</h3>
              <div>
                {brandOnChallengeSteps.map((step, index) => (
                  <div key={index} className="flex mb-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 mr-3 shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-indigo-600 font-medium">Going international can be complex—unless you have the right partner.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-indigo-600 mb-6">How Eximso Makes Global Selling Effortless</h3>
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
              <p className="mt-4 text-indigo-600 font-medium">At Eximso, we eliminate the friction from international trade.</p>
            </div>
          </div>
        </div>
      </div>

      {/* B2B & B2C Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
         <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Proven Tips to Succeed in Cross-Border E-Commerce</h2>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            To become a successful global seller, focus on these key strategies:
          </p>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-xs border border-gray-100">
           <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Research Target Markets – Understand customer demand, culture, and preferences. </span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Optimize Your Online Store – Make it multilingual,mobile-friendly,and easy to navigate.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Use Social Media Marketing – Promote your brand on Instagram,TikTok,Facebook,and more. </span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Offer Multilingual Customer Support – Boost satisfaction with localized assistance. </span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Analyze and Improve – Use data analytics to refine pricing,product listings,and promotions. </span>
              </li>
            </ul>
           </div>

          <div className="bg-white p-8 rounded-xl shadow-xs border border-gray-100">
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Real Businesses, Real Results</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Thousands of Indian sellers have transformed their businesses with Eximso. From handcrafted goods to niche products, our platform has helped brands go global—and grow fast. </span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Ready to Start Selling Internationally?</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Don&#39;t let borders limit your business potential. Join Eximso today and explore the limitless possibilities of cross-border e-commerce. Start your global selling journey now—reach customers in the USA, Europe, Middle East, and beyond.</span>
              </li>
            </ul>
           </div>
        </div>
      </div>

    
      {/* CTA Section */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="bg-linear-to-r from-indigo-600 to-indigo-800 rounded-2xl overflow-hidden shadow-xl">
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
      </div> */}
    </div>
  );
}