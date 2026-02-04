import { createContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const { getToken } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // setup axios interceptor

    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken({ skipCache: true });
          if (token) {
            console.log("AuthProvider: Token fetched successfully. Start:", token.substring(0, 15) + "...");
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
          } else {
            console.warn("AuthProvider: [AUTH ERROR] getToken() returned NULL. Is the user logged in?");
          }
        } catch (error) {
          if (error.message?.includes("auth") || error.message?.includes("token")) {
            toast.error("Authentication issue. Please refresh the page.");
          }
          console.log("Error getting token:", error);
        }
        return config;
      },
      (error) => {
        console.error("Axios request error:", error);
        return Promise.reject(error);
      }
    );

    setIsReady(true);

    // cleanup function to remove the interceptor, this is important to avoid memory leaks
    return () => axiosInstance.interceptors.request.eject(interceptor);
  }, [getToken]);

  if (!isReady) return null;

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}