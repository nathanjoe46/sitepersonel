import { getImage } from '@/lib/images';
import { asset } from '@/lib/site';

interface PictureProps {
  src: string;
  alt: string;
  /** Attribut sizes : largeur affichée selon l'écran. */
  sizes: string;
  /** Image visible dès l'arrivée sur la page (pas de chargement différé). */
  priority?: boolean;
  className?: string;
}

/**
 * Image responsive (AVIF, puis WebP) générée par scripts/optimize-images.mjs.
 * Les dimensions réelles évitent les décalages de mise en page.
 */
export function Picture({ src, alt, sizes, priority = false, className }: PictureProps) {
  const image = getImage(src);
  const srcSet = (variants: { width: number; src: string }[]) =>
    variants.map((v) => `${asset(v.src)} ${v.width}w`).join(', ');
  const fallback = image.webp.at(-1) ?? image.webp[0];

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(image.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(image.webp)} sizes={sizes} />
      <img
        src={asset(fallback?.src ?? src)}
        alt={alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        className={className}
        style={{ backgroundColor: image.placeholder }}
      />
    </picture>
  );
}
