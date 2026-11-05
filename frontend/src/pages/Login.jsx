import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.identifier.trim() || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login({
        email: form.identifier.includes("@") ? form.identifier.trim() : undefined,
        username: !form.identifier.includes("@") ? form.identifier.trim() : undefined,
        password: form.password,
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
      <div className="max-w-md w-full border border-neutral-800 rounded-2xl p-8 bg-black">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-black text-2xl mb-4">
            Y
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to YuBu</h1>
          <p className="text-sm text-neutral-500 mt-1">Peer resume reviews for developers</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/30 border border-red-900/50 text-red-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Email or Username
            </label>
            <input
              type="text"
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              placeholder="Username or email"
              className="w-full px-4 py-3 bg-black border border-neutral-800 focus:border-white focus:outline-none rounded-xl text-white placeholder-neutral-600 text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              className="w-full px-4 py-3 bg-black border border-neutral-800 focus:border-white focus:outline-none rounded-xl text-white placeholder-neutral-600 text-sm transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white hover:bg-neutral-200 disabled:opacity-50 text-black font-bold rounded-full text-sm transition mt-2"
          >
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-white hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
