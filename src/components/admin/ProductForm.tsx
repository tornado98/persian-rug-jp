"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { put } from "@vercel/blob";

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

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else if (name === "design") {
      setForm({ ...form, design: value.split(",").map((s) => s.trim()) });
    } else if (type === "number") {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    // Upload new images to Vercel Blob
    const newImageUrls: string[] = [];
    for (const file of newFiles) {
      const blob = await put(`products/${Date.now()}-${file.name}`, file, {
        access: "public",
      });
      newImageUrls.push(blob.url);
    }

    const allImages = [...existingImages, ...newImageUrls];

    const method = initialData ? "PUT" : "POST";
    const url = initialData
      ? `/api/admin/products/${initialData.slug}`
      : "/api/admin/products";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, images: allImages }),
    });

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      alert("Error saving product");
    }
    setUploading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {/* Title */}
      <div>
        <label className="block text-primary-800">Title *</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-primary-800">Slug *</label>
        <input
          type="text"
          name="slug"
          value={form.slug}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-primary-800">
          Description (HTML allowed)
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={6}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-primary-800">Price (¥)</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Dimensions */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-primary-800">Width (cm)</label>
          <input
            type="number"
            step="0.1"
            name="sizeWidth"
            value={form.sizeWidth}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex-1">
          <label className="block text-primary-800">Height (cm)</label>
          <input
            type="number"
            step="0.1"
            name="sizeHeight"
            value={form.sizeHeight}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Origin, Material, Color */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-primary-800">Origin</label>
          <input
            type="text"
            name="origin"
            value={form.origin}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-primary-800">Material</label>
          <input
            type="text"
            name="material"
            value={form.material}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-primary-800">Main Color</label>
          <input
            type="text"
            name="colorMain"
            value={form.colorMain}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Design tags */}
      <div>
        <label className="block text-primary-800">
          Design (comma separated)
        </label>
        <input
          type="text"
          name="design"
          value={form.design.join(", ")}
          onChange={handleChange}
          placeholder="e.g., geometric, floral"
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-primary-800">Images</label>
        {existingImages.length > 0 && (
          <div className="flex gap-2 my-2">
            {existingImages.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt=""
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setNewFiles(Array.from(e.target.files || []))}
          className="w-full"
        />
      </div>

      {/* In Stock */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="inStock"
          checked={form.inStock}
          onChange={handleChange}
          id="inStock"
        />
        <label htmlFor="inStock">In Stock</label>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 disabled:opacity-50"
      >
        {uploading
          ? "Uploading..."
          : initialData
            ? "Update Product"
            : "Create Product"}
      </button>
    </form>
  );
}
