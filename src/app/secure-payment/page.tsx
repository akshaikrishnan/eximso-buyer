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
    name: "End-to-End Encryption",
    icon: GlobeAltIcon,
    description: " Every transaction is encrypted using the latest SSL protocols to protect your financial data from unauthorized access. "
  },
  {
    name: "Trusted Payment Partners",
    icon: UserGroupIcon,
    description: " We partner with leading global payment gateway providers, and international banking networks for safe and smooth transactions."
  },
  {
    name: "Multi-Currency Support",
    icon: ShieldCheckIcon,
    description: "Make payments in your preferred currency securely with real time conversion rates and transparent charges."
  },
  {
    name: "Fraud Detection Systems",
    icon: SparklesIcon,
    description: "Our platform monitors every transaction using AI-powered tools to detect and prevent fraudulent activities."
  },
];
const brandOnDemandSteps = [
  "Your Security, Our Commitment : Join thousands of users who trust Eximso for a seamless and secure global shopping experience. We continuously upgrade our systems to stay ahead of threats and ensure every payment on our platform is safe,smooth, and successful.",
];

export default function SecurePayment() {
  return (
    <div className="bg-white scroll-smooth md:scroll-auto">

    {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
             SECURE PAYMENTS
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Secure Payment at Eximso – Shop Globally with Confidence</h2>
            <p className="mt-4 text-lg text-gray-600">
          At Eximso, your security is our priority. We ensure a 100% secure payment experience for all 
          your international shopping and cross-border trade transactions. Our platform is built with 
          advanced encryption technologies,and multi-layer fraud protection, giving you a peace of 
          mind.
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
             What We Do 
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">What Makes Payments Safe on Eximso?</h2>
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
            <div>
             <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Why It Matters in Cross-Border E-Commerce?</h2>
              <p className="mt-4 text-lg text-gray-600">
               When buying or selling internationally, trust in payment security is essential. Whether 
               you&apos;re a global buyer or an Indian D2C brand expanding overseas, Eximso ensures every 
               transaction is protected, verified, and compliant with international standards.
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