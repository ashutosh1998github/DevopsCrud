import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://localhost:5000"; // change if needed

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  // Edit modal state
  const [showEdit, setShowEdit] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");

  // Delete modal state
  const [showDelete, setShowDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUserName, setDeleteUserName] = useState("");

  const token = localStorage.getItem("token"); // make sure you saved it on login

  // Fetch all users (admin-only)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || `Failed: ${res.status}`);
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("No token found. Please login as admin.");
      setLoading(false);
      return;
    }
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Open edit modal with pre-filled values
  const openEdit = (user) => {
    setEditUserId(user._id || user.id);
    setEditName(user.name || "");
    setEditEmail(user.email || "");
    setEditPassword(""); // blank means "don't change"
    setShowEdit(true);
  };

  // Submit edit -> PUT /api/users/:id
  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: editName,
        email: editEmail,
      };
      if (editPassword.trim() !== "") {
        payload.password = editPassword;
      }

      const res = await fetch(`${API_BASE}/api/users/${editUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || `Failed: ${res.status}`);
      }

      const updated = await res.json();

      // Update user in local state
      setUsers((prev) =>
        prev.map((u) => (u._id === updated._id ? updated : u))
      );

      setShowEdit(false);
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  // Open delete modal
  const openDelete = (user) => {
    setDeleteUserId(user._id || user.id);
    setDeleteUserName(user.name || "");
    setShowDelete(true);
  };

  // Confirm delete -> DELETE /api/users/:id
  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/${deleteUserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || `Failed: ${res.status}`);
      }

      // Remove from local state
      setUsers((prev) => prev.filter((u) => u._id !== deleteUserId));
      setShowDelete(false);
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Admin Dashboard</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading users...</div>
      ) : (
        <div className="card">
          <div className="card-header">All Users</div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "30%" }}>Name</th>
                    <th style={{ width: "40%" }}>Email</th>
                    <th style={{ width: "30%" }} className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => openEdit(u)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => openDelete(u)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEdit && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={() => setShowEdit(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: 600, margin: "0 auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEdit(false)}
                />
              </div>
              <form onSubmit={submitEdit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      className="form-control"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-1">
                    <label className="form-label">
                      New Password (leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowEdit(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDelete && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={() => setShowDelete(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: 480, margin: "0 auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDelete(false)}
                />
              </div>
              <div className="modal-body">
                Are you sure you want to delete <strong>{deleteUserName}</strong>?
                This action cannot be undone.
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
