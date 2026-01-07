import React, { useState } from "react";
import { registerUser } from "../../api/auth.api";

function Signup({ switchToSignin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password });
      alert("Signup successful");
      switchToSignin();
    } catch (err) {
      console.log(err);
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border rounded-2xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
        Create Account
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Start applying to jobs faster
      </p>

      <input
        placeholder="Full name"
        className="w-full mb-4 rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email address"
        className="w-full mb-4 rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-6 rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="button"
        onClick={handleSignup}
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-3 text-white font-medium
                   hover:bg-blue-700 transition disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      <p className="text-sm text-center text-gray-600 mt-4">
        Already have an account?{" "}
        <button
          onClick={switchToSignin}
          className="text-blue-600 hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default Signup;
