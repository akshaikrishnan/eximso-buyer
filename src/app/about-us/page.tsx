
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
} from "@heroicons/react/24/outline";
import Contact from "@/components/navbar/contact/contact-page";

const coreValues = [
  {
    name: "Global Reach",
    icon: GlobeAltIcon,
    description: "Connect with sellers and buyers from over 190 countries with our localized experiences and logistics solutions."
  },
  {
    name: "Customer-First",
    icon: UserGroupIcon,
    description: "Every decision we make starts with our customers. We're committed to delivering exceptional experiences at every touchpoint."
  },
  {
    name: "Reliability",
    icon: ShieldCheckIcon,
    description: "Our secure payment systems and buyer protection policies ensure every transaction is protected and worry-free."
  },
  {
    name: "Innovation",
    icon: SparklesIcon,
    description: "We're constantly pushing the boundaries of what's possible in e-commerce, from AI-powered recommendations to next-day delivery."
  },
];

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image: "/images/peoples/pexels-bubi-2709563.jpg",
    bio: "With 15+ years in global commerce, Sarah founded our platform with a vision to make cross-border shopping as simple as local shopping."
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image: "/images/peoples/ai-generated-9009341_1280.jpg",
    bio: "Michael leads our engineering team, bringing expertise from his previous roles at leading tech companies to build our cutting-edge platform."
  },
  {
    name: "Priya Patel",
    role: "Head of Global Operations",
    image: "/images/peoples/pexels-divinetechygirl-1181327.jpg",
    bio: "Priya oversees our complex network of logistics partnerships, ensuring smooth operations across borders and continents."
  },
];

const howItWorks = [
  {
    name: "Connecting Businesses & Customers",
    icon: BuildingStorefrontIcon,
    description: "We bridge the gap between businesses and customers across borders, enabling sellers to reach new markets and buyers to access unique global products."
  },
  {
    name: "User -Friendly Platform",
    icon: CubeIcon,
    description: "Our intuitive platform ensures smooth navigation. Sellers can effortlessly list products, and buyers enjoy a seamless shopping experience."
  },
  {
    name: "End-to-End Logistics",
    icon: TruckIcon,
    description: "From product sourcing to final delivery, we handle every step of the logistics chain with robust shipping solutions and customs management."
  },
  {
    name: "Secure Payments",
    icon: CreditCardIcon,
    description: "We offer secure, multi-currency payment gateways, ensuring encrypted transactions for a trusted shopping experience."
  },
  {
    name: "Advanced Analytics",
    icon: ChartBarIcon,
    description: "Our AI-driven platform provides insights into market trends and customer preferences, helping businesses make data-driven decisions."
  },
  {
    name: "Comprehensive Support",
    icon: LifebuoyIcon,
    description: "Our expert team assists sellers in setting up online stores and navigating international trade regulations."
  },
  {
    name: "Sustainability",
    icon: HeartIcon,
    description: "We are committed to ethical and sustainable trade practices, optimizing operations to minimize environmental impact."
  },
  {
    name: "Seamless Integration",
    icon: ArrowPathIcon,
    description: "Our platform integrates with popular marketplaces and social media channels to maximize visibility and sales potential."
  },
];

