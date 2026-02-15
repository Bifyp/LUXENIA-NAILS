"use client";

import { useState } from "react";

export default function LazyImage({ src, alt, className }: any) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      className={`lazy-img ${loaded ? "loaded" : ""} ${className}`}
    />
  );
}
