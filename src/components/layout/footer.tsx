"use client";

import React from "react";
import { usePathname } from "next/navigation";
import IncentivesFooter from "./incentives-footer";
import EmailSubscription from "./home/email-subscription";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import Link from "next/link";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";

const footerNavigation = {
  customerService: [
    { name: "Cancellation & Return policy", href: "/cancellation" },
    { name: "News and updates", href: "/news" },
    { name: "Secure Payments", href: "/secure-payment" },
    { name: "What drives us everyday", href: "/drives-us-everyday" },
    { name: "Why Sell with Eximso", href: "/whysellwitheximso" },
  ],
  company: [
    { name: "About", href: "/about-us" },
    { name: "Mission and Vision", href: "/mission-vision" },
    { name: "Focus on both B2B & B2C", href: "/B2B-B2C" },
    { name: "Contact Us", href: "/contact" },
  ],
  legal: [
    { name: "Post a Requirement", href: "/post-requirements" },
    { name: "FAQ", href: "/FAQ" },
    { name: "Terms & Conditions", href: "/policy/terms-and-conditions" },
    { name: "Privacy Policy", href: "/policy/privacy-policy" },
    { name: "Shipping Policy", href: "/policy/shipping-policy" },
  ],
  social: [
    {
      name: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61579842334275",
      icon: FaFacebookF,
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@eximso",
      icon: FaYoutube,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/eximso_official/",
      icon: FaInstagram,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/eximso/?viewAsMember=true",
      icon: FaLinkedinIn,
    },
  ],
  bottomLinks: [
    // {
    //   name: "Sitemap",
    //   href: "/sitemap.xml",
    // },
    {
      name: "Become a Seller",
      href: process.env.NEXT_PUBLIC_SELLER_URL + "/auth/login",
    },
  ],
};

export default function Footer() {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/" && <IncentivesFooter />}
      {pathname === "/" && <EmailSubscription />}

      <footer aria-labelledby="footer-heading" className="bg-white">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>

        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200">
            {/* Grid Columns */}
            <div className="mt-16 flex justify-center">
              <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 px-4">
                {/* Customer Service */}
                <div className="flex flex-col items-start text-left">
                  <h3 className="text-sm font-medium text-gray-900">
                    Customer Service
                  </h3>
                  <ul role="list" className="mt-2 space-y-3">
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
                  <ul role="list" className="mt-2 space-y-3">
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
                  <ul role="list" className="mt-2 space-y-3">
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

                {/* Social */}
                <div className="flex flex-col items-start text-left">
                  <h3 className="text-sm font-medium text-gray-900">
                    Follow Us
                  </h3>
                  <ul role="list" className="mt-2 space-y-3">
                    {footerNavigation.social.map((item) => (
                      <li key={item.name} className="text-sm">
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-500 hover:text-gray-600"
                        >
                          <item.icon className="h-5 w-5 mr-2" />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ⭐ IMAGE COLUMN ⭐ */}
                <div className="hidden lg:flex justify-start lg:justify-center items-start">
                  <Link
                    href={process.env.NEXT_PUBLIC_SELLER_URL + "/auth/login"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/images/common/footerImg.jpg"
                      alt="Footer Image"
                      className="w-full  h-auto object-contain rounded-md"
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* ⭐ MOBILE SELLER BUTTON */}
            <div className="w-full mt-10 mb-6 flex justify-center md:hidden">
              <Link
                href={process.env.NEXT_PUBLIC_SELLER_URL + "/auth/login"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-eximblue-600 flex items-center gap-2 rounded-xl px-6 py-3 text-white font-medium shadow-md"
              >
                <BuildingStorefrontIcon className="w-6 h-6" />
                Become a Seller
              </Link>
            </div>

            {/* Bottom Section */}
            <div className="mt-10 md:flex md:items-center md:justify-between">
              <p className="text-sm text-gray-500 text-center md:text-left">
                &copy; {new Date().getFullYear()} All Rights Reserved |
                Eximso.com
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
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
