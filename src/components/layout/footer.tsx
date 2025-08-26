import React from "react";
import IncentivesFooter from "./incentives-footer";

const footerNavigation = {
  customerService: [
    { name: "Cancellation & Return policy", href: "/cancellation" },
    { name: "News and updates", href: "#" },
    { name: "Secure Payments", href: "/secure-payment" },
    { name: "What drives us everyday", href: "/drives-us-everyday" },
    { name: "Why Sell with Eximso", href: "/whysellwitheximso" },
   
  ],
  company: [
    { name: "About", href: "/about-us" },
    { name: "Mission and Vision", href: "/mission-vision" },
    { name: "How do we work", href: "#" },
    { name: "Focus on both B2B & B2C", href: "/B2B-B2C" },
    { name: "Contact Us", href: "/contact" },
  ],
  legal: [
    { name: "Careers", href: "#" },
    { name: "FAQ", href: "/FAQ" },
    { name: "Terms & Conditions", href: "/policy/terms-and-conditions" },
    { name: "Privacy Policy", href: "/policy/privacy-policy" },
    { name: "Return Policy", href: "/policy/return-policy" },
    { name: "Shipping Policy", href: "/policy/shipping-policy" },
  ],
  bottomLinks: [
    { name: "Accessibility", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
};

export default function Footer() {
  return (
    <>
      <IncentivesFooter />
      <footer aria-labelledby="footer-heading" className="bg-white">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200">
            {/* <div className="flex justify-center">
              <img
                src="/images/common/logo.png
                "
                alt="Eximso"
                className="h-8 w-auto"
              />
            </div> */}

            {/* Centered Grid Columns */}
            <div className="mt-16 flex justify-center">
              <div className="grid w-full max-w-6xl  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
                {/* Customer Service */}
               <div className="flex flex-col items-start text-left">
                 <h3 className="text-sm font-medium text-gray-900">
                    Customer Service
                      </h3>
                       <ul role="list" className="mt-6 space-y-4">
                          {footerNavigation.customerService.map((item) => (
                             <li key={item.name} className="text-sm">
                                <a
                                  href={item.href}
                                 className="text-gray-500 hover:text-gray-600"
                                 >
                             {item.name}
                           </a>
                         </li>
                        ))}
                    </ul>
                </div>


                {/* Company */}
                <div className="flex flex-col items-start text-left">
                  <h3 className="text-sm font-medium text-gray-900">Company</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.company.map((item) => (
                      <li key={item.name} className="text-sm">
                        <a
                          href={item.href}
                          className="text-gray-500 hover:text-gray-600"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal */}
                <div className="flex flex-col items-start text-left">
                  <h3 className="text-sm font-medium text-gray-900">Legal</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.legal.map((item) => (
                      <li key={item.name} className="text-sm">
                        <a
                          href={item.href}
                          className="text-gray-500 hover:text-gray-600"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Bottom Section */}
            <div className="mt-10 md:flex md:items-center md:justify-between">
              <p className="text-sm text-gray-500 text-center md:text-left">
                &copy; 2025 All Rights Reserved
              </p>
              <div className="mt-4 flex items-center justify-center md:mt-0">
                <div className="flex space-x-8">
                  {footerNavigation.bottomLinks.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-sm text-gray-500 hover:text-gray-600"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="ml-6 border-l border-gray-200 pl-6">
                  <a
                    href="#"
                    className="flex items-center text-gray-500 hover:text-gray-600"
                  >
                    <img
                      src="https://tailwindui.com/img/flags/flag-canada.svg"
                      alt=""
                      className="w-5 h-auto flex-shrink-0"
                    />
                    <span className="ml-3 text-sm">Change</span>
                    <span className="sr-only">location and currency</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}