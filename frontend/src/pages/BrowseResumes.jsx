import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export const BrowseResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBrowseResumes = async () => {
      setLoading(true);
      try {
        const res = await api.get("/resumes/browse");
        setResumes(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load resumes");
      } finally {
        setLoading(false);
      }
    };

    fetchBrowseResumes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Browse Resumes</h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Review peer resumes, provide section advice, and earn +1 reputation.
        </p>
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
          <h3 className="font-bold text-white text-base">No resumes to review</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            There are currently no peer resumes waiting for review. Check back soon.
          </p>
        </div>
      ) : (
        <div className="border border-neutral-800 rounded-2xl bg-black divide-y divide-neutral-800 overflow-hidden">
          {resumes.map((r) => (
            <div key={r._id} className="p-5 hover:bg-neutral-950/60 transition flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                {r.owner?.avatar ? (
                  <img
                    src={r.owner.avatar}
                    alt={r.owner.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-800 flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {r.owner?.fullName?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{r.owner?.fullName}</span>
                    <span className="text-xs text-neutral-500">@{r.owner?.username}</span>
                    <span className="text-xs text-neutral-600">·</span>
                    <span className="text-xs text-neutral-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm mt-1">{r.title}</h3>
                  {r.description && (
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 max-w-xl">
                      {r.description}
                    </p>
                  )}

                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-neutral-800 text-neutral-400">
                      {r.owner?.reputation ?? 0} pts
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full border ${
                        r.status === "reviewed"
                          ? "border-emerald-800 text-emerald-400 bg-emerald-950/30"
                          : "border-neutral-700 text-neutral-400 bg-neutral-900"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                <a
                  href={`/api/v1/resumes/${r._id}/file`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 border border-neutral-800 hover:bg-neutral-900 text-neutral-400 hover:text-white text-xs font-medium rounded-full transition"
                >
                  PDF ↗
                </a>
                <Link
                  to={`/resume/${r._id}`}
                  className="px-4 py-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-full transition"
                >
                  Review
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
