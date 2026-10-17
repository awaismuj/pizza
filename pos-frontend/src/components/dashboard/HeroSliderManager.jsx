import { useState } from "react";
import { FaUpload, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  getHeroSlides,
  addHeroSlide,
  updateHeroSlide,
  toggleHeroSlide,
  reorderHeroSlides,
  deleteHeroSlide,
  uploadImage,
} from "../../https";
import { resolveImageUrl } from "../../utils";

const isUploadedImage = (value = "") => value.startsWith("http") || value.startsWith("/uploads/");

const defaultSlideForm = {
  image: "",
  link: "",
  altText: "",
  isActive: true,
};

const buildFormFromSlide = (slide) => ({
  image: slide?.image ?? "",
  link: slide?.link ?? "",
  altText: slide?.altText ?? "",
  isActive: slide?.isActive ?? true,
});

const HeroSliderManager = () => {
  const queryClient = useQueryClient();

  const { data: slidesData, isLoading } = useQuery({
    queryKey: ["heroSlides"],
    queryFn: getHeroSlides,
    placeholderData: keepPreviousData,
  });
  const slides = slidesData?.data?.data ?? [];

  const [form, setForm] = useState(defaultSlideForm);
  const [editingSlide, setEditingSlide] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const resetForm = () => {
    setEditingSlide(null);
    setForm(defaultSlideForm);
  };

  const startEdit = (slide) => {
    setEditingSlide(slide);
    setForm(buildFormFromSlide(slide));
  };

  const invalidate = () => queryClient.invalidateQueries(["heroSlides"]);

  const createMutation = useMutation({
    mutationFn: addHeroSlide,
    onSuccess: () => {
      invalidate();
      enqueueSnackbar("Slide added successfully!", { variant: "success" });
      resetForm();
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to add slide.", { variant: "error" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateHeroSlide,
    onSuccess: () => {
      invalidate();
      enqueueSnackbar("Slide updated successfully!", { variant: "success" });
      resetForm();
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to update slide.", { variant: "error" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleHeroSlide,
    onSuccess: invalidate,
    onError: () => {
      enqueueSnackbar("Failed to update slide status.", { variant: "error" });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderHeroSlides,
    onSuccess: invalidate,
    onError: () => {
      enqueueSnackbar("Failed to reorder slides.", { variant: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHeroSlide,
    onSuccess: () => {
      invalidate();
      enqueueSnackbar("Slide deleted.", { variant: "success" });
      resetForm();
    },
    onError: () => {
      enqueueSnackbar("Failed to delete slide.", { variant: "error" });
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const res = await uploadImage(file);
      const url = res?.data?.data?.url;
      if (url) setForm((prev) => ({ ...prev, image: url }));
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || "Image upload failed.", { variant: "error" });
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.image) {
      enqueueSnackbar("Please upload a slide image first.", { variant: "warning" });
      return;
    }

    if (editingSlide) {
      updateMutation.mutate({ slideId: editingSlide._id, ...form });
    } else {
      createMutation.mutate(form);
    }
  };

  const moveSlide = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const reordered = Array.from(slides);
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const payload = reordered.map((s, idx) => ({ id: s._id, position: idx }));
    reorderMutation.mutate(payload);
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* ---- Form ---- */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs">
        <h3 className="text-slate-900 dark:text-white text-base sm:text-lg font-bold tracking-tight mb-1">
          {editingSlide ? "Edit Storefront Banner" : "Add Storefront Banner"}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">
          Full-width interactive showcase banners displayed prominently on the public web storefront.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
              Banner Photo *
            </label>
            <div className="flex items-center gap-3">
              {form.image && (
                <img
                  src={isUploadedImage(form.image) ? resolveImageUrl(form.image) : form.image}
                  alt="Slide preview"
                  className="w-24 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                />
              )}
              <label className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white px-3.5 py-2 rounded-xl cursor-pointer text-xs font-bold transition border border-slate-200 dark:border-slate-700">
                <FaUpload size={12} /> {uploadingImage ? "Uploading…" : "Upload Photo"}
                <input type="file" accept=".png,.jpg,.jpeg,.webp,.gif,.svg" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <p className="text-slate-400 text-[11px] mt-1.5">
              Recommended ratio: 16:7 widescreen for desktop and mobile displays.
            </p>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
              Tap-through Link (optional)
            </label>
            <input
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
              placeholder="e.g. https://... or /menu"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
              Accessibility Alt Text
            </label>
            <input
              value={form.altText}
              onChange={(e) => setForm({ ...form, altText: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
              placeholder="e.g. Weekend Big Deal — Rs 1,499"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="rounded accent-amber-500"
            />
            <span>Active & published on live storefront</span>
          </label>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-sm transition active:scale-95 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? "Saving…" : editingSlide ? "Update Slide" : "Publish Slide"}
            </button>
            {editingSlide && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ---- Slides List ---- */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900 dark:text-white text-base sm:text-lg font-bold tracking-tight">
            Banner Playback Sequence ({slides.length})
          </h3>
        </div>

        <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
          {isLoading && <p className="text-slate-400 text-xs">Loading banners…</p>}
          {!isLoading && slides.length === 0 && (
            <p className="text-slate-400 text-xs py-8 text-center">
              No banner slides uploaded yet. Add your first hero slide on the left!
            </p>
          )}

          {slides.map((slide, index) => (
            <div
              key={slide._id}
              className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 p-3.5 transition hover:shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 min-w-0">
                  <img
                    src={isUploadedImage(slide.image) ? resolveImageUrl(slide.image) : slide.image}
                    alt={slide.altText || ""}
                    className="w-18 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-slate-900 dark:text-white font-bold text-xs truncate">
                      {slide.altText || `Slide #${index + 1}`}
                    </p>
                    {slide.link && (
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate mt-0.5">
                        Link: {slide.link}
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    slide.isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {slide.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-700/60">
                <button
                  onClick={() => moveSlide(index, -1)}
                  disabled={index === 0}
                  className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-800 dark:text-white px-2.5 py-1.5 rounded-lg text-xs"
                  title="Move Up"
                >
                  <FaArrowUp size={10} />
                </button>
                <button
                  onClick={() => moveSlide(index, 1)}
                  disabled={index === slides.length - 1}
                  className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-800 dark:text-white px-2.5 py-1.5 rounded-lg text-xs"
                  title="Move Down"
                >
                  <FaArrowDown size={10} />
                </button>
                <button
                  onClick={() => toggleMutation.mutate(slide._id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    slide.isActive
                      ? "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black"
                  }`}
                >
                  {slide.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => startEdit(slide)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Delete this banner slide?")) {
                      deleteMutation.mutate(slide._id);
                    }
                  }}
                  className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold px-2.5 py-1 rounded-lg text-xs transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSliderManager;
