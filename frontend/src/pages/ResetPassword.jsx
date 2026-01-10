import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submit = async () => {
    if (!password || !confirmPassword) return alert("Fill all fields");
    if (password !== confirmPassword) return alert("Passwords do not match");

    try {
      await api.post(`/api/auth/reset-password/${token}`, { password });
      alert("Password updated");
      navigate("/");
    } catch {
      alert("Invalid or expired link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-10 shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Set New Password
        </h2>

        <input
          type="password"
          placeholder="New password"
          className="w-full mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="w-full mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-white text-black py-3 rounded-xl hover:bg-slate-200 transition"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
