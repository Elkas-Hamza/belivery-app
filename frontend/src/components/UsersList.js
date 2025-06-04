import React, { useState, useEffect } from "react";
import api from "../services/api";
import UserProfileModal from "./UserProfileModal";
import "./AdminDashboard.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Use a setTimeout to give backend a chance to initialize
      setTimeout(async () => {
        try {
          const response = await api.get("/dev/users");
          setUsers(response.data);
          setError(null);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching users:", error);
          setError("Failed to load users. Please try again later.");

          // Fallback to mock data if API fails
          setUsers([
            {
              id: 1,
              name: "Mohammed Alami",
              email: "mohammed@example.com",
              role: "user",
              created_at: "2025-04-15T08:30:00",
              profile_image: null,
            },
            {
              id: 2,
              name: "Fatima Benali",
              email: "fatima@example.com",
              role: "user",
              created_at: "2025-04-20T10:15:00",
              profile_image: null,
            },
            {
              id: 3,
              name: "Admin User",
              email: "admin@example.com",
              role: "admin",
              created_at: "2025-03-10T09:00:00",
              profile_image: null,
            },
          ]);
          setLoading(false);
        }
      }, 1000); // 1-second delay to allow backend changes to apply
    } catch (error) {
      console.error("Error in fetch operation:", error);
      setLoading(false);
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });

      // Update local state to reflect the change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="admin-section">
        <h2>User Management</h2>
        <p>Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-section">
        <h2>User Management</h2>
        <p className="error-message">{error}</p>
        <button onClick={fetchUsers} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <h2>User Management</h2>

      <div className="users-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <div className="user-name-cell">
                    <div className="user-avatar">
                      {user.profile_image && !imageErrors[user.id] ? (
                        <img
                          src={user.profile_image}
                          alt={user.name}
                          onError={() =>
                            setImageErrors((prev) => ({
                              ...prev,
                              [user.id]: true,
                            }))
                          }
                          onLoad={() =>
                            setImageErrors((prev) => ({
                              ...prev,
                              [user.id]: false,
                            }))
                          }
                        />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleUserRoleChange(user.id, e.target.value)
                    }
                    className="role-select"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => setSelectedUser(user.id)}
                    >
                      View
                    </button>
                    <button className="edit-btn">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <UserProfileModal
          userId={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UsersList;
