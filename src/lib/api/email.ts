import api from "./axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";

export interface EmailSubscribeRequest {
  email: string;
}

export interface EmailSubscribeResponse {
  success: boolean;
  message: string;
}

export const subscribeEmail = async (
  data: EmailSubscribeRequest
): Promise<EmailSubscribeResponse> => {
  try {
    const response = await api.post<EmailSubscribeResponse>(
      `${endpoints.emailSubscribe}`,
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error("Email already subscribed");
    }
    throw error;
  }
};
