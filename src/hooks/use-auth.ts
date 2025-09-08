import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useState, useEffect } from "react";

interface User {
  // Define the structure of your user data
}

export const useAuth = (): {
  user: User | null;
  isLoggedIn: boolean;
  setDeviceToken: (token: string) => void;
} => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (token) {
      setIsLoggedIn(true);
      api
        .get(endpoints.user)
        .then((res) => {
          if (res.data.errorCode === 0) {
            setUser(res.data.result);
          }
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          // Handle potential errors gracefully (e.g., logout?)
        });
    }

    const deviceToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)device_token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (!deviceToken) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 399); // Expires in 400 days
      const token = btoa(
        generateUUID() +
          Date.now().toLocaleString() +
          navigator.userAgent +
          Math.random()
      );
      document.cookie = `device_token=${token}; expires=${expirationDate.toUTCString()}; path=/`;
    }
  }, []);

  const setDeviceToken = (token: string) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 399); // Expires in 400 days
    document.cookie = `device_token=${token}; expires=${expirationDate.toUTCString()}; path=/`;
  };

  return { user, isLoggedIn, setDeviceToken };
};
