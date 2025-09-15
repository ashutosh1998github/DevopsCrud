import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// 1. Zod schema for validation
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    cpassword: z.string(),
  })
  .refine((data) => data.password === data.cpassword, {
    path: ["cpassword"],
    message: "Passwords do not match",
  });

// Backend API
const API_BASE = "http://localhost:5000";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  // Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Form submit handler
  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("→ handleSubmit called");
  console.log("→ Fetching:", `${API_BASE}/api/users/register`);

  // ✅ Zod validation
  const result = registerSchema.safeParse(formData);
  if (!result.success) {
    const formattedErrors = {};
    result.error.issues.forEach((issue) => {
      formattedErrors[issue.path[0]] = issue.message;
    });
    setErrors(formattedErrors);
    return; // ⛔ stop here if validation fails
  }

  try {
    setErrors({});
    setLoading(true);

    console.log("✅ Register Data Submitted:", formData);

    // API request
    const res = await fetch(`${API_BASE}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.message || "❌ Something went wrong");
      return;
    }

    localStorage.setItem("token", data.token);

    toast.success("🎉 Registered successfully!");
    console.log("User registered:", data);

    // window.location.href = "/login"; 

    navigate('/login') // navigate to the login screen after the user is successfully registered.

  } catch (err) {
    console.error("⚠️ Unexpected error:", err);
    toast.error("⚠️ Unexpected error:", err)
    setLoading(false);
  }
};


  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-sm-6 offset-sm-3">
          <div className="card shadow">
            <div className="card-header">Signup</div>
            <div className="card-body">
              <form onSubmit={handleSubmit} noValidate>
                {/* Name */}
                <div>
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : formData.name ? "is-valid" : ""
                    }`}
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                {/* Email */}
                <div className="mt-2">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.email ? "is-invalid" : formData.email ? "is-valid" : ""
                    }`}
                    id="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Password */}
                <div className="mt-2">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : formData.password ? "is-valid" : ""
                    }`}
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mt-2">
                  <label htmlFor="cpassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className={`form-control ${
                      errors.cpassword
                        ? "is-invalid"
                        : formData.cpassword
                        ? "is-valid"
                        : ""
                    }`}
                    id="cpassword"
                    placeholder="Confirm your password"
                    value={formData.cpassword}
                    onChange={handleChange}
                  />
                  {errors.cpassword && (
                    <div className="invalid-feedback">{errors.cpassword}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3"
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Signup"}
                </button>
              </form>

              <p className="text-center mt-3">
                Already have an account? <a href="/login">Login</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
