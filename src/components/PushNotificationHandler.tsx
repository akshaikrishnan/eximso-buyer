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
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const setupPushNotifications = async () => {
      try {
        const isFirebaseSupported = await isSupported();
        if (!isFirebaseSupported) return;

        if (typeof window === "undefined" || !user?._id) return;

        if (!("serviceWorker" in navigator)) {
          toast({
            title: "Push notifications unavailable",
            description: "Your browser does not support service workers",
          });
          return;
        }

        let registration;
        try {
          registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            { scope: "/firebase-cloud-messaging-push-scope" }
          );
        } catch {
          toast({
            title: "Push setup failed",
            description: "Could not register service worker",
          });
          return;
        }

        const permission = await Notification.requestPermission();

        // DAILY memory for "blocked"
        if (permission !== "granted") {
          const STORAGE_LAST_BLOCK = "push:lastBlockedToast";
          const today = new Date().toDateString();
          const blockedShownToday =
            localStorage.getItem(STORAGE_LAST_BLOCK) === today;

          if (!blockedShownToday) {
            toast({
              title: "Notifications blocked",
              description: "Please enable notifications in your browser settings",
            });
            localStorage.setItem(STORAGE_LAST_BLOCK, today);
          }

          return;
        }

        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (!token) {
          toast({
            title: "Push setup failed",
            description: "Could not generate push token",
          });
          return;
        }

        try {
          await api.post(endpoints.pushSubscribe, {
            userId: user._id,
            token,
            role: user.role || "buyer",
          });

          // DAILY memory for "enabled"
          const STORAGE_LAST_NOTIF = "push:lastToast";
          const today = new Date().toDateString();
          const shownToday =
            localStorage.getItem(STORAGE_LAST_NOTIF) === today;

          if (!shownToday) {
            toast({
              title: "Notifications enabled",
              description: "You will now receive push notifications",
            });

            localStorage.setItem(STORAGE_LAST_NOTIF, today);
          }
        } catch {
          toast({
            title: "Subscription failed",
            description: "Could not register for push notifications",
          });
        }

        const handleMessage = (payload: NotificationPayload) => {
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
        return () => unsubscribe();
      } catch {
        toast({
          title: "Error setting up push notifications",
          description: "Failed to enable push notifications",
        });
      }
    };

    if (user?._id) {
      setupPushNotifications();
    }
  }, [user?._id, user?.role]);

  return null;
}
