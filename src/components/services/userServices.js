import axios from "axios";
import { buildApiUrl, API_ENDPOINTS } from "../../utils/apiConfig";

export const getAllUsers = async () => {
  const response = await axios.get(buildApiUrl(API_ENDPOINTS.GET_ALL_USERS), {
    withCredentials: true, // because you are using cookies
  });

  return response.data.data;
};
