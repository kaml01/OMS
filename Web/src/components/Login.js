import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 🔐 LOGIN API
  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        alert("Login Successful 🎉");
        navigate("/dashboard");
      } else {
        alert("Invalid credentials ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo + Title */}
        <div className="login-header">
          
         
        </div>

        {/* Welcome Text */}
        <h1 className="login-heading">Welcome Back</h1>
        <p className="login-text">
          Please enter your credentials to continue
        </p>

        {/* Username */}
        <label className="login-label">Username</label>
        <div className="login-input-box">
          <i className="fa fa-user"></i>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <label className="login-label">Password</label>
        <div className="login-input-box">
          <i className="fa fa-lock"></i>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

       
        {/* Button */}
        <button className="login-btn" onClick={handleLogin}>
          Sign In
        </button>
      </div>
    </div>
  );
}
