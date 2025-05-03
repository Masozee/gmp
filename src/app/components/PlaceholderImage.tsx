'use client';

import Image from 'next/image';

interface PlaceholderImageProps {
  alt: string;
  className?: string;
  imagePlaceholder?: string;
}

const PlaceholderImage = ({ alt, className, imagePlaceholder }: PlaceholderImageProps) => {
  const fallbackImage = '/images/placeholder.svg';
  const src = imagePlaceholder || fallbackImage;

  return (
    <Image 
      src={src}
      alt={alt}
      fill
      style={{ objectFit: 'cover' }}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = fallbackImage;
        target.style.filter = 'grayscale(100%)';
      }}
    />
  );
};

export default PlaceholderImage; 