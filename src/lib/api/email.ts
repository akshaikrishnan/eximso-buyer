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
  const response = await api.post<EmailSubscribeResponse>(
    `${endpoints.emailSubscribe}`,
    data
  );
  return response.data;
};
