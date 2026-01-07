import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    if (!password || !confirmPassword) {
      alert("Fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.post(`/api/auth/reset-password/${token}`, { password });
      alert("Password updated successfully");
      navigate("/");
    } catch (err) {
      alert(
        err.response?.data?.message || "Invalid or expired reset link"
      );
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[420px] p-8 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">
          Set New Password
        </h2>

        <input
          type="password"
          placeholder="New password"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="w-full p-3 border rounded mb-4"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-3 rounded"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
