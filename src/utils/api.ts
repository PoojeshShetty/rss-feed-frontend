import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const get = async (url: string, config = {}) => {
  const response = await apiClient.get(url, config);
  return response.data;
};

export const post = async (url: string, data: unknown, config = {}) => {
  const response = await apiClient.post(url, data, config);
  return response.data;
};

export const put = async (url: string, data: unknown, config = {}) => {
  const response = await apiClient.put(url, data, config);
  return response.data;
};

export const del = async (url: string, config = {}) => {
  const response = await apiClient.delete(url, config);
  return response.data;
};
