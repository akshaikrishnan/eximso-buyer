"use client";

import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { subscribeEmail } from "@/lib/api/email";

interface SubscriptionFormValues {
  email: string;
}

export default function EmailSubscription() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SubscriptionFormValues>();

  const onSubmit = async (data: SubscriptionFormValues) => {
    try {
      await subscribeEmail(data);
      toast({
        title: "Subscribed successfully!",
        description: "You'll receive our updates soon.",
      });
      reset();
    } catch (error: any) {
      if (error.message === "Email already subscribed") {
        reset();
      } else {
        toast({
          title: "Subscription failed",
          description: "Please try again later.",
        });
      }
    }
  };

  return (
    <section className="bg-gray-50 py-6 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Container for heading + form */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Left: Heading + Subtext */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-gray-900">
              Get our updates for more subscribe
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Subscribe to our newsletter and stay updated.
            </p>
          </div>

          {/* Right: Email form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full max-w-md mt-3 sm:mt-0"
          >
            <input
              type="email"
              placeholder="Write your email here"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Please enter a valid email",
                },
              })}
              className="flex-1 rounded-l-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-l-none rounded-r-md bg-eximblue-600 px-5 py-2 text-white hover:bg-eximblue-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>

        {/* Error message below */}
        {errors.email && (
          <p className="text-sm text-red-600 text-center sm:text-right mt-2">
            {errors.email.message}
          </p>
        )}
      </div>
    </section>
  );
}
