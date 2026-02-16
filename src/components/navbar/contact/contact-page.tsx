"use client";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiUser,
  HiChatAlt2,
  HiClock,
  HiExternalLink,
  HiSparkles,
} from "react-icons/hi";
import PhoneNumberInput, { validatePhoneByCountry } from "@/components/ui/phone-number-input";

interface FormInputs {
  firstName: string;
  email: string;
  phone?: string;
  message: string;
}

const contactMethods = [
  {
    title: "Call our team",
    description: "+91 90378 50541",
    icon: HiPhone,
    href: "tel:+919037850541",
  },
  {
    title: "Email support",
    description: "contact@eximso.com",
    icon: HiMail,
    href: "mailto:contact@eximso.com",
  },
  {
    title: "Visit us",
    description:
      "No 15/1031, PM Kareem Centre, Athani Junction, Wonderla Road, Kakkanad, Kerala, India 682030",
    icon: HiLocationMarker,
    href: "https://maps.google.com/?q=PM+Kareem+Centre+Athani+Junction+Wonderla+Road+Kakkanad",
  },
];

const helpfulLinks = [
  { label: "Shipping & Delivery Guide", href: "/FAQ" },
  { label: "Cancellation & Refund Policy", href: "/cancellation" },
  { label: "Why Sell With Eximso", href: "/whysellwitheximso" },
  { label: "Secure Payment Overview", href: "/secure-payment" },
];

function Contact() {
  const [showHours, setShowHours] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = () => {
    alert("Thank you! Your message has been sent.");
    reset();
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <section className="text-center space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-700">
            <HiSparkles />
            We are here to help
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Let’s craft the right solution together</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Share your goals, request a callback, or drop us a quick note. Our specialists respond within one business day and tailor
            the conversation to your business needs.
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {contactMethods.map(({ title, description, icon: Icon, href }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-indigo-50 p-3 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </div>
                <HiExternalLink className="h-5 w-5 text-indigo-300 transition-opacity group-hover:opacity-100 opacity-0" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
            </Link>
          ))}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-5 gap-10 items-start">
          <div className="xl:col-span-3 rounded-3xl bg-white/90 shadow-lg ring-1 ring-indigo-50">
            <div className="border-b border-indigo-50 px-8 py-6">
              <h2 className="text-2xl font-semibold text-gray-900">Tell us about your project</h2>
              <p className="mt-2 text-sm text-gray-600">
                Fill in the form and we will align you with the right specialist. Prefer a call? Choose the phone option above and we will schedule one instantly.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8 space-y-6">
              {/* First Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">First Name</label>
                <div className="relative flex items-center">
                  <HiUser className="absolute left-4 text-gray-400 text-xl" />
                  <input
                    type="text"
                    {...register("firstName", { required: "First name is required" })}
                    placeholder="Enter your first name"
                    className="w-full rounded-xl border border-gray-200 bg-white p-4 pl-12 shadow-xs focus:border-indigo-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <div className="relative flex items-center">
                  <HiMail className="absolute left-4 text-gray-400 text-xl" />
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, message: "Invalid email format" },
                    })}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-gray-200 bg-white p-4 pl-12 shadow-xs focus:border-indigo-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Phone (optional)</label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    validate: (value) => !value || validatePhoneByCountry(value, "IN") || "Invalid phone number",
                  }}
                  render={({ field }) => (
                    <PhoneNumberInput
                      value={field.value || ""}
                      onChange={(phone) => field.onChange(phone)}
                      onBlur={field.onBlur}
                      placeholder="Enter your phone number"
                      containerClassName="items-center"
                      inputClassName="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-xs focus:border-indigo-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                      error={!!errors.phone}
                    />
                  )}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <div className="relative">
                  <HiChatAlt2 className="absolute left-4 top-4 text-gray-400 text-xl" />
                  <textarea
                    {...register("message", { required: "Message is required" })}
                    placeholder="Type your message"
                    className="w-full h-32 rounded-xl border border-gray-200 bg-white p-4 pl-12 shadow-xs focus:border-indigo-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">We respond within one business day.</p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-500 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          <div className="xl:col-span-2 space-y-8">
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 p-[1px] shadow-lg">
              <div className="rounded-3xl bg-white p-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Support Availability</h3>
                  <button
                    type="button"
                    onClick={() => setShowHours((prev) => !prev)}
                    aria-expanded={showHours}
                    aria-controls="support-schedule"
                    className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full px-3 py-1 transition-colors"
                  >
                    <HiClock className="h-4 w-4" />
                    {showHours ? "Hide" : "View"} schedule
                  </button>
                </div>

                {showHours && (
                  <div
                    id="support-schedule"
                    className="mt-6 space-y-3 text-sm text-gray-700 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <p className="leading-relaxed">
                      We provide 24/7 support, 365 days a year.
                    </p>
                    <p className="leading-relaxed">
                      Whether it&apos;s weekdays, weekends, or public holidays — we&apos;re always here to assist you.
                    </p>
                  </div>
                )}

                <p className="mt-6 text-sm text-gray-600 leading-relaxed">
                  Need immediate help? Call us and choose the emergency support option to connect with our on-call team.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-indigo-100 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Helpful resources</h3>
              <p className="mt-2 text-sm text-gray-600">
                Explore guides and policies curated by our specialists to help you get started faster.
              </p>
              <ul className="mt-6 space-y-3">
                {helpfulLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="group flex items-center justify-between rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-indigo-600 transition-colors hover:border-indigo-100 hover:bg-indigo-50"
                    >
                      {label}
                      <HiExternalLink className="h-4 w-4 opacity-60 transition group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-3xl shadow-lg">
              <iframe
                title="Eximso office location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.2838970320608!2d76.39208667610496!3d10.01208567408933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d97981160f7%3A0x9dd3045f829ec3cc!2sWonderla%20Rd%2C%20Pallikkara%2C%20Kochi%2C%20Kerala%20682016!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="h-64 w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact;
