import './App.css';
import SearchBar from './components/SearchBar';
import HistoricSearches from './components/HistoricSearches';
import Table from './components/Table';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { useState } from 'react';

function App() {

  const [coords, setCoords] = useState([]);


  return (
    <div className="App">
      <Header />
      <SearchBar setCoords={setCoords}/>
      <HistoricSearches />
      <Table coords={coords}/>
      <Footer />
    </div>
  );
}

export default App;
