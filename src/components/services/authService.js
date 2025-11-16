import axios from "axios";
import { buildApiUrl, API_ENDPOINTS } from "../../utils/apiConfig";

export const loginUser = async (payload) => {
  const res = await axios.post(buildApiUrl(API_ENDPOINTS.LOGIN), payload, {
    withCredentials: true,
  });

  return res.data.data.user;
};

export const logoutUser = async () => {
  return axios.post(buildApiUrl(API_ENDPOINTS.LOGOUT), {}, { withCredentials: true });
};

export const getLoggedInUser = async () => {
  const res = await axios.get(buildApiUrl(API_ENDPOINTS.GET_PROFILE), { withCredentials: true });
  return res.data.data;
};
