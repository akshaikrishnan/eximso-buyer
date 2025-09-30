import React from "react";
import {
  ShieldCheckIcon,
  GlobeAltIcon,
  UserGroupIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const coreValues = [
  {
    name: "Enabling Hassle-Free Global Shopping",
    icon: GlobeAltIcon,
    description:
      "Eximso is committed to ensuring that customers worldwide can buy Indian products effortlessly, without worrying about cross-border complexities. Every decision and innovation revolves around removing friction from global trade.",
  },
  {
    name: "Empowering Indian Businesses",
    icon: UserGroupIcon,
    description:
      "Helping small and medium Indian businesses reach international customers drives Eximso's efforts. By providing a platform that simplifies exports, Eximso creates new opportunities for local sellers.",
  },
  {
    name: "Leveraging Technology for Efficiency",
    icon: ShieldCheckIcon,
    description:
      "Eximso is tech-driven, focusing on automation, AI, and data-driven logistics to enhance efficiency, reduce costs, and improve the shopping experience for both buyers and sellers.",
  },
  {
    name: "Building Trust in Cross-Border E-Commerce",
    icon: SparklesIcon,
    description:
      "Trust is the biggest factor in international trade. Eximso works daily to establish reliable logistics, secure payment solutions, and transparency in cross-border transactions.",
  },
  {
    name: "Expanding Global Reach",
    icon: GlobeAltIcon,
    description:
      "Every day is about extending our international presence—adding new markets, forging stronger connections, and ensuring that Indian products become accessible to more customers worldwide. This is our daily operational mantra: to grow without boundaries.",
  },
];

export default function DrivesUsEveryday() {
  return (
    <div className="bg-white scroll-smooth md:scroll-auto">
      {/* Core Values Section */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-20">
            <span className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-1 rounded-full text-white font-medium text-sm mb-4 shadow-sm">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              What drives us every day
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              For Eximso, the everyday drive comes from its mission and vision—
              making global shopping seamless for consumers and businesses. The
              core motivations that push Eximso forward daily are:
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {coreValues.map((value) => (
              <div
                key={value.name}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md">
                  <value.icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {value.name}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
