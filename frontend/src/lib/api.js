import {axiosInstance} from "./axios";

export async function getStreamToken(clerkToken) {
    try {
        console.log("Calling getStreamToken API...");
        // The Authorization header is now handled globally by the AuthProvider interceptor
        const response = await axiosInstance.get("/chat/token");
        console.log("getStreamToken API Success:", !!response.data.token);
        return response.data.token;
    } catch (error) {
        console.error("getStreamToken API Error:", error.response?.status, error.response?.data || error.message);
        throw error;
    }
}