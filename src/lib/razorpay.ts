import { toast } from "@/hooks/use-toast";
import api from "./api/axios.interceptor";

export function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

function displayGateway(order: any) {
  if (typeof window !== "undefined") {
    const options = {
      key: order.razorpayKeyId, // Replace with your Razorpay key_id
      amount: order.amount,
      currency: order.currency,
      name: "Eximso",
      description: "Please complete your payment",
      order_id: order.razorpayOrderId, // This is the order_id created in the backend
      callback_url: process.env.NEXT_PUBLIC_API_URL + "/checkout/success", // Your success URL
      prefill: {
        name: order.user.name,
        email: order.user.email,
        contact: order.user.phone,
      },
      theme: {
        color: "#7868ec",
      },
      handler: function (response: any) {
        api
          .post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
          .then((res) => res.data)
          .then((data) => {
            const query = new URLSearchParams({
              orderId: data.orders?.[0]?._id,
            }).toString();
            // console.log("query", data);
                        console.log("query", query);
            window.location.href = `/payment-success?${query}`;
          })
          .catch((error) => {
            console.error("Error:", error);
            toast({
              title: "Payment failed",
              description: "Please try again later",
              variant: "destructive",
            });
          });
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }
}

export function razorPay(order: any) {
  loadScript("https://checkout.razorpay.com/v1/checkout.js").then((res) => {
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }
    displayGateway(order);
  });
}