const brandOnDemandSteps = [
  "Market Research: Identify high-demand products and add your brand name.",
  "Product Sourcing: Share details with us; we connect with manufacturers and provide quotes and samples.",
  "Order Confirmation: Approve production by making full or partial payments.",
  "Manufacturing & Storage: We coordinate with manufacturers and offer warehouse storage.",
  "Product Listing: Upload your inventory on EXIMSO and set your pricing.",
  "Order Fulfillment: Upon sale, we handle shipping and transfer your earnings."
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
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
              Our Story
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">From a simple idea to global impact</h2>
            <p className="mt-4 text-lg text-gray-600">
              Founded in 2018, we started with a simple question: why is buying from another country still so difficult? Our founders, having experienced the frustrations of cross-border shopping firsthand, decided to build a solution that would make global commerce as seamless as local shopping.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Today, we connect millions of buyers and sellers across 190+ countries, processing over 10 million transactions daily. But our mission remains the same: to break down barriers and build bridges in global commerce.
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
              Our Values
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">What drives us every day</h2>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              These core principles guide our decisions, shape our culture, and help us deliver exceptional experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value) => (
              <div key={value.name} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
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

      {/* How EXIMSO Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
            Our Process
          </div>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">How EXIMSO Works</h2>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            We make global commerce simple, reliable, and efficient with our comprehensive platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map((item, index) => (
            <div key={item.name} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                  {index + 1}
                </div>
                <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <item.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
              <p className="mt-2 text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
            Our Team
          </div>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Meet the leaders building the future</h2>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Our diverse team brings experience from top technology and retail companies worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-64 w-full">
                <img
                  src={member.image}
                  alt={member.name}
                  className="object-cover object-center w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                <p className="text-indigo-600">{member.role}</p>
                <p className="mt-3 text-gray-500">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BrandOnDemand Section */}
      <div className="bg-indigo-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
                Innovative Solution
              </div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">BrandOnDemand: Sell Without Inventory</h2>
              <p className="mt-4 text-lg text-gray-600">
                Our innovative dropshipping program enables businesses to sell globally without holding inventory. Start your global e-commerce journey with minimal upfront investment.
              </p>

              <div className="mt-8">
                <a href="#" className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
                  Join BrandOnDemand
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-indigo-600 mb-6">How It Works</h3>
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
              <p className="mt-4 text-indigo-600 font-medium">Minimal Costs: Pay a small storage fee for goods in our warehouse.</p>
            </div>
          </div>
        </div>
      </div>

      {/* B2B & B2C Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
            Comprehensive Solutions
          </div>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">B2B & B2C: Transforming Global E-Commerce</h2>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            EXIMSO bridges the gap between B2B and B2C transactions, offering a versatile and efficient platform for all your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-lg text-indigo-600 mb-4">
              <BuildingStorefrontIcon className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">For Businesses</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Access new markets with localized experiences</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Bulk order management and automated invoicing</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Simplified customs and regulatory compliance</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Comprehensive logistics and warehousing</span>
              </li>
            </ul>
            <div className="mt-8">
              <a href="/business" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                Learn more about B2B solutions →
              </a>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-lg text-indigo-600 mb-4">
              <UserGroupIcon className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">For Consumers</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Shop unique products from around the world</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Personalized shopping experiences</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Multiple payment options and buyer protection</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Real-time order tracking and delivery estimates</span>
              </li>
            </ul>
            <div className="mt-8">
              <a href="/shop" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                Explore our marketplace →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">What Our Partners Say</h2>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Hear from businesses and customers who have transformed their approach to global commerce with EXIMSO.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 italic mb-6">
                &ldquo;EXIMSO helped us expand our handcrafted goods to 12 new countries in just 6 months. Their platform handles everything from translation to payments, allowing us to focus on creating our products.&ldquo;
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                  AK
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Anya Kowalski</h4>
                  <p className="text-gray-500 text-sm">Founder, Artisan Collective</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 italic mb-6">
                &ldquo;As a mid-sized electronics manufacturer, we used to struggle with international logistics. EXIMSO&apos;s end-to-end solution has streamlined our operations and doubled our export volume.&ldquo;
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                  LT
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Liu Tao</h4>
                  <p className="text-gray-500 text-sm">Operations Director, TechPro Electronics</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 italic mb-6">
                I&apos;ve been able to source unique products from around the world without worrying about currency conversion or shipping complications. EXIMSO makes global shopping feel local.
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                  JR
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">James Rodriguez</h4>
                  <p className="text-gray-500 text-sm">Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
            Get in Touch
          </div>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Ready to go global?</h2>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Contact our expert team to discover how EXIMSO can help you expand your business globally or enhance your shopping experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-lg text-indigo-600 mb-4">
                  <PhoneIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Call Us</h3>
                <p className="mt-2 text-gray-500">Our team is available 24/7</p>
                <p className="mt-2 text-indigo-600 font-medium">+1 (800) 123-4567</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-lg text-indigo-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                <p className="mt-2 text-gray-500">We&apos;ll respond within 24 hours</p>
                <p className="mt-2 text-indigo-600 font-medium">support@eximso.com</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-lg text-indigo-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Live Chat</h3>
                <p className="mt-2 text-gray-500">Instant support from our team</p>
                <p className="mt-2 text-indigo-600 font-medium">Chat with us</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-lg text-indigo-600 mb-4">
                  <CurrencyDollarIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Sales</h3>
                <p className="mt-2 text-gray-500">For business inquiries</ p>
                <p className="mt-2 text-indigo-600 font-medium">sales@eximso.com</p>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <Contact />
            </div>
          </div>
        </div>
      </div>

      {/* Global Presence Map Section */}
      <div className="bg-indigo-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
              Global Presence
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Serving 190+ Countries</h2>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Our global network of warehouses, logistics partners, and customer service centers ensures a seamless experience worldwide.
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <div className="relative aspect-[16/9]">
              <img
                src="/images/common/map.jpg"
                alt="EXIMSO Global Presence Map"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-indigo-900 bg-opacity-30"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-900 to-transparent p-6">
              <div className="flex justify-between text-white">
                <div className="text-center">
                  <div className="text-3xl font-bold">190+</div>
                  <div className="text-sm">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24</div>
                  <div className="text-sm">Warehouses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">15+</div>
                  <div className="text-sm">Languages</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">100+</div>
                  <div className="text-sm">Currencies</div>
                </div>
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