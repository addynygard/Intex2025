function HomePage() {
  return (
    <div className="main-container home-layout">
      <div className="home-left">
        <h1 className="text-center home-title">🎬 CinaNiche</h1>
        <p className="text-center home-subtitle">Your personalized movie platform</p>


        <div className="home-description">
          <p>
            Discover movies tailored to your taste, explore niche genres, and
            connect with fellow movie lovers by logging in or creating a free
            account.
          </p>
        </div>


        <div className="card home-actions">
          <p className="text-center">Join us now and start your cinematic journey!</p>
          <button className="btn btn-primary">Get Started</button>
          <p>Already have an account?</p>
          <button className="btn btn-secondary">Login</button>
        </div>
      </div>


      <div className="home-right">
        <h2 className="text-center home-image-title">Top Trending Movies</h2>
        <div className="movie-image-grid">
          <div className="image-placeholder">Movie 1</div>
          <div className="image-placeholder">Movie 2</div>
          <div className="image-placeholder">Movie 3</div>
          <div className="image-placeholder">Movie 4</div>
          <div className="image-placeholder">Movie 5</div>
          <div className="image-placeholder">Movie 6</div>
          <div className="image-placeholder">Movie 7</div>
          <div className="image-placeholder">Movie 8</div>
          {/* <div className="image-placeholder">Movie 9</div>
          <div className="image-placeholder">Movie 10</div>
          <div className="image-placeholder">Movie 11</div>
          <div className="image-placeholder">Movie 12</div> */}
        </div>
      </div>
    </div>
  );
}


export default HomePage;