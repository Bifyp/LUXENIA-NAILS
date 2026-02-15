"use client";

import { useEffect, useState } from "react";

export default function GalleryAdmin() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadImages() {
    const res = await fetch("/api/gallery/list");
    const data = await res.json();
    setImages(data);
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function uploadImage(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/gallery/upload", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    loadImages();
  }

  async function deleteImage(id: string) {
    await fetch("/api/gallery/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    loadImages();
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl mb-6">Галерея</h1>

      <input type="file" onChange={uploadImage} />
      {loading && <p>Загрузка...</p>}

      <div className="grid grid-cols-3 gap-4 mt-10">
        {images.map((img) => (
          <div key={img.id} className="relative">
            <img src={img.url} className="w-full rounded" />
            <button
              onClick={() => deleteImage(img.id)}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
