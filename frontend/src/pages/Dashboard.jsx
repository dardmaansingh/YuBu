import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get("/resumes/my");
        setResumes(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="border border-neutral-800 rounded-2xl p-6 bg-black mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-20 h-20 rounded-full object-cover border border-neutral-700"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-2xl font-bold text-white">
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">{user?.fullName}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
                {user?.role}
              </span>
            </div>
            <p className="text-sm text-neutral-500 mt-0.5">@{user?.username} · {user?.email}</p>

            <div className="mt-5 flex items-center justify-center sm:justify-start gap-6 text-sm">
              <div>
                <span className="font-bold text-white">{user?.reputation ?? 0}</span>{" "}
                <span className="text-neutral-500">Reputation</span>
              </div>
              <div>
                <span className="font-bold text-white">{loading ? "..." : resumes.length}</span>{" "}
                <span className="text-neutral-500">Resumes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          to="/upload"
          className="border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 bg-black hover:bg-neutral-950 transition flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-white text-base">Upload Resume</h3>
            <p className="text-xs text-neutral-500 mt-1">Get line-by-line feedback from fellow developers.</p>
          </div>
          <span className="text-xs font-semibold text-white mt-4 inline-flex items-center gap-1">
            Upload PDF →
          </span>
        </Link>

        <Link
          to="/browse"
          className="border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 bg-black hover:bg-neutral-950 transition flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-white text-base">Review Peers</h3>
            <p className="text-xs text-neutral-500 mt-1">Browse developer resumes and earn +1 reputation point.</p>
          </div>
          <span className="text-xs font-semibold text-white mt-4 inline-flex items-center gap-1">
            Browse Feed →
          </span>
        </Link>

        <Link
          to="/my-resumes"
          className="border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 bg-black hover:bg-neutral-950 transition flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-white text-base">My Resumes</h3>
            <p className="text-xs text-neutral-500 mt-1">Check received reviews and score ratings.</p>
          </div>
          <span className="text-xs font-semibold text-white mt-4 inline-flex items-center gap-1">
            View All ({resumes.length}) →
          </span>
        </Link>
      </div>

      {resumes.length > 0 && (
        <div className="border border-neutral-800 rounded-2xl bg-black overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Recent Uploads</h3>
            <Link to="/my-resumes" className="text-xs text-neutral-400 hover:text-white transition">
              View all
            </Link>
          </div>
          <div className="divide-y divide-neutral-800">
            {resumes.slice(0, 3).map((r) => (
              <div key={r._id} className="p-4 flex items-center justify-between hover:bg-neutral-950/60 transition">
                <div>
                  <h4 className="text-sm font-semibold text-white">{r.title}</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                      r.status === "reviewed"
                        ? "border-emerald-800 text-emerald-400 bg-emerald-950/30"
                        : "border-neutral-700 text-neutral-400 bg-neutral-900"
                    }`}
                  >
                    {r.status}
                  </span>
                  <Link
                    to={`/resume/${r._id}`}
                    className="text-xs text-white hover:underline font-medium"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
