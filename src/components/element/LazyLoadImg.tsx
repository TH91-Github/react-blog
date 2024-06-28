import React from 'react';
import LazyLoad from 'react-lazyload';

interface LazyImgType {
  src: string,
  alt: string
  height?:number,
}
export default function LazyLoadImg ({height, src, alt}:LazyImgType){
  return (
    <LazyLoad height={height} offset={100}>
      <img src={src} alt={alt} />
    </LazyLoad>
  )
}
