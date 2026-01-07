import React, { useState } from "react";
import { loginUser } from "../../api/auth.api";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";

function Signin({ switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      login(res.data.token);
      navigate("/home");
    } catch {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border rounded-2xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
        Welcome Back
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Login to continue applying for jobs
      </p>

      <input
        type="email"
        placeholder="Email address"
        className="w-full mb-4 rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-3 rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* LINKS */}
      <div className="flex justify-between text-sm mb-6">
        <button
          onClick={() => navigate("/forgot-password")}
          className="text-red-500 hover:underline"
        >
          Forgot password?
        </button>

        <button
          onClick={switchToSignup}
          className="text-blue-600 hover:underline"
        >
          Create account
        </button>
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-3 text-white font-medium
                   hover:bg-blue-700 transition disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </div>
  );
}

export default Signin;
