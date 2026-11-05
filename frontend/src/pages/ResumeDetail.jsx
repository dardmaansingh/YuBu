import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export const ResumeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [data, setData] = useState({ resume: null, reviews: [] });
  const [ui, setUi] = useState({ loading: true, error: "", submitting: false, success: "" });
  const [review, setReview] = useState({
    score: 5,
    overallComment: "",
    sections: [
      { section: "Summary & Header", comment: "" },
      { section: "Experience & Projects", comment: "" },
    ],
  });

  const fetchData = async () => {
    setUi((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const [resResume, resReviews] = await Promise.all([
        api.get(`/resumes/${id}`),
        api.get(`/reviews/${id}`),
      ]);
      setData({ resume: resResume.data.data, reviews: resReviews.data.data || [] });
    } catch (err) {
      setUi((prev) => ({ ...prev, error: err.response?.data?.message || "Failed to load" }));
    } finally {
      setUi((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const isOwner = data.resume && user && (data.resume.owner?._id === user._id || data.resume.owner === user._id);
  const hasReviewed = data.reviews.some(
    (r) => r.reviewer?._id === user?._id || r.reviewer === user?._id
  );

  const handleSectionChange = (index, field, value) => {
    const updated = [...review.sections];
    updated[index][field] = value;
    setReview({ ...review, sections: updated });
  };

  const handleAddSection = () => {
    setReview({ ...review, sections: [...review.sections, { section: "", comment: "" }] });
  };

  const handleRemoveSection = (index) => {
    if (review.sections.length <= 1) return;
    setReview({ ...review, sections: review.sections.filter((_, i) => i !== index) });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setUi((prev) => ({ ...prev, error: "", success: "" }));

    if (!review.overallComment.trim()) {
      setUi((prev) => ({ ...prev, error: "Please provide an overall comment" }));
      return;
    }

    setUi((prev) => ({ ...prev, submitting: true }));
    try {
      const payload = {
        score: Number(review.score),
        overallComment: review.overallComment.trim(),
        feedback: review.sections.filter((s) => s.section.trim() && s.comment.trim()),
      };

      const res = await api.post(`/reviews/${id}`, payload);
      setData((prev) => ({ ...prev, reviews: [res.data.data, ...prev.reviews] }));
      setUi((prev) => ({ ...prev, success: "Review submitted! +1 reputation earned." }));
      setReview({
        score: 5,
        overallComment: "",
        sections: [
          { section: "Summary & Header", comment: "" },
          { section: "Experience & Projects", comment: "" },
        ],
      });
    } catch (err) {
      setUi((prev) => ({ ...prev, error: err.response?.data?.message || err.message || "Failed to submit" }));
    } finally {
      setUi((prev) => ({ ...prev, submitting: false }));
    }
  };

  if (ui.loading) {
    return (
      <div className="flex justify-center py-20 bg-black min-h-screen">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (ui.error && !data.resume) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-red-400 text-sm mb-4">{ui.error}</p>
        <Link to="/browse" className="text-white hover:underline text-sm font-semibold">
          ← Back to Browse
        </Link>
      </div>
    );
  }

  const { resume, reviews } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="border border-neutral-800 rounded-2xl p-6 bg-black mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-white tracking-tight">{resume.title}</h1>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  resume.status === "reviewed"
                    ? "border-emerald-800 text-emerald-400 bg-emerald-950/30"
                    : "border-neutral-700 text-neutral-400 bg-neutral-900"
                }`}
              >
                {resume.status}
              </span>
            </div>
            {resume.description && (
              <p className="text-xs text-neutral-400 max-w-xl">{resume.description}</p>
            )}
          </div>

          <a
            href={`/api/v1/resumes/${id}/file`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-neutral-700 hover:bg-neutral-900 text-white text-xs font-semibold rounded-full transition self-start sm:self-auto"
          >
            Open PDF ↗
          </a>
        </div>

        <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-neutral-800 text-xs text-neutral-500">
          {resume.owner?.avatar ? (
            <img
              src={resume.owner.avatar}
              alt={resume.owner.fullName}
              className="w-6 h-6 rounded-full object-cover border border-neutral-800"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] font-bold text-white">
              {resume.owner?.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <span>
            Posted by <strong className="text-white">{resume.owner?.fullName}</strong> (@{resume.owner?.username}) · {new Date(resume.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="border border-neutral-800 rounded-2xl p-4 bg-black">
            <h2 className="text-sm font-bold text-white mb-3">Document Preview</h2>
            <div className="w-full h-[680px] bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800">
              <iframe
                src={`/api/v1/resumes/${id}/file#toolbar=1`}
                title="Resume Preview"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          {isOwner ? (
            <div className="border border-neutral-800 rounded-2xl p-5 bg-black">
              <h3 className="font-bold text-white text-sm">Your Resume</h3>
              <p className="text-xs text-neutral-500 mt-1">
                You cannot review your own resume. Feedback from peers appears below.
              </p>
            </div>
          ) : hasReviewed ? (
            <div className="border border-neutral-800 rounded-2xl p-5 bg-black">
              <h3 className="font-bold text-white text-sm">✓ Review Submitted</h3>
              <p className="text-xs text-neutral-500 mt-1">
                You have already provided feedback for this resume. Thank you for contributing!
              </p>
            </div>
          ) : (
            <div className="border border-neutral-800 rounded-2xl p-6 bg-black">
              <h3 className="font-bold text-white text-base mb-1">Post a Review</h3>
              <p className="text-xs text-neutral-500 mb-4">
                Provide constructive section-by-section advice to earn +1 reputation.
              </p>

              {ui.error && (
                <div className="mb-4 p-3 bg-red-950/30 border border-red-900/50 text-red-400 text-xs rounded-xl">
                  {ui.error}
                </div>
              )}
              {ui.success && (
                <div className="mb-4 p-3 bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 text-xs rounded-xl">
                  {ui.success}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-2">
                    Score (1 - 5)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setReview({ ...review, score: val })}
                        className={`flex-1 py-1.5 rounded-full text-xs font-bold border transition ${
                          review.score === val
                            ? "bg-white border-white text-black"
                            : "bg-black border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                        }`}
                      >
                        {val} ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-neutral-400">
                      Section Critique
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="text-xs text-white hover:underline font-medium"
                    >
                      + Add section
                    </button>
                  </div>

                  <div className="space-y-3">
                    {review.sections.map((sec, idx) => (
                      <div key={idx} className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={sec.section}
                            onChange={(e) => handleSectionChange(idx, "section", e.target.value)}
                            placeholder="Section name (e.g. Projects)"
                            className="w-full px-2.5 py-1 bg-black border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-white"
                          />
                          {review.sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSection(idx)}
                              className="text-neutral-500 hover:text-red-400 text-xs px-1"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <textarea
                          rows={2}
                          value={sec.comment}
                          onChange={(e) => handleSectionChange(idx, "comment", e.target.value)}
                          placeholder="Feedback on this section..."
                          className="w-full px-2.5 py-1 bg-black border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
                    Overall Summary *
                  </label>
                  <textarea
                    rows={3}
                    value={review.overallComment}
                    onChange={(e) => setReview({ ...review, overallComment: e.target.value })}
                    placeholder="Key takeaways and main suggestions..."
                    className="w-full px-3 py-2 bg-black border border-neutral-800 focus:border-white focus:outline-none rounded-xl text-xs text-white placeholder-neutral-600 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={ui.submitting}
                  className="w-full py-2.5 bg-white hover:bg-neutral-200 disabled:opacity-50 text-black text-xs font-bold rounded-full transition"
                >
                  {ui.submitting ? "Posting..." : "Post Review (+1 Rep)"}
                </button>
              </form>
            </div>
          )}

          <div className="border border-neutral-800 rounded-2xl p-6 bg-black">
            <h3 className="font-bold text-white text-sm mb-4">
              Reviews ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
              <p className="text-xs text-neutral-500 text-center py-6">
                No reviews yet. Be the first to provide feedback!
              </p>
            ) : (
              <div className="divide-y divide-neutral-800">
                {reviews.map((rev) => (
                  <div key={rev._id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {rev.reviewer?.avatar ? (
                          <img
                            src={rev.reviewer.avatar}
                            alt={rev.reviewer.fullName}
                            className="w-6 h-6 rounded-full object-cover border border-neutral-800"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] font-bold text-white">
                            {rev.reviewer?.fullName?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                        <span className="text-xs font-bold text-white">
                          {rev.reviewer?.fullName}
                        </span>
                      </div>
                      <span className="text-white text-xs font-semibold">
                        {"★".repeat(rev.score)}{"☆".repeat(5 - rev.score)}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {rev.overallComment}
                    </p>

                    {rev.feedback?.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {rev.feedback.map((item, fIdx) => (
                          <div
                            key={fIdx}
                            className="text-xs bg-neutral-950 px-2.5 py-1.5 rounded-lg border border-neutral-800"
                          >
                            <span className="font-semibold text-white">{item.section}: </span>
                            <span className="text-neutral-400">{item.comment}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-[10px] text-neutral-500 pt-0.5">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
