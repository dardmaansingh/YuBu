import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName.trim() || !form.username.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("fullName", form.fullName.trim());
      data.append("username", form.username.trim());
      data.append("email", form.email.trim());
      data.append("password", form.password);
      if (avatar) data.append("avatar", avatar);

      await register(data);
      await login({ email: form.email.trim(), password: form.password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Create your account</h1>
          <p className="text-sm text-neutral-500 mt-1">Join the YuBu peer review community</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/30 border border-red-900/50 text-red-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Full name"
              className="w-full px-4 py-3 bg-black border border-neutral-800 focus:border-white focus:outline-none rounded-xl text-white placeholder-neutral-600 text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Username"
              className="w-full px-4 py-3 bg-black border border-neutral-800 focus:border-white focus:outline-none rounded-xl text-white placeholder-neutral-600 text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email address"
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
              placeholder="Password (min. 6 characters)"
              className="w-full px-4 py-3 bg-black border border-neutral-800 focus:border-white focus:outline-none rounded-xl text-white placeholder-neutral-600 text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Profile Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              className="w-full text-xs text-neutral-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white hover:bg-neutral-200 disabled:opacity-50 text-black font-bold rounded-full text-sm transition mt-2"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:underline font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
