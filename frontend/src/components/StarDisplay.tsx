import React from 'react';

interface StarDisplayProps {
  rating: number;
  maxStars?: number;
}

const StarDisplay: React.FC<StarDisplayProps> = ({ rating }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        return (
          <span
            key={star}
            style={{
              color: star <= rating ? 'gold' : 'gray',
              fontSize: '2rem',
              marginRight: '5px',
            }}
          >
            ★
          </span>
        );
      })}

      {/* Number next to stars */}
      <span
        style={{
          color: 'white',
          fontSize: '1.2rem',
          marginLeft: '10px',
          fontWeight: 500,
        }}
      >
        {rating.toFixed(1)}/5 stars
      </span>
    </div>
  );
};

export default StarDisplay;
