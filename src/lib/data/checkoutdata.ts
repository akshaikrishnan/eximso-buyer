export const sample = {
  paymentMethods: [
    {
      _id: 1,
      title: "RazorPay",
      description: "Supports UPI, Cards, Netbanking, Wallet",
      icon: "/images/common/razorpay.svg",
      isActive: true,
    },
    {
      _id: 2,
      title: "Paypal",
      description: "Pay with Paypal",
      icon: "/images/common/paypal.png",
      isActive: false,
    },
    {
      _id: 3,
      title: "Stripe",
      description: "Supports Credit Card & Debit Card",
      icon: "/images/common/stripe.webp",
      isActive: false,
    },
  ],
  shippimngMethods: [
    {
      _id: 1,
      title: "DHL",
      description: "Shipping Globally",
      subtitle: "$3.00",
      icon: "/images/common/dhl.png",
      isActive: true,
    },
    {
      _id: 2,
      title: "Fedex",
      description: "Currenty Not Available",
      icon: "/images/common/fedex.jpg",
      isActive: false,
    },
    {
      _id: 3,
      title: "India Post",
      description: "Currenty Not Available",
      icon: "/images/common/india-post.jpg",
      isActive: false,
    },
  ],
};
