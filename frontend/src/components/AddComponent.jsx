import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddComponent = () => {
  const [currencyName, setCurrencyName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [dollarRate, setDollarRate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError,setIsError] = useState(false);

  //const POST_ADD_URL= "/gateway/add-currency";
  const POST_ADD_URL= "https://currencyv8-cbem0hbz.uc.gateway.dev/add-currency/";
  const handleSubmit = (event) => {
    setIsSubmitted(false);
    setIsError(false);
    event.preventDefault();
    setIsLoading(true);

    const requestBody = {
      name: currencyName,
      abbreviation: abbreviation,
      dollarRate: parseFloat(dollarRate),
    };

    fetch(POST_ADD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      setIsSubmitted(true);
    })
    .catch(error => {
      setIsError(true);  
      console.error('There was an error adding the currency:', error);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Add New Currency</h1>
      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="currencyName" className="form-label">Currency Name</label>
            <input type="text" className="form-control" id="currencyName" value={currencyName} onChange={e => setCurrencyName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="abbreviation" className="form-label">Abbreviation</label>
            <input type="text" className="form-control" id="abbreviation" value={abbreviation} onChange={e => setAbbreviation(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="dollarRate" className="form-label">Dollar Rate</label>
            <input type="number" className="form-control" id="dollarRate" value={dollarRate} onChange={e => setDollarRate(e.target.value)} required step="0.01" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>Add Currency</button>
        </form>
      )}
      {isSubmitted && !isLoading && <div className="alert alert-success" role="alert">Currency added successfully!</div>}
      { isError && !isLoading && <div className="alert alert-danger" role="alert">Error in adding currency</div>}

    </div>
  );
}

export default AddComponent;
