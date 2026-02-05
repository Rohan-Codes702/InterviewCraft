import { createContext, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const { getToken } = useAuth();

  useEffect(() => {
    // setup axios interceptor
    console.log("[AuthProvider] Setting up axios interceptor...");

    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          console.log("[AuthProvider] Request interceptor triggered for:", config.url);
          
          // Get Clerk token - asks for a JWT token for API access
          const token = await getToken();
          console.log("[AuthProvider] getToken() returned:", {
            hasToken: !!token,
            tokenLength: token?.length,
            tokenStart: token ? token.substring(0, 30) + "..." : "null"
          });
          
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("[AuthProvider] Authorization header set for request:", {
              url: config.url,
              headerSet: !!config.headers.Authorization,
              headerStart: config.headers.Authorization ? config.headers.Authorization.substring(0, 30) + "..." : null
            });
          } else {
            console.log("[AuthProvider] WARNING: No token available!");
          }
        } catch (error) {
          console.error("[AuthProvider] Error in request interceptor:", error);
          if (error.message?.includes("auth") || error.message?.includes("token")) {
            toast.error("Authentication issue. Please refresh the page.");
          }
        }
        return config;
      },
      (error) => {
        console.error("[AuthProvider] Axios request error:", error);
        return Promise.reject(error);
      }
    );

    console.log("[AuthProvider] Interceptor registered, id:", interceptor);
    
    // cleanup function to remove the interceptor, this is important to avoid memory leaks
    return () => {
      console.log("[AuthProvider] Removing interceptor");
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, [getToken]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}