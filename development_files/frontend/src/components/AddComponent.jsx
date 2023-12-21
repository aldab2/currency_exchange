import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddComponent = () => {
  const [currencyName, setCurrencyName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [dollarRate, setDollarRate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError,setIsError] = useState(false);
  const [useGraphQL, setUseGraphQL] = useState(false); // New state to track if GraphQL should be used

  //const POST_ADD_URL= "/gateway/add-currency";
  const POST_ADD_URL= "https://currencyv8-cbem0hbz.uc.gateway.dev/add-currency/";
  const GQL_URL = "https://currencyv8-cbem0hbz.uc.gateway.dev/graphql";
  const handleSubmit = (event) => {


    setIsSubmitted(false);
    setIsError(false);
    event.preventDefault();
    setIsLoading(true);

    if(useGraphQL){

       // Perform exchange using GraphQL
    const graphqlQuery = JSON.stringify({
      query: `
      mutation {
        addCurrency(name: "${currencyName}" , abbreviation: "${abbreviation}", dollarRate: ${dollarRate}) {
          name
          abbreviation
          dollarRate
        }
      }
      
      `
    });

    // Set up your fetch request with the POST method and appropriate headers/body for GraphQL
    fetch(GQL_URL, { // Make sure this endpoint is correct for your setup
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include other headers as needed, like authentication tokens
      },
      body: graphqlQuery
    })
    .then(response => {
      if (!response.ok) {
        // If the HTTP response is not ok, then convert the response body to JSON
        // so we can get the full GraphQL error message
        setIsError(true); 
        return response.json().then(body => {
          throw new Error(body.errors.map(error => error.message).join('\n'));
        });
      }
      setIsSubmitted(true);
      return response.json();
    })
    .then(data => {
      if (data.errors) {
        // If the GraphQL response contains errors, throw them to be caught by the catch block
        setIsError(true); 
        setIsSubmitted(false);
        throw new Error(data.errors.map(error => error.message).join('\n'));
      }
      // Handle the data returned from the GraphQL API
      setIsSubmitted(true);
      setIsLoading(false); // Reset loading state
    })
    .catch(error => {
      //console.error('Error:', error);
      setIsError(true); 
      setIsSubmitted(false);
      setIsLoading(false); // Reset loading state
    });

    }
    else {
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
    }
    
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
          <div className="form-check form-switch">
  <input className="form-check-input" type="checkbox" id="graphql-switch" onChange={(e) => setUseGraphQL(e.target.checked)}/>
  <label className="form-check-label" htmlFor="graphql-switch">Use GraphQL</label>
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
