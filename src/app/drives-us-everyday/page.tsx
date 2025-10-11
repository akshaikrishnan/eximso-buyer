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
    name: "Enabling Hassle-Free Global Shopping",
    icon: GlobeAltIcon,
    description: "Eximso is committed to ensuring that customers worldwide can buy Indian products effortlessly, without worrying about cross-border complexities. Every decision and innovation revolves around removing friction from global trade."
  },
  {
    name: "Empowering Indian Businesses",
    icon: UserGroupIcon,
    description: "Helping small and medium Indian businesses reach international customers drives Eximso's efforts. By providing a platform that simplifies exports, Eximso creates new opportunities for local sellers."
  },
  {
    name: "Leveraging Technology for Efficiency",
    icon: ShieldCheckIcon,
    description: "Eximso is tech-driven, focusing on automation, AI, and data-driven logistics to enhance efficiency, reduce costs, and improve the shopping experience for both buyers and sellers."
  },
  {
    name: " Building Trust in Cross-Border E-Commerce ",
    icon: SparklesIcon,
    description: "Trust is the biggest factor in international trade. Eximso works daily to establish reliable logistics, secure payment solutions, and transparency in cross-border transactions."
  },

];

export default function drivesuseveryday() {
  return (
    <div className="bg-white scroll-smooth md:scroll-auto">
    
      {/* Core Values Section */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
              Our Values
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">What drives us every day</h2>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              For Eximso, the everyday drive comes from its mission and vision—making global 
              shopping seamless for consumers and businesses. The core motivations that push 
              Eximso forward daily are: 
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

  {/* CTA Section */}
    
  </div>
  );
}