import React from 'react';

type ImageLinkProps = {
  movieTitle: string;
  size?: 'small' | 'medium' | 'large';
};

const ImageLink: React.FC<ImageLinkProps> = ({ movieTitle, size = 'small' }) => {
  const encodedTitle = encodeURIComponent(movieTitle);
  const imageUrl = `https://ashleestreamimages.blob.core.windows.net/images/Movie%20Posters/${encodedTitle}.jpg`;

  // Define max dimensions per size
  const sizeStyles = {
    small: { maxWidth: '150px', maxHeight: '210px' },
    medium: { maxWidth: '250px', maxHeight: '350px' },
    large: { maxWidth: '500px', maxHeight: '700px' },
  };

  const selectedSize = sizeStyles[size];

  return (
    <img
      src={imageUrl}
      alt={`Movie Poster for ${movieTitle}`}
      loading="lazy"
      style={{
        ...selectedSize,
        width: '100%',
        height: 'auto',
        objectFit: 'contain',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        aspectRatio: 'auto', // fallback-safe
      }}
    />
  );
};

export default ImageLink;
