import React from 'react';

const SearchHistoryItem = ({ searchItem }) => {
  return (
    <li>
      <button>{searchItem}</button>
    </li>
  );
};

export default SearchHistoryItem;