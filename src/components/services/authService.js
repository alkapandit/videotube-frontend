import axios from "axios";

const API_URL = "http://localhost:5000/api/";

export const loginUser = async (payload) => {
  const res = await axios.post(API_URL + "login", payload, {
    withCredentials: true,
  });

  return res.data.data.user;
};

export const logoutUser = async () => {
  return axios.post(API_URL + "logout", {}, { withCredentials: true });
};

export const getLoggedInUser = async () => {
  const res = await axios.get(API_URL + "me", { withCredentials: true });
  return res.data.data;
};
