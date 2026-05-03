// src/components/product/ProductFilters.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state initialized from URL
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [origin, setOrigin] = useState(searchParams.get("origin") || "");
  const [material, setMaterial] = useState(searchParams.get("material") || "");
  const [design, setDesign] = useState(searchParams.get("design") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [isOpen, setIsOpen] = useState(false); // collapsible state

  // Available options (you can later fetch from DB)
  const origins = ["Tabriz", "Kashan", "Isfahan", "Qom", "Mashhad"];
  const materials = ["Wool", "Silk", "Wool & Silk", "Cotton"];
  const designs = ["Geometric", "Floral", "Hunting", "Medallion"];

  // Build active filters list
  const activeFilters: { key: string; label: string; value: string }[] = [];
  if (origin)
    activeFilters.push({ key: "origin", label: "Origin", value: origin });
  if (material)
    activeFilters.push({ key: "material", label: "Material", value: material });
  if (design)
    activeFilters.push({ key: "design", label: "Design", value: design });
  if (minPrice || maxPrice) {
    activeFilters.push({
      key: "price",
      label: "Price",
      value: `¥${minPrice || "0"} – ¥${maxPrice || "∞"}`,
    });
  }

  // Update URL when filters change (debounced for search)
  const updateURL = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    if (origin) params.set("origin", origin);
    else params.delete("origin");
    if (material) params.set("material", material);
    else params.delete("material");
    if (design) params.set("design", design);
    else params.delete("design");
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    // Note: sort is not handled here, it's in the parent page
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    search,
    origin,
    material,
    design,
    minPrice,
    maxPrice,
    pathname,
    router,
    searchParams,
  ]);

  // Apply filter changes with debounce for search
  useEffect(() => {
    const timer = setTimeout(updateURL, 400);
    return () => clearTimeout(timer);
  }, [search, updateURL]);

  // Immediate apply for others (no debounce)
  useEffect(() => {
    updateURL();
  }, [origin, material, design, minPrice, maxPrice]); // eslint-disable-line

  // Remove a single active filter
  const removeFilter = (key: string) => {
    switch (key) {
      case "origin":
        setOrigin("");
        break;
      case "material":
        setMaterial("");
        break;
      case "design":
        setDesign("");
        break;
      case "price":
        setMinPrice("");
        setMaxPrice("");
        break;
    }
  };

  // Clear all filters
  const clearAll = () => {
    setSearch("");
    setOrigin("");
    setMaterial("");
    setDesign("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-primary-100 p-5">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary-600" />
          <span className="font-semibold text-primary-800">Filters</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-full hover:bg-primary-50 transition-colors md:hidden"
          aria-label="Toggle filters"
        >
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-primary-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-primary-600" />
          )}
        </button>
      </div>

      {/* Active filters chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full"
            >
              {filter.label}: {filter.value}
              <button
                onClick={() => removeFilter(filter.key)}
                className="ml-1 hover:text-red-500 transition-colors"
                aria-label="Remove filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="text-xs text-primary-600 hover:underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter content (collapsible on mobile) */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen || window.innerWidth >= 768
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
        // Use a state-based class instead of window for SSR safety; we'll use a simple media query with CSS
      >
        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="キーワードで検索..."
            className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Origin */}
          <div>
            <label className="block text-sm font-medium text-primary-800 mb-1">
              Origin
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full p-2.5 border border-primary-200 rounded-xl text-sm focus:ring-1 focus:ring-primary-400 outline-none"
            >
              <option value="">All Origins</option>
              {origins.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* Material */}
          <div>
            <label className="block text-sm font-medium text-primary-800 mb-1">
              Material
            </label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full p-2.5 border border-primary-200 rounded-xl text-sm focus:ring-1 focus:ring-primary-400 outline-none"
            >
              <option value="">All Materials</option>
              {materials.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Design */}
          <div>
            <label className="block text-sm font-medium text-primary-800 mb-1">
              Design
            </label>
            <select
              value={design}
              onChange={(e) => setDesign(e.target.value)}
              className="w-full p-2.5 border border-primary-200 rounded-xl text-sm focus:ring-1 focus:ring-primary-400 outline-none"
            >
              <option value="">All Designs</option>
              {designs.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Price range */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary-800 mb-1">
                Min ¥
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full p-2.5 border border-primary-200 rounded-xl text-sm focus:ring-1 focus:ring-primary-400 outline-none"
              />
            </div>
            <span className="pb-2.5 text-primary-400">–</span>
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary-800 mb-1">
                Max ¥
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="∞"
                className="w-full p-2.5 border border-primary-200 rounded-xl text-sm focus:ring-1 focus:ring-primary-400 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
