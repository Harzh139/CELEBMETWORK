'use client';
import { useEffect, useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src?: string;
  alt: string;
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc = '/default-avatar.png',
  ...rest
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    if (!src) {
      setImgSrc(fallbackSrc);
      return;
    }
    const testImg = new window.Image();
    testImg.src = src;
    testImg.onload = () => setImgSrc(src);
    testImg.onerror = () => setImgSrc(fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
      {...rest}
    />
  );
}