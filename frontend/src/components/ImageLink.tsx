import React from 'react';

type ImageLinkProps = {
  movieTitle: string;
  size?: 'small' | 'medium' | 'large';
  orientation?: 'vertical' | 'horizontal';
};

const manualAccentEncode = (title: string) => {
  return title
    .replace(/é/g, '%C3%A9')
    .replace(/à/g, '%C3%A0')
    .replace(/è/g, '%C3%A8')
    .replace(/ê/g, '%C3%AA')
    .replace(/ç/g, '%C3%A7')
    .replace(/ô/g, '%C3%B4')
    .replace(/ë/g, '%C3%AB')
    .replace(/É/g, '%C3%89')
    .replace(/À/g, '%C3%80')
    .replace(/È/g, '%C3%88')
    .replace(/Ê/g, '%C3%8A')
    .replace(/Ç/g, '%C3%87')
    .replace(/Ô/g, '%C3%94')
    .replace(/Ë/g, '%C3%8B');
};

const ImageLink: React.FC<ImageLinkProps> = ({
  movieTitle,
  size = 'small',
  orientation = 'vertical',
}) => {
  const decomposedTitle = movieTitle.normalize('NFD'); // Decomposed: é → e + ◌́
  const strippedTitle = decomposedTitle.replace(
    /[^a-zA-Z0-9 \u0300-\u036f]/g,
    '',
  );
  const encodedTitle = encodeURIComponent(strippedTitle);
  const imageUrl = `https://ashleestreamimages.blob.core.windows.net/images/Movie%20Posters/${encodedTitle}.jpg`;

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
