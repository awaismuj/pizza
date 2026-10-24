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

// Lets staff upload the full-width photos that play in the storefront's
// homepage slider, and control their order, on/off state, and optional
// tap-through link — no code changes needed to swap them out.
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
      enqueueSnackbar("Slide added! It'll show up in the homepage slider.", { variant: "success" });
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
      enqueueSnackbar("Slide updated!", { variant: "success" });
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ---- Form ---- */}
      <div className="bg-[#262626] rounded-lg p-5">
        <h3 className="text-[#f5f5f5] text-xl font-semibold mb-1">
          {editingSlide ? "Edit Slide" : "Add Slide"}
        </h3>
        <p className="text-[#ababab] text-sm mb-4">
          These photos play full-width, one after another, at the top of the storefront —
          upload whatever you want customers to see first.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[#ababab] text-sm mb-1 block">Slide image</label>
            <div className="flex items-center gap-3">
              {form.image && (
                <img
                  src={isUploadedImage(form.image) ? resolveImageUrl(form.image) : form.image}
                  alt={form.altText || "Promotional slide image preview"}
                  className="w-24 h-16 rounded object-cover border border-[#3a3a3a]"
                />
              )}
              <label className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#333] text-white px-3 py-2 rounded cursor-pointer text-sm">
                <FaUpload /> {uploadingImage ? "Uploading…" : "Upload"}
                <input type="file" accept=".png,.jpg,.jpeg,.webp,.gif,.svg" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <p className="text-[#7a7a7a] text-xs mt-1">
              Wide photos work best (roughly 16:7) — they'll be cropped to fill the banner.
            </p>
          </div>

          <div>
            <label className="text-[#ababab] text-sm mb-1 block">Link when tapped (optional)</label>
            <input
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="bg-[#1a1a1a] text-white rounded px-3 py-2 outline-none w-full"
              placeholder="https://... (leave blank to just scroll to the menu)"
            />
          </div>

          <div>
            <label className="text-[#ababab] text-sm mb-1 block">Alt text (optional, for accessibility)</label>
            <input
              value={form.altText}
              onChange={(e) => setForm({ ...form, altText: e.target.value })}
              className="bg-[#1a1a1a] text-white rounded px-3 py-2 outline-none w-full"
              placeholder="e.g. Friday Deal — Rs 1,550"
            />
          </div>

          <label className="flex items-center gap-2 text-[#ababab] text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active (visible on storefront)
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
              disabled={saving}
            >
              {saving ? "Saving…" : editingSlide ? "Update Slide" : "Add Slide"}
            </button>
            {editingSlide && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ---- List ---- */}
      <div className="bg-[#262626] rounded-lg p-5">
        <h3 className="text-[#f5f5f5] text-xl font-semibold mb-4">
          Slider Order ({slides.length})
        </h3>
        <div className="space-y-3">
          {isLoading && <p className="text-[#ababab]">Loading slides…</p>}
          {!isLoading && slides.length === 0 && (
            <p className="text-[#ababab]">
              No slides yet — upload your first one and it'll appear on the storefront right away.
            </p>
          )}
          {slides.map((slide, index) => (
            <div key={slide._id} className="rounded-lg bg-[#1a1a1a] p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 min-w-0">
                  <img
                    src={isUploadedImage(slide.image) ? resolveImageUrl(slide.image) : slide.image}
                    alt={slide.altText || `Promotional slide ${index + 1}`}
                    className="w-16 h-12 rounded object-cover border border-[#3a3a3a] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[#f5f5f5] font-medium truncate">
                      {slide.altText || `Slide ${index + 1}`}
                    </p>
                    {slide.link && (
                      <p className="text-[#ababab] text-xs truncate">Links to: {slide.link}</p>
                    )}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium shrink-0 ${
                    slide.isActive ? "bg-green-600/20 text-green-300" : "bg-red-600/20 text-red-300"
                  }`}
                >
                  {slide.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => moveSlide(index, -1)}
                  disabled={index === 0}
                  className="bg-[#333] hover:bg-[#444] disabled:opacity-30 disabled:cursor-not-allowed text-white px-2.5 py-1.5 rounded text-sm"
                  aria-label="Move up"
                >
                  <FaArrowUp />
                </button>
                <button
                  onClick={() => moveSlide(index, 1)}
                  disabled={index === slides.length - 1}
                  className="bg-[#333] hover:bg-[#444] disabled:opacity-30 disabled:cursor-not-allowed text-white px-2.5 py-1.5 rounded text-sm"
                  aria-label="Move down"
                >
                  <FaArrowDown />
                </button>
                <button
                  onClick={() => toggleMutation.mutate(slide._id)}
                  className={`px-3 py-1.5 rounded text-sm text-white ${
                    slide.isActive ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {slide.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => startEdit(slide)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Delete this slide?")) {
                      deleteMutation.mutate(slide._id);
                    }
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
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
