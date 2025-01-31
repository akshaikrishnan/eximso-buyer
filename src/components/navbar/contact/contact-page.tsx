"use client"
import { Mail, MapPin, Phone } from 'lucide-react';
import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you, ${formData.firstName}! Your message has been sent.`);
  };
  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto shadow-lg rounded-lg overflow-hidden mt-8">
      {/* Contact Info */}
      <div className="w-full md:w-1/2 p-8 bg-gray-100">
        <h2 className="text-3xl font-bold mb-4">Get in touch</h2>
        <p className="text-gray-600 mb-6">
          Proin volutpat consequat porttitor cras nullam gravida at. Orci molestie a eu arcu.
        </p>
        <div className="space-y-4 text-gray-700">
          <p className="flex items-center gap-2">
            <MapPin className="text-gray-600" />
            <span className="font-semibold">Address:</span> 545 Mavis Island, Chicago, IL 99191
          </p>
          <p className="flex items-center gap-2">
            <Phone className="text-gray-600" />
            <span className="font-semibold">Phone:</span> +1 (555) 234-5678
          </p>
          <p className="flex items-center gap-2">
            <Mail className="text-gray-600" />
            <span className="font-semibold">Email:</span> hello@example.com
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="w-full md:w-1/2 p-8">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" className="w-1/2 p-3 border rounded" required />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" className="w-1/2 p-3 border rounded" required />
          </div>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded" required />
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" className="w-full p-3 border rounded" />
          <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" className="w-full p-3 border rounded h-24" required></textarea>

          {/* Button (Aligned Right) */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-eximblue-600 text-white py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:bg-eximblue-500 hover:scale-105 focus:ring-2 focus:ring-eximblue-400 focus:outline-none"
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
