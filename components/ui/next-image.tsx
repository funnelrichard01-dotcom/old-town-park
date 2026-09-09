import React from 'react';

export interface NextImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number | string;
  height?: number | string;
  priority?: boolean;
  quality?: number;
}

export const Image = React.forwardRef<HTMLImageElement, NextImageProps>(
  ({ src, alt, fill, width, height, className = '', style, priority, quality, ...props }, ref) => {
    const combinedStyle: React.CSSProperties = {
      ...style,
      ...(fill
        ? {
            position: 'absolute',
            height: '100%',
            width: '100%',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          }
        : {}),
    };

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        style={combinedStyle}
        className={className}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';
export default Image;
