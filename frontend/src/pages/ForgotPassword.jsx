import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim()) {
      alert("Enter your email address");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      alert("Reset link sent to your email");
      setEmail("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-2xl font-semibold">Forgot Password</h2>
        <p className="mb-4 text-sm text-slate-500">
          Enter your account email and we will send you a reset link.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="mb-4 w-full rounded-md border p-3"
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full rounded-md bg-black py-3 text-white transition hover:bg-gray-800 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <Link to="/" className="mt-4 inline-block text-sm text-blue-600 underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
