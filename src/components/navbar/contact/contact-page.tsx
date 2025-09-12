"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { HiMail, HiPhone, HiLocationMarker, HiUser, HiChatAlt2 } from "react-icons/hi";

interface FormInputs {
  firstName: string;
  email: string;
  phone?: string;
  message: string;
}

function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = () => {
    alert("Thank you! Your message has been sent.");
    reset();
  };

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto mt-8 gap-12 px-4">
      {/* Contact Info */}
      <div className="w-full md:w-1/2 p-6">
        <h2 className="text-5xl font-bold mb-9">Get in touch</h2>
        <div className="space-y-6 text-gray-700">
          <p className="flex items-start gap-3">
            <HiLocationMarker className="text-gray-400 text-2xl flex-shrink-0 mt-1" />
            <span>
              <span className="font-semibold">Address:</span> No 15/1031, PM KAREEM CENTRE, ATHANI JUNCTION, WONDERLA
              ROAD, KAKKANAD, ERNAKULAM, KERALA PIN 682030, INDIA
            </span>
          </p>
          <p className="flex items-center gap-3">
            <HiPhone className="text-gray-400 text-2xl flex-shrink-0" />
            <span>
              <span className="font-semibold">Phone:</span> +91 90378 50541
            </span>
          </p>
          <p className="flex items-center gap-3">
            <HiMail className="text-gray-400 text-2xl flex-shrink-0" />
            <span>
              <span className="font-semibold">Email:</span> contact@eximso.com
            </span>
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="w-full md:w-1/2 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">First Name</label>
            <div className="relative flex items-center">
              <HiUser className="absolute left-4 text-gray-400 text-xl" />
              <input
                type="text"
                {...register("firstName", { required: "First name is required" })}
                placeholder="Enter your first name"
                className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
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
                className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone (optional)</label>
            <div className="relative flex items-center">
              <HiPhone className="absolute left-4 text-gray-400 text-xl" />
              <input
                type="tel"
                {...register("phone", {
                  pattern: { value: /^[0-9]{10,14}$/, message: "Invalid phone number" },
                })}
                placeholder="Enter your phone number"
                className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>
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
                className="w-full p-4 pl-12 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-500 hover:scale-105 transition-all duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact;
