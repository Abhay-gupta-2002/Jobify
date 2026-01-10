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
    <div className="w-full max-w-md bg-black/70 backdrop-blur border border-white/10
    rounded-3xl p-10 shadow-2xl">
      <h2 className="text-3xl font-semibold tracking-tight text-white text-center mb-2">
        Welcome Back
      </h2>
      <p className="text-sm text-slate-400 text-center mb-6">
        Login to continue applying for jobs
      </p>

      <input
        type="email"
        placeholder="Email address"
        className="w-full mb-4 rounded-xl border border-white/10 bg-white/5
        px-4 py-3 text-white placeholder-slate-400
        focus:outline-none focus:ring-2 focus:ring-white/20"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-3 rounded-xl border border-white/10 bg-white/5
        px-4 py-3 text-white placeholder-slate-400
        focus:outline-none focus:ring-2 focus:ring-white/20"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex justify-between text-sm mb-6">
        <button
          onClick={() => navigate("/forgot-password")}
          className="text-slate-400 hover:text-white"
        >
          Forgot password?
        </button>

        <button
          onClick={switchToSignup}
          className="text-slate-400 hover:text-white"
        >
          Create account
        </button>
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full rounded-xl bg-white text-black py-3 font-medium
        hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </div>
  );
}

export default Signin;
