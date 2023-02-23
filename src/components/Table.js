import { useState, useEffect } from 'react';
import { PaginationContainer, PaginationButton, StyledTable } from './styled/Table.styled';

const CRIMES_API = 'https://data.police.uk/api/crimes-street/all-crime'

function Table(props) {
  const { coords } = props;
  const [crimes, setCrimes] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    async function fetchCrimes() {

      const uniqueCrimes = new Set();

      for (const coord of coords) {

        // Check if the coordinates are valid
        const { latitude, longitude } = coord;
        if (!latitude || !longitude) {
          continue;
        }

        // Create a bounding area around the coordinates
        // to define the scope of the search
        const searchArea = [
          [latitude + 0.003, longitude + 0.003], // Top right
          [latitude - 0.003, longitude + 0.003], // Top left
          [latitude - 0.003, longitude - 0.003], // Bottom left
          [latitude + 0.003, longitude - 0.003], // Bottom right
        ];
        const poly = searchArea.map(coords => coords.join(',')).join(':');


        // Fetch the crimes from the API with the polygon as a parameter
        const response = await fetch(`${CRIMES_API}?poly=${poly}`);

        // If the response fails, skip this step
        if (!response.ok) {
          continue;
        }

        // Fetch the crimes and add them to the set
        const receivedCrimes = await response.json();
        receivedCrimes.forEach(crime => uniqueCrimes.add(crime));
      }

      const crimes = Array.from(uniqueCrimes);

      // Remove all crimes that have the same id than another crime
      // to avoid duplicates
      const uniqueCrimesById = new Set();
      const tableCrimes = [];
      crimes.forEach(crime => {
        if (!uniqueCrimesById.has(crime.id)) {
          uniqueCrimesById.add(crime.id);
          tableCrimes.push(crime);
        }
      });

      // Set the crimes list to refresh the table
      setCrimes(tableCrimes);
    }

    fetchCrimes();
  }, [coords]);

  const handleClickPrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleClickNext = () => {
    if (page < Math.ceil(crimes.length / itemsPerPage)) {
      setPage(page + 1);
    }
  };

  const handleClickFirstPage = () => {
    setPage(1);
  };

  const handleClickLastPage = () => {
    setPage(Math.ceil(crimes.length / itemsPerPage));
  };

  const renderTableData = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCrimes = crimes.slice(startIndex, endIndex);
    return currentCrimes.map((crime, index) => (
      <tr key={index}>
        <td>{crime.category}</td>
        <td>{crime.month}</td>
        <td>{crime.outcome_status ? crime.outcome_status.category : 'On going'}</td>
        <td>{crime.location ? `${crime.location.street.name}` : 'Unknown'}</td>
      </tr>
    ));
  };

  const renderTotalCrimes = () => {
    return <span>Total crimes: {crimes.length}</span>;
  };
  
  if (crimes.length === 0) {
    return <p>No crime on record.</p>;
  } else {
    return (
      <div className='table-container'>
        <StyledTable>
          <thead>
            <tr>
              <th>Category</th>
              <th>Date</th>
              <th>Outcome</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {renderTableData()}
          </tbody>
        </StyledTable>
        <PaginationContainer>
          <PaginationButton onClick={handleClickFirstPage} disabled={page === 1}>
            First Page
          </PaginationButton>
          <PaginationButton onClick={handleClickPrevious} disabled={page === 1}>
            Previous
          </PaginationButton>
          <span>
            Page {page} of {Math.ceil(crimes.length / itemsPerPage)}
          </span>
          <PaginationButton onClick={handleClickNext} disabled={page === Math.ceil(crimes.length / itemsPerPage)}>
            Next
          </PaginationButton>
          <PaginationButton onClick={handleClickLastPage} disabled={page === Math.ceil(crimes.length / itemsPerPage)}>
            Last Page
          </PaginationButton>
          {renderTotalCrimes()}
        </PaginationContainer>
      </div>
    );
  }
}

export default Table;