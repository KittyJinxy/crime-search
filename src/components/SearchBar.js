import React, { useState, useEffect } from 'react';

const POSTCODE_API = 'https://api.getthedata.com/postcode/';
const POSTCODE_FORMAT = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?[ ]?[0-9][A-Z]{2}$/i;

function SearchBar(props) {
  const { setCoords } = props;
  const [validPostcodes, setValidPostcodes] = useState([]);
  const [searching, setSearching] = useState(false);
  const [matchingPostcode, setMatchingPostcode] = useState('');
  const [searchedPostcodes, setSearchedPostcodes] = useState(new Set());

  useEffect(() => {

    // Set a minimum delay before triggering a search to avoid too many requests
    const delay = setTimeout(async () => {

      // Only trigger a search if the user has entered at least one valid postcode
      if (validPostcodes.length > 0) {

        // Set the searching state to true to disable the clear button
        setSearching(true);

        const allCoords = [];
        const localMachingPostcode = new Set();

        for (const postcodes of validPostcodes) {

          // Fetch the postcode data from the API with the postcode as a parameter
          // If the response succeeds, return the response as JSON
          const returnedValue = await fetch(`${POSTCODE_API}/${postcodes}`)
            .then(response => {

              if (response.status === 200) {
                return response.json();
              }

              return null;
            })

          // If the postcode is not found, returnedValue will be null so skip this step
          if (!returnedValue || returnedValue.data == null) {
            continue;
          }

          // Get the latitude and longitude from the matchingResult
          // And add them to the list of final coordinates
          const latitude = parseFloat(returnedValue.data.latitude);
          const longitude = parseFloat(returnedValue.data.longitude);
          allCoords.push({ latitude, longitude });

          // Add the matching postcode to the set of matching postcodes
          // To be displayed in the UI
          localMachingPostcode.add(postcodes);
        }


        // Update the list of matching and searched postcodes
        setSearchedPostcodes(prevSearchedPostcodes => new Set([...prevSearchedPostcodes, ...localMachingPostcode]));
        setMatchingPostcode(Array.from(localMachingPostcode).join(', '));

        // Set the coordinates state to the list of final coordinates
        setCoords(allCoords);
        setSearching(false);
      }
    }, 500);

    // Clean up the timeout to avoid triggering a search too often
    return () => clearTimeout(delay);

  }, [validPostcodes, setCoords]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value.toUpperCase();
    postcodesValidation(inputValue);
  }

  const postcodesValidation = (postcodes) => {

    // Parse the input string to extract the list of postcodes
    // Filter out any invalid postcodes and update the list of current postcodes
    const inputPostcodes = postcodes.split(',').map(postcode => postcode.trim());
    const validInputPostcodes = inputPostcodes.filter(postcode => postcode.match(POSTCODE_FORMAT));
    setValidPostcodes(validInputPostcodes);
  }

  const handleClearClick = () => {
    // Clear the input field and the list of valid postcodes
    setValidPostcodes([]);
    setMatchingPostcode('');
    setCoords([]);
    const inputField = document.querySelector('input[type="text"]');
    inputField.value = '';
  }

  const handleDeleteClick = (postcode) => {
    // Remove the postcode from the list of searched postcodes
    const newSearchedPostcodes = new Set(searchedPostcodes);
    newSearchedPostcodes.delete(postcode);
    setSearchedPostcodes(newSearchedPostcodes);
  }

  return (
    <div>
      <h2>Type one or more postcodes seperated by commas in the field below:</h2>
      <input type="text" onChange={handleInputChange} placeholder="Enter one or more postcodes separated by commas" />
      <button className="button-clear" onClick={handleClearClick} disabled={validPostcodes.length === 0 || searching}>Clear</button>
      {matchingPostcode && <p>Matching postcode: {matchingPostcode}</p>}
      <p>Search history:</p>
      <ul>
        {[...searchedPostcodes].map(postcode => (
          <li key={postcode}>
            <span className='postcode-found' onClick={() => postcodesValidation(postcode)}>{postcode}</span>
            <button className="delete-btn" onClick={() => handleDeleteClick(postcode)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchBar;