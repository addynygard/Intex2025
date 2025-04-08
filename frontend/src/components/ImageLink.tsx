const ImageLink = ({ movieTitle }: { movieTitle: string }) => {
  const encodedTitle = encodeURIComponent(movieTitle);
  const imageUrl = `https://ashleestreamimages.blob.core.windows.net/images/Movie%20Posters/${encodedTitle}.jpg`;

  return (
    <img
      src={imageUrl}
      alt={`Movie Poster for ${movieTitle}`}
      style={{
        width: '100%',
        maxWidth: '300px',
        height: 'auto',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
      }}
    />
  );
};

export default ImageLink;
