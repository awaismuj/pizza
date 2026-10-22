import { useMemo, useState } from "react";
import { MdStar, MdVisibility, MdVisibilityOff, MdDelete } from "react-icons/md";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getReviews, toggleReview, deleteReview } from "../../https";

const Stars = ({ value }) => (
  <span className="inline-flex text-lg" aria-label={`${value} out of 5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <MdStar key={n} className={n <= value ? "text-[#f6b100]" : "text-[#444]"} />
    ))}
  </span>
);

// Customers leave reviews from the storefront ("Write a Review"). They go
// live immediately; staff can hide (reversible) or delete them here.
const ReviewsManager = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
    placeholderData: keepPreviousData,
    refetchInterval: 30000,
  });
  const reviews = data?.data?.data ?? [];

  const stats = useMemo(() => {
    const visible = reviews.filter((r) => r.isVisible);
    const avg = visible.length ? visible.reduce((s, r) => s + r.rating, 0) / visible.length : 0;
    return { total: reviews.length, visible: visible.length, hidden: reviews.length - visible.length, avg };
  }, [reviews]);

  const shown = reviews.filter((r) => (filter === "all" ? true : filter === "visible" ? r.isVisible : !r.isVisible));

  const refresh = () => queryClient.invalidateQueries(["reviews"]);
  const toggleMutation = useMutation({
    mutationFn: toggleReview,
    onSuccess: () => {
      refresh();
      enqueueSnackbar("Review updated", { variant: "success" });
    },
    onError: () => enqueueSnackbar("Failed to update review.", { variant: "error" }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      refresh();
      enqueueSnackbar("Review deleted", { variant: "success" });
    },
    onError: () => enqueueSnackbar("Failed to delete review.", { variant: "error" }),
  });

  const cards = [
    { label: "Average rating", value: stats.avg ? stats.avg.toFixed(1) : "–", color: "#f6b100" },
    { label: "Total reviews", value: stats.total, color: "#025cca" },
    { label: "Showing on store", value: stats.visible, color: "#02ca3a" },
    { label: "Hidden", value: stats.hidden, color: "#be3e3f" },
  ];

  return (
    <div className="mx-auto w-full px-4 sm:px-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl p-4" style={{ background: `${c.color}22`, border: `1px solid ${c.color}55` }}>
            <p className="text-[#b5b5b5] text-xs font-medium">{c.label}</p>
            <p className="text-[#f5f5f5] text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {[["all", "All"], ["visible", "Visible"], ["hidden", "Hidden"]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              filter === key ? "bg-[#f6b100] text-[#1f1f1f]" : "bg-[#262626] text-[#b5b5b5] hover:bg-[#333]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-[#ababab]">Loading reviews…</p>
      ) : shown.length === 0 ? (
        <p className="text-[#ababab] bg-[#262626] rounded-xl p-6">No reviews here yet.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {shown.map((r) => (
            <div key={r._id} className={`bg-[#262626] rounded-2xl p-5 border ${r.isVisible ? "border-[#333]" : "border-[#be3e3f]/50 opacity-75"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[#f5f5f5] font-semibold truncate">{r.name}</p>
                  <p className="text-[#8a8a8a] text-xs">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
                <Stars value={r.rating} />
              </div>
              {r.title && <p className="text-[#f5f5f5] font-semibold mt-3">{r.title}</p>}
              <p className="text-[#d0d0d0] text-sm mt-2 whitespace-pre-line break-words">{r.comment}</p>
              {r.dish && <p className="text-[#8a8a8a] text-xs mt-3">Ordered: {r.dish}</p>}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => toggleMutation.mutate(r._id)}
                  className="flex items-center gap-1.5 bg-[#1f1f1f] hover:bg-[#333] text-[#f5f5f5] px-3 py-2 rounded-lg text-sm"
                >
                  {r.isVisible ? <MdVisibilityOff /> : <MdVisibility />} {r.isVisible ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => window.confirm(`Delete the review from ${r.name}?`) && deleteMutation.mutate(r._id)}
                  className="flex items-center gap-1.5 bg-red-500/90 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  <MdDelete /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsManager;
