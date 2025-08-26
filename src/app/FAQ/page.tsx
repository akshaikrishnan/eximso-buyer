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

const howItWorks = [
  {
    name: "What is Eximso?",
    icon: BuildingStorefrontIcon,
    description: "Eximso is a trusted cross-border e-commerce platform that lets you shop authentic Indian products online from anywhere in the world. From fashion and beauty to wellness and home decor, we bring Indias finest D2C brands right to your doorstep."
  },
  {
    name: "Is it safe to shop on Eximso?",
    icon: CubeIcon,
    description: "Yes. Eximso uses secure payment gateways, SSL encryption, and fraud protection tools to ensure safe shopping for all our international customers."
  },
  {
    name: "What countries does Eximso ship to?",
    icon: TruckIcon,
    description: "We offer worldwide shipping to over 100+ countries through reliable logistics partners. Shipping availability is shown at checkout based on your delivery location. "
  },
  {
    name: "What are the shipping charges?",
    icon: CreditCardIcon,
    description: "Shipping fees vary based on destination, product weight, and delivery speed. You can view final shipping costs at the checkout page before payment."
  },
  {
    name: "How do I track my order?",
    icon: ChartBarIcon,
    description: "Once your order is dispatched, you will receive a tracking number and link to monitor real-time delivery updates via your Eximso account."
  },
  {
    name: "Are customs duties and taxes included?",
    icon: LifebuoyIcon,
    description: "We display applicable customs duties and import taxes at checkout. In some regions, you may need to pay additional charges to local customs authorities."
  },
  {
    name: "Can I return or cancel my order?",
    icon: LeafIcon,
    description: "Yes.Eximso offers a buyer-friendly return and refund policy, subject to product category and seller terms. Contact our support team for assistance or check our refund policy."
  },
  {
    name: "What payment methods do you accept?",
    icon: LinkIcon,
    description:"We accept international debit/credit cards, and other region-specific payment options in multiple currencies."
  },
  {
    name: "How can I contact customer support?",
    icon: DollarSignIcon,
    description: "Live Chat on eximso.com contact@eximso.com"
  },
  {
    name: "Who can sell on Eximso?",
    icon: UserIcon,
    description: "For Sellers (Indian Businesses & D2C Brands)MSME, manufacturer, or D2C brand with export capability and GST can sell on Eximso. We support sellers across all product categories. "
  }
];
const brandOnDemandSteps = [
  "You&apos;ll need:  GST certificate,Bank account details,Product catalog & pricing.",
  "Can I sell both B2B and B2C? : Yes. Eximso enables you to sell to global consumers (B2C)  under proxy export and bulk buyers or importers (B2B) through a single dashboard.",
  "Who handles logistics and shipping?: Eximso offers integrated international logistics via air and sea freight through our logistics arm.",
  "Do I need to handle customs and documentation?: No worries. Since we operate under proxy export, Eximso will deal with all export documentation, customs clearance, shipping labels, and more for a hassle-free selling experience.",
  "How do I get paid? : All payments are made to your registered Indian bank account in INR. Please check the vendor terms and conditions.",
  "Is there any seller support? : Yes. We offer dedicated account managers, onboarding support, and real-time dashboards to manage orders, payments, and returns. ",
  "Why sell on Eximso?: Access global customers,Proxy export,Increase international visibility, Sell both B2B & B2C from one platform,Get paid in INR hassle-free,Hassle free documentation",

];

export default function FAQs() {
  return (
    <div className="bg-white scroll-smooth md:scroll-auto">
   
      {/* Core Values Section */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
            Eximso – Frequently Asked Questions (FAQs)
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Welcome to Eximso&apos;s FAQ section! Whether you&apos;re an international customer 
             shopping Indian products or a seller looking to go global</h2>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              we&apos;re here to help you understand how Eximso simplifies cross-border e-commerce.</p>
          </div>
         </div>
      </div>

      {/* How EXIMSO Works Section  */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
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
      </div>

      {/* BrandOnDemand Section */}
      <div className="bg-indigo-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
             <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">How do I register as a seller?</h2>
              <p className="mt-4 text-lg text-gray-600">
                Simply visit seller.eximso.com and sign up by submitting your business documents, 
                bank details, and product information. 
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-indigo-600 mb-6">What documents are required for onboarding?</h3>
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
              {/* <p className="mt-4 text-indigo-600 font-medium">Discover how we&apos;re transforming the world of e-commerce—one border at a time.</p> */}
            </div>
          </div>
        </div>
      </div>
 </div>
  );
}