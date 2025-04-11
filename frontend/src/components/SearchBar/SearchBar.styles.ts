import styled from 'styled-components';

export const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 280px; // fixed width for simplicity
  background: transparent;
  border: 1px solid white;
  border-radius: 4px;
  padding: 5px;
  overflow: hidden;
  color: white;
  transition:
    border 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: #9333ea;
    box-shadow: 0 0 6px 2px rgba(147, 51, 234, 0.4);
  }
`;

export const SearchIcon = styled.div`
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    fill: none;
    stroke: white;
    stroke-width: 2;
    width: 20px;
    height: 20px;
  }
`;

export const Input = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: white;
  margin-left: 10px;
  width: 100%;
  font-size: 16px;

  &::placeholder {
    color: white;
    opacity: 1; /* Make sure it's not faded */
  }

  &::-webkit-input-placeholder {
    color: white;
  }

  &::-moz-placeholder {
    color: white;
  }

  &:-ms-input-placeholder {
    color: white;
  }

  &::-ms-input-placeholder {
    color: white;
  }
`;


export const ResultsWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #1e1e1e;
  border: 1px solid #333;
  max-height: 200px;
  overflow-y: auto;
  z-index: 9999;
`;

export const ResultItem = styled.div`
  padding: 10px;
  color: white;
  cursor: pointer;

  &:hover {
    background: #333;
  }
`;
