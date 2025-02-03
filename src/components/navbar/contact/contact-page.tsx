"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { HiMail, HiPhone, HiLocationMarker, HiUser, HiChatAlt2 } from "react-icons/hi";

// Define the validation schema using yup
const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10,14}$/, "Invalid phone number")
    .notRequired(),
  message: yup.string().required("Message is required"),
});

function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = () => {
    alert(`Thank you, Your message has been sent successfully`);
    reset(); // Clears the form after submission
  };

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto overflow-hidden mt-8 gap-12">
      {/* Contact Info */}
      <div className="w-full md:w-1/2 p-8">
        <h2 className="text-5xl font-bold mb-9">Get in touch</h2>
        <p className="text-gray-600 mb-6">
          Proin volutpat consequat porttitor cras nullam gravida at. Orci molestie a eu arcu.
        </p>
        <div className="space-y-7 text-gray-700">
          <p className="flex items-center gap-3">
            <HiLocationMarker className="text-gray-600 text-xl" />
            <span className="font-semibold">Address:</span> 545 Mavis Island, Chicago, IL 99191
          </p>
          <p className="flex items-center gap-3">
            <HiPhone className="text-gray-600 text-xl" />
            <span className="font-semibold">Phone :</span> +1 (555) 234-5678
          </p>
          <p className="flex items-center gap-3">
            <HiMail className="text-gray-600 text-xl" />
            <span className="font-semibold">Email:</span> hello@example.com
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="w-full md:w-1/2 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name */}
          <div className="relative">
            <HiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              {...register("firstName")}
              placeholder="First name"
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg transition-all duration-300"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <HiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="email"
              {...register("email")}
              placeholder="Email"
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg transition-all duration-300"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Phone (Optional) */}
          <div className="relative">
            <HiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="tel"
              {...register("phone")}
              placeholder="Phone number"
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg transition-all duration-300"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

          {/* Message */}
          <div className="relative">
            <HiChatAlt2 className="absolute left-4 top-4 text-gray-400 text-xl" />
            <textarea
              {...register("message")}
              placeholder="Message"
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg transition-all duration-300"
            />
            {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:bg-indigo-500 hover:scale-105 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
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
