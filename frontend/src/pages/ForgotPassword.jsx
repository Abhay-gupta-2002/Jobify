import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!password || !confirmPassword) {
      alert("Fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/api/auth/reset-password/${token}`, { password });
      alert("Password updated successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid or expired link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Set New Password</h2>

        <input
          type="password"
          placeholder="New password"
          className="w-full border rounded-md p-3 mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="w-full border rounded-md p-3 mb-4"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
