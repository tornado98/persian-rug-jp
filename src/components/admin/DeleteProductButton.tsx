// src/components/admin/DeleteProductButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Props {
  slug: string;
  title: string;
}

export default function DeleteProductButton({ slug, title }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `本当に「${title}」を削除しますか？\nこの操作は取り消せません。`,
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/products/${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("商品が削除されました。");
        router.push("/admin/products");
        router.refresh();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "削除に失敗しました。");
      }
    } catch (error) {
      alert("削除中にエラーが発生しました。");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium"
    >
      <Trash2 className="w-4 h-4" />
      Delete Product
    </button>
  );
}
