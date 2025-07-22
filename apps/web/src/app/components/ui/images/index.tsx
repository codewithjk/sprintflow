import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import type { ImgHTMLAttributes } from 'react';

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  effect?: 'blur' | 'black-and-white' | 'opacity' ;
};

const Image = ({
  src,
  alt,
  width,
  height,
  className,
  effect = 'blur',
  ...rest
}: ImageProps) => {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      effect={effect}
      {...rest}
    />
  );
};

export default Image;
