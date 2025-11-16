import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/video-logo.png";

function Navbar() {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${location?.state?.token}`,
          },
        }
      );

      console.log("Logout response:", response.data);
      alert("Logged out successfully!");

      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <img src={logo} alt="logo" />
      </div>
      <h2 className="text-3xl font-bold mb-6 text-center"> Dashboard</h2>
      <div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
