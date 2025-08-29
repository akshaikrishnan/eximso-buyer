"use client";

import { useEffect } from "react";
import { getToken, onMessage, isSupported } from "firebase/messaging";
import { messaging } from "@/app/config/constants/services/push.service";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api/axios.interceptor";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/data/endpoints";

interface NotificationPayload {
  notification?: {
    title?: string;
    body?: string;
  };
  data?: {
    link?: string;
  };
  fcmOptions?: {
    link?: string;
  };
}

export default function PushNotificationHandler() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => api.get(endpoints.user).then((res) => res.data.result),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  useEffect(() => {
    const setupPushNotifications = async () => {
      try {
        console.log("[Push] Initializing push notifications...");

        // 1. Check if Firebase Messaging is supported
        const isFirebaseSupported = await isSupported();
        if (!isFirebaseSupported) {
          console.warn(
            "[Push] Firebase Messaging not supported in this browser"
          );
          return;
        }

        if (typeof window === "undefined" || !user?._id) {
          console.log("[Push] Window undefined or user not available");
          return;
        }

        // 2. Check service worker support
        if (!("serviceWorker" in navigator)) {
          console.warn("[Push] Service Worker not supported");
          toast({
            title: "Push notifications unavailable",
            description: "Your browser does not support service workers",
            variant: "destructive",
          });
          return;
        }

        // 3. Register service worker
        let registration;
        try {
          console.log("[Push] Registering service worker...");
          registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            {
              scope: "/firebase-cloud-messaging-push-scope",
            }
          );
          console.log("[Push] Service Worker registered:", registration);
        } catch (swError) {
          console.error("[Push] Service Worker registration failed:", swError);
          toast({
            title: "Push setup failed",
            description: "Could not register service worker",
            variant: "destructive",
          });
          return;
        }

        // 4. Request notification permission
        console.log("[Push] Requesting notification permission...");
        const permission = await Notification.requestPermission();
        console.log("[Push] Notification permission:", permission);

        if (permission !== "granted") {
          toast({
            title: "Notifications blocked",
            description: "Please enable notifications in your browser settings",
            variant: "destructive",
          });
          return;
        }

        // 5. Get FCM token
        console.log("[Push] Getting FCM token...");
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (!token) {
          console.warn("[Push] No registration token available.");
          toast({
            title: "Push setup failed",
            description: "Could not generate push token",
            variant: "destructive",
          });
          return;
        }

        console.log("[Push] FCM registration token:", token);

        // 6. Send token to your server
        try {
          console.log("[Push] Sending token to server...", {
            userId: user._id,
            token: token.substring(0, 10) + "...", // Log partial token
            role: user.role || "buyer",
          });

          const response = await api.post(endpoints.pushSubscribe, {
            userId: user._id,
            token,
            role: user.role || "buyer",
          });

          console.log("[Push] Token successfully sent to server:", response);
          toast({
            title: "Notifications enabled",
            description: "You will now receive push notifications",
            variant: "default",
          });
        } catch (apiError) {
          console.error("[Push] Failed to send token to server:", apiError);
          toast({
            title: "Subscription failed",
            description: "Could not register for push notifications",
            variant: "destructive",
          });
        }

        // 7. Set up message listener
        const handleMessage = (payload: NotificationPayload) => {
          console.log("[Push] Received message:", payload);

          const title = payload?.notification?.title || "New notification";
          const body = payload?.notification?.body || "You have a new message";
          const link = payload?.data?.link || payload?.fcmOptions?.link;

          toast({
            title,
            description: (
              <div className="w-full space-y-2">
                <p>{body}</p>
                {link && (
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() =>
                        window.open(link, "_blank", "noopener,noreferrer")
                      }
                      className="text-sm font-medium text-primary hover:text-primary/80 underline"
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            ),
          });
        };

        const unsubscribe = onMessage(messaging, handleMessage);

        return () => {
          try {
            console.log("[Push] Cleaning up message listener...");
            unsubscribe();
          } catch (cleanupError) {
            console.error(
              "[Push] Error cleaning up message listener:",
              cleanupError
            );
          }
        };
      } catch (error) {
        console.error("[Push] Setup failed:", error);
        toast({
          title: "Error setting up push notifications",
          description: "Failed to enable push notifications",
          variant: "destructive",
        });
      }
    };

    if (user?._id) {
      setupPushNotifications();
    }
  }, [user?._id, user?.role]);

  return null;
}
