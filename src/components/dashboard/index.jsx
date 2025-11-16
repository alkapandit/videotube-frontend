import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import EditUserModal from "./UpdateUser";

export default function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  console.log("location", location);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/users/allUsers",
        {
          headers: {
            Authorization: `Bearer ${location?.state?.token}`,
          },
        }
      );
      console.log("reponse", response);
      console.log("data", response?.data);
      setUsers(response?.data?.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUsers = async (userId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/users/delete/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${location?.state?.token}`,
          },
        }
      );

      console.log("Delete response:", response.data);
      fetchUsers();

      // return response.data;
    } catch (err) {
      console.error("❌ Delete failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUpdate = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
    );
  };

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

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div></div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users?.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
          >
            <img
              src={user.avatar || "https://via.placeholder.com/100"}
              alt={user.fullname}
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <h3 className="text-lg font-semibold">{user.fullname}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500">{user.username}</p>
            <div className="flex items-center justify-between w-full pt-3">
              <button
                className="text-white bg-green-900 py-1 px-5 rounded-md cursor-pointer"
                onClick={() => {
                  handleEditClick(user);
                }}
              >
                Edit
              </button>
              <button
                className="text-white bg-red-800 py-1 px-5 rounded-md cursor-pointer"
                onClick={() => {
                  deleteUsers(user?._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        token={location?.state?.token}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
