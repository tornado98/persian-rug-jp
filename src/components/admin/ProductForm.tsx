"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadProductImage } from "@/actions/blob";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type ProductFormData = {
  title: string;
  slug: string;
  description: string;
  price: number;
  sizeWidth: number;
  sizeHeight: number;
  origin: string;
  material: string;
  colorMain: string;
  design: string[];
  inStock: boolean;
};

type Props = {
  initialData?: ProductFormData & { images: string[] };
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// ---------------------------------------------------------------------------
// Helper: generate a URL-safe slug from text
// ---------------------------------------------------------------------------
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/[^a-z0-9\-]/g, "") // remove non-alphanumeric except hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-|-$/g, ""); // remove leading/trailing hyphens
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ProductForm({ initialData }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    sizeWidth: initialData?.sizeWidth || 0,
    sizeHeight: initialData?.sizeHeight || 0,
    origin: initialData?.origin || "",
    material: initialData?.material || "",
    colorMain: initialData?.colorMain || "",
    design: initialData?.design || [],
    inStock: initialData?.inStock ?? true,
  });
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.images || [],
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    !!initialData?.slug, // if editing an existing product, slug was already set manually
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-generate slug from title when title changes (only if slug hasn't been manually edited)
  useEffect(() => {
    if (!slugManuallyEdited && form.title) {
      const newSlug = generateSlug(form.title);
      setForm((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [form.title, slugManuallyEdited]);

  // Simulate progress during upload
  useEffect(() => {
    if (uploading) {
      setUploadProgress(0);
      setShowProgress(true);
      intervalRef.current = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (uploadProgress > 0) {
        setUploadProgress(100);
        setTimeout(() => setShowProgress(false), 800);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [uploading]);

  // ----- Handlers -----
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else if (name === "design") {
      setForm({
        ...form,
        design: value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
    } else if (type === "number") {
      setForm({ ...form, [name]: Number(value) });
    } else if (name === "slug") {
      // Only allow valid characters and mark as manually edited
      const cleaned = value
        .toLowerCase()
        .replace(/[^a-z0-9\-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setForm({ ...form, slug: cleaned });
      setSlugManuallyEdited(true);
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  // Reset slug manual flag if title is completely cleared
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm({ ...form, title });
    if (!title) {
      setSlugManuallyEdited(false);
      setForm((prev) => ({ ...prev, slug: "" }));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    // Validate file sizes
    for (const file of newFiles) {
      if (file.size > MAX_FILE_SIZE) {
        alert(
          `ファイル "${file.name}" はサイズが大きすぎます。10MB以下のファイルを選択してください。`,
        );
        setUploading(false);
        return;
      }
    }

    // If slug is still empty, generate from title as fallback
    if (!form.slug.trim()) {
      const fallbackSlug = generateSlug(form.title) || `rug-${Date.now()}`;
      setForm((prev) => ({ ...prev, slug: fallbackSlug }));
      // Wait for state update to propagate (but since we need it right now, we use a local variable)
      // We'll use a local slug variable to ensure correct submission
      const slugToUse = fallbackSlug;
      // Continue with the rest of the logic using slugToUse
    }

    // Upload new images via server action
    const newImageUrls: string[] = [];
    for (const file of newFiles) {
      try {
        const url = await uploadProductImage(file);
        newImageUrls.push(url);
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("画像のアップロードに失敗しました。");
        setUploading(false);
        return;
      }
    }

    // Complete progress
    setUploading(false);

    const allImages = [...existingImages, ...newImageUrls];

    const method = initialData ? "PUT" : "POST";
    const endpoint = initialData
      ? `/api/admin/products/${initialData.slug}`
      : "/api/admin/products";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, images: allImages }),
    });

    if (res.ok) {
      alert("✅ 商品が正常に登録されました！");
      router.push("/admin/products");
      router.refresh();
    } else {
      const errorData = await res.json().catch(() => ({}));
      alert(errorData.error || "Error saving product");
    }
  }

  // ----- UI -----
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-primary-100"
    >
      {/* Title */}
      <div>
        <label className="block text-primary-800 font-semibold mb-2">
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleTitleChange}
          required
          className="w-full px-4 py-3 border border-primary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none"
          placeholder="e.g. Tabriz 6m²"
        />
      </div>

      {/* Slug (with auto-generate button) */}
      <div>
        <label className="block text-primary-800 font-semibold mb-2">
          Slug *
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            className="flex-1 px-4 py-3 border border-primary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none"
            placeholder="auto-generated-from-title"
          />
          <button
            type="button"
            onClick={() => {
              const newSlug = generateSlug(form.title);
              setForm({ ...form, slug: newSlug });
              setSlugManuallyEdited(true);
            }}
            className="px-4 py-3 bg-primary-100 text-primary-700 rounded-xl hover:bg-primary-200 transition-colors text-sm font-medium"
            title="Generate slug from title"
          >
            ↻
          </button>
        </div>
        <p className="text-xs text-primary-500 mt-1">
          URL-safe: lowercase letters, numbers, hyphens only
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-primary-800 font-semibold mb-2">
          Description (HTML allowed)
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-3 border border-primary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none resize-y"
          placeholder="Detailed description of the rug..."
        />
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-primary-800 font-semibold mb-2">
            Price (¥)
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-primary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none"
            min={0}
          />
        </div>
        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              name="inStock"
              checked={form.inStock}
              onChange={handleChange}
              className="w-5 h-5 text-primary-600 rounded border-primary-300 focus:ring-primary-400"
              id="inStock"
            />
            <span className="text-primary-800 font-semibold">In Stock</span>
          </label>
        </div>
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-primary-800 font-semibold mb-2">
            Width (cm)
          </label>
          <input
            type="number"
            step="0.1"
            name="sizeWidth"
            value={form.sizeWidth}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-primary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none"
          />
        </div>
        <div>
          <label className="block text-primary-800 font-semibold mb-2">
            Height (cm)
          </label>
          <input
            type="number"
            step="0.1"
            name="sizeHeight"
            value={form.sizeHeight}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-primary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none"
          />
        </div>
      </div>

      {/* Origin, Material, Color */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="block text-primary-800 font-semibold mb-2">
            Origin
          </label>
          <input
            type="text"
            name="origin"
            value={form.origin}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-primary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none"
            placeholder="Tabriz"
          />
        </div>
        <div>
          <label className="block text-primary-800 font-semibold mb-2">
            Material
          </label>
          <input
            type="text"
            name="material"
            value={form.material}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-primary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none"
            placeholder="Wool & Silk"
          />
        </div>
        <div>
          <label className="block text-primary-800 font-semibold mb-2">
            Main Color
          </label>
          <input
            type="text"
            name="colorMain"
            value={form.colorMain}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-primary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none"
            placeholder="e.g. Red"
          />
        </div>
      </div>

      {/* Design */}
      <div>
        <label className="block text-primary-800 font-semibold mb-2">
          Design{" "}
          <span className="text-sm font-normal text-gray-500">
            (comma separated)
          </span>
        </label>
        <input
          type="text"
          name="design"
          value={form.design.join(", ")}
          onChange={handleChange}
          placeholder="geometric, floral, hunting"
          className="w-full px-4 py-3 border border-primary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-primary-800 font-semibold mb-3">
          Images
        </label>

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {existingImages.map((url, idx) => (
              <div
                key={idx}
                className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-primary-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* New file previews */}
        {newFiles.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {Array.from(newFiles).map((file, idx) => (
              <div
                key={idx}
                className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-dashed border-primary-300 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* File input */}
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary-300 rounded-xl cursor-pointer hover:bg-primary-50 transition-colors">
          <svg
            className="w-8 h-8 text-primary-400 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span className="text-sm text-primary-500">
            Click to upload images
          </span>
          <span className="text-xs text-primary-400">
            JPEG, PNG, WebP (max 10MB)
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setNewFiles(Array.from(e.target.files || []))}
            className="hidden"
          />
        </label>
      </div>

      {/* Submit button and progress bar */}
      <div className="space-y-4">
        {/* Progress bar */}
        {showProgress && (
          <div className="w-full bg-primary-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(Math.round(uploadProgress), 100)}%` }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5"
        >
          {uploading
            ? "Uploading..."
            : initialData
              ? "Update Product"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
}
