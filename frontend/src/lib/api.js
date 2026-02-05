import {axiosInstance} from "./axios";

export async function testDebugAuth() {
    try {
        console.log("[TEST] Calling /api/chat/debug-auth...");
        const response = await axiosInstance.get("/chat/debug-auth");
        console.log("[TEST] Debug auth response:", response.data);
        return response.data;
    } catch (error) {
        console.error("[TEST] Debug auth error:", error.response?.data || error.message);
        throw error;
    }
}

export async function testHealth() {
    try {
        console.log("[TEST] Calling /api/health...");
        const response = await axiosInstance.get("/health");
        console.log("[TEST] Health check response:", response.data);
        return response.data;
    } catch (error) {
        console.error("[TEST] Health check error:", error.message);
        throw error;
    }
}

export async function getStreamToken(clerkToken) {
    try {
        console.log("[API] Calling getStreamToken API...");
        console.log("[API] Current axios defaults:", {
            baseURL: axiosInstance.defaults.baseURL,
            headers: axiosInstance.defaults.headers
        });
        
        const response = await axiosInstance.get("/chat/token");
        
        console.log("[API] getStreamToken Response:", {
            status: response.status,
            hasToken: !!response.data.token,
            tokenStart: response.data.token ? response.data.token.substring(0, 30) + "..." : null
        });
        
        return response.data; // Return the entire object { token: "..." }
    } catch (error) {
        console.error("[API] getStreamToken Error - Full Details:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            message: error.response?.data?.message,
            reason: error.response?.data?.reason,
            debug: error.response?.data?.debug,
            requestHeaders: error.config?.headers,
            responseHeaders: error.response?.headers
        });
        throw error;
    }
}