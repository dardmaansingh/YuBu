import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export const MyResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/resumes/my");
      setResumes(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;

    try {
      await api.delete(`/resumes/${id}`);
      setResumes(resumes.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">My Resumes</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Manage your uploads and view feedback</p>
        </div>
        <Link
          to="/upload"
          className="px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-full transition"
        >
          + Upload
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/30 border border-red-900/50 text-red-400 text-xs rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : resumes.length === 0 ? (
        <div className="border border-neutral-800 rounded-2xl p-12 text-center bg-black">
          <h3 className="font-bold text-white text-base">No resumes yet</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-5">
            Upload your resume PDF to receive community reviews and scoring.
          </p>
          <Link
            to="/upload"
            className="px-5 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-neutral-200 transition inline-block"
          >
            Upload Resume
          </Link>
        </div>
      ) : (
        <div className="border border-neutral-800 rounded-2xl bg-black divide-y divide-neutral-800 overflow-hidden">
          {resumes.map((r) => (
            <div key={r._id} className="p-5 hover:bg-neutral-950/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white text-sm">{r.title}</h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      r.status === "reviewed"
                        ? "border-emerald-800 text-emerald-400 bg-emerald-950/30"
                        : "border-neutral-700 text-neutral-400 bg-neutral-900"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                {r.description && (
                  <p className="text-xs text-neutral-400 line-clamp-1 max-w-xl">{r.description}</p>
                )}
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Uploaded on {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Link
                  to={`/resume/${r._id}`}
                  className="px-3.5 py-1.5 border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-900 text-white text-xs font-medium rounded-full transition"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleDelete(r._id, r.title)}
                  className="px-3 py-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-950/20 text-xs font-medium rounded-full transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
