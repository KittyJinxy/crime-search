import styled from 'styled-components';

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const PaginationButton = styled.button`
  border: none;
  background-color: #fff;
  color: #6A35D0;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 15px;
  margin: 0 10px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in-out;
  border: 1px solid #6A35D0;

  &:hover {
    background-color: #6A35D0;
    color: #fff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #333;
  text-align: left;

  th,
  td {
    padding: 0.5rem;
    border: 1px solid #ccc;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #ddd;
  }
`;