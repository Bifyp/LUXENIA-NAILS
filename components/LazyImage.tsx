"use client";
import { useState } from 'react';
import Image from 'next/image';
type Props = { src: string; alt: string; className?: string };
export default function LazyImage({ src, alt, className = '' }: Props) {
  const [loaded, setLoaded] = useState(false);
  return <Image unoptimized src={src} alt={alt} width={1200} height={800} loading="lazy" onLoad={() => setLoaded(true)} className={`lazy-img ${loaded ? 'loaded' : ''} ${className}`} />;
}
