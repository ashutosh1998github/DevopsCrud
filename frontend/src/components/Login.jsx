import React, { useState } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// 1. Create Zod schema for login
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

const API_BASE = "http://localhost:5000"; // ✅ backend URL

const Login = () => {
  // 2. State for form inputs
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  // 3. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 4. Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate input with Zod
      loginSchema.parse(formData);
      setErrors({}); // clear frontend validation errors
      setServerError("");

      // ✅ Call backend API
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // throw new Error(data.message || "Login failed");
        toast.error(data.message || "Login failed");
      }

      // ✅ Save token to localStorage
      localStorage.setItem("token", data.token);

      toast.success("✅ Login successful!");
      window.location.href = "/admin"; // redirect to admin dashboard

    } catch (err) {
      if (err.errors) {
        // Format Zod errors
        const formattedErrors = {};
        err.errors.forEach((error) => {
          formattedErrors[error.path[0]] = error.message;
        });
        setErrors(formattedErrors);
      } else {
        setServerError(err.message);
        toast.error(err.message)
      }
    }
  };

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-sm-6 offset-sm-3">
          <div className="card">
            <div className="card-header d-flex justify-content-center"><h3>Login</h3></div>
            <div className="card-body">
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}
              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.email ? "is-invalid" : formData.email ? "is-valid" : ""
                    }`}
                    id="email"
                    placeholder="Enter Your Email"
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
                    placeholder="Enter Your Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Login
                </button>
              </form>

              <p className="text-center mt-3">
                Don’t have an account? <a href="/register">Create Account</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
