import { axiosInstance } from "./axios";

export async function getStreamToken() {
  try {
    const response = await axiosInstance.get("/chat/token");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Unauthorized: Please log in again.");
    }
    throw error;
  }
}
