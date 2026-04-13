import React, { useEffect, useState } from "react";
import avatar from "../assets/avatar.jpg";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import { deleteUser, fetchAllUsers } from "../store/slices/adminSlice";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { UserPlus, X } from "lucide-react";

const Users = () => {
  const [page, setPage] = useState(1);
  const { loading, users, totalUsers } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [maxPage, setMaxPage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
  });

  useEffect(() => {
    dispatch(fetchAllUsers(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (totalUsers !== undefined) {
      const newMax = Math.ceil(totalUsers / 10);
      setMaxPage(newMax || 1);
    }
  }, [totalUsers]);

  useEffect(() => {
    if (maxPage && page > maxPage) {
      setPage(maxPage);
    }
  }, [maxPage, page]);

  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id, page));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await axiosInstance.post("/auth/admin/create-user", newUser);
      toast.success(res.data.message);
      setShowCreateModal(false);
      setNewUser({ name: "", email: "", password: "", role: "User" });
      dispatch(fetchAllUsers(page));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
        <div className="flex-1 md:p-6">
          <Header />
          <h1 className="text-2xl font-bold">All Users</h1>
          <p className="text-sm text-gray-600 mb-6">
            Manage all your website's users.
          </p>

          <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div
              className={`overflow-x-auto rounded-lg ${
                loading
                  ? "p-10 shadow-none"
                  : `${users && users.length > 0 && "shadow-lg"}`
              }`}
            >
              {loading ? (
                <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : users && users.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-blue-100 text-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left">Avatar</th>
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-left">Role</th>
                      <th className="py-3 px-4 text-left">Registered On</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <img
                            src={user?.avatar?.url || avatar}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </td>
                        <td className="px-3 py-4">{user.name}</td>
                        <td className="px-3 py-4">{user.email}</td>
                        <td className="px-3 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "Admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-4">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-white rounded-md cursor-pointer px-3 py-2 font-semibold bg-red-gradient hover:opacity-90"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <h3 className="text-2xl p-6 font-bold">No users found.</h3>
              )}
            </div>

            {!loading && users.length > 0 && (
              <div className="flex justify-center mt-6 gap-4">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">Page {page}</span>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={maxPage === page}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CREATE USER BUTTON */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300"
        title="Create New User"
      >
        <UserPlus size={20} />
      </button>

      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Create New User
            </h2>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password * (8-16 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder="Min 8 characters"
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {creating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;