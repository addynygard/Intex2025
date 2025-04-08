import React from 'react';

interface DeleteProps {
  onClick: () => void;
}

const DeleteMovie: React.FC<DeleteProps> = ({ onClick }) => (
  <button onClick={onClick} className="btn btn-delete">
    Delete
  </button>
);

export default DeleteMovie;
