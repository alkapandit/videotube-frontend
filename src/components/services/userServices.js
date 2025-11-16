import axios from "axios";

export const getAllUsers = async () => {
  const response = await axios.get("http://localhost:5000/api/users", {
    withCredentials: true, // because you are using cookies
  });

  return response.data.data;
};
