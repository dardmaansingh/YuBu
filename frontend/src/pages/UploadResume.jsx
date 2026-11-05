import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export const UploadResume = () => {
  const [form, setForm] = useState({ title: "", description: "" });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.toLowerCase().endsWith(".pdf")) {
        setError("Only PDF files are supported");
        setFile(null);
        return;
      }
      setError("");
      setFile(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Please provide a title");
      return;
    }

    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    const data = new FormData();
    data.append("title", form.title.trim());
    data.append("description", form.description.trim());
    data.append("pdf", file);

    setLoading(true);
    try {
      await api.post("/resumes", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/my-resumes");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="border border-neutral-800 rounded-2xl p-6 sm:p-8 bg-black">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Upload Resume</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Share your resume PDF to receive line-by-line peer reviews.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-950/30 border border-red-900/50 text-red-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Resume Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Senior Frontend Engineer - 2026"
              className="w-full px-4 py-3 bg-black border border-neutral-800 focus:border-white focus:outline-none rounded-xl text-white placeholder-neutral-600 text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Target Role & Focus Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Target roles, tech stack, or specific sections you want advice on..."
              className="w-full px-4 py-3 bg-black border border-neutral-800 focus:border-white focus:outline-none rounded-xl text-white placeholder-neutral-600 text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              PDF Document *
            </label>
            <div className="border border-dashed border-neutral-800 hover:border-neutral-600 rounded-2xl p-8 text-center transition bg-neutral-950/50">
              <input
                type="file"
                id="pdf-input"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="pdf-input" className="cursor-pointer block">
                <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-xs text-white mx-auto mb-2">
                  PDF
                </div>
                <span className="text-sm font-semibold text-white block">
                  {file ? file.name : "Choose PDF file"}
                </span>
                <span className="text-xs text-neutral-500 mt-1 block">
                  Maximum file size: 10MB
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-white hover:bg-neutral-200 disabled:opacity-50 text-black font-bold rounded-full text-sm transition"
            >
              {loading ? "Uploading..." : "Upload Resume"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 border border-neutral-800 hover:bg-neutral-900 text-neutral-400 hover:text-white rounded-full text-sm font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
