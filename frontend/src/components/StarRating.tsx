import React, { useState, useEffect } from 'react';

interface StarRatingProps {
  onRate: (rating: number) => void;
  initialRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  onRate,
  initialRating = 0,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => {
            setRating(star);
            onRate(star);
          }}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            cursor: 'pointer',
            color: star <= (hover || rating) ? 'gold' : 'gray',
            fontSize: '2rem',
            transition: 'color 0.2s',
            marginRight: '5px',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
