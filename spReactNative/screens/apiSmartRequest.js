import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../config/api";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

api.interceptors.request.use(async (config) => {
  try {
    const userData = await AsyncStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const token = user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore, send without auth
  }
  return config;
});

export const createRepairRequest = async ({ deviceType, issueDescription, lat, lng }) => {
  const res = await api.post("/repair-requests", {
    deviceType,
    issueDescription,
    lat,
    lng,
  });
  return res.data.repairRequest;
};

export const getQuotationsByRequest = async (id) => {
  const res = await api.get(`/quotations/by-request/${id}`);
  return res.data.quotations;
};

