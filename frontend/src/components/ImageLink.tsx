const ImageLink = ({ movieTitle }: { movieTitle: string }) => {
  const encodedTitle = encodeURIComponent(movieTitle);
  const imageUrl = `https://ashleestreamimages.blob.core.windows.net/images/Movie%20Posters/${encodedTitle}.jpg`;

  return (
    <img
      src={imageUrl}
      alt="Movie Poster for ${movieTitle}"
      style={{ width: '500px', height: '700px' }}
    />
  );
};
export default ImageLink;
