import React from 'react';

interface EditProps {
  onClick: () => void;
}

const EditMovie: React.FC<EditProps> = ({ onClick }) => (
  <button onClick={onClick} className="btn btn-edit">
    Edit
  </button>
);

export default EditMovie;
