import React from 'react';

type ImageLinkProps = {
  movieTitle: string;
  size?: 'small' | 'medium' | 'large';
  orientation?: 'vertical' | 'horizontal';
};

const ImageLink: React.FC<ImageLinkProps> = ({
  movieTitle,
  size = 'small',
  orientation = 'vertical',
}) => {
  const sanitizedTitle = movieTitle.replace(/[^a-zA-Z0-9 ]/g, ''); // remove all non-alphanumeric and non-space chars
  const formattedTitle = sanitizedTitle.replace(/\s/g, '%20'); // convert spaces to %20
  const imageUrl = `https://ashleestreamimages.blob.core.windows.net/images/Movie%20Posters/${formattedTitle}.jpg`;

  // Set width/height for container based on size and orientation
  const sizeMap = {
    vertical: {
      small: { width: 150, height: 210 },
      medium: { width: 250, height: 350 },
      large: { width: 375, height: 525 }, // 💅 perfect trimmed version
    },
    horizontal: {
      small: { width: 210, height: 150 },
      medium: { width: 350, height: 250 },
      large: { width: 700, height: 500 },
    },
  };

  const { width, height } = sizeMap[orientation][size];

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
      }}
    >
      <img
        src={imageUrl}
        alt={`Movie Poster for ${movieTitle}`}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover', // or 'contain' for letterboxing
        }}
      />
    </div>
  );
};

export default ImageLink;
