import React from 'react';
import SearchHistoryItem from './SearchHistoryItem';

const HistoricSearches = () => {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  return (
    <div>
      <ul>
        {searchHistory.map((searchItem, index) => (
          <SearchHistoryItem key={index} searchItem={searchItem} />
        ))}
      </ul>
    </div>
  );
};

export default HistoricSearches;