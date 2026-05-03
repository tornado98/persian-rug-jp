// src/actions/blob.ts
"use server";

import { put } from "@vercel/blob";

export async function uploadProductImage(file: File): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN environment variable");
  }

  const blob = await put(`products/${Date.now()}-${file.name}`, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return blob.url;
}
