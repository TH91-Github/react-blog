interface WebPImgType {
  src: string,
  alt: string,
  className?: string,
  width?: number,
  height?: number
}

export default function WebPImg({src, alt, className, width, height}:WebPImgType){
  const webpSrc = src?.replace(/\.(jpg|jpeg|png)$/, '.webp');
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    </picture>
  )
}