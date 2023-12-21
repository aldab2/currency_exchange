import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExchangeComponent = () => {
  const [currencies, setCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sourceCurrency, setSourceCurrency] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [exchangeResult, setExchangeResult] = useState(null);
  const [useGraphQL, setUseGraphQL] = useState(false); // New state to track if GraphQL should be used

  // Add a CSS class for the loading overlay and the greyed-out background
  const loadingBackground = isLoading ? "loading-background" : "";


  //const GET_CURRENCIES_URL = "/gateway/get-all";
  //const GET_EXCHANGE_CURRENCIES_URL = "/gateway/exchange-currency";
  const GET_CURRENCIES_URL = "https://currencyv8-cbem0hbz.uc.gateway.dev/get-all";
  const GET_EXCHANGE_CURRENCIES_URL = "https://currencyv8-cbem0hbz.uc.gateway.dev/exchange-currency";
  const GQL_URL = "https://currencyv8-cbem0hbz.uc.gateway.dev/graphql";


  useEffect(() => {
    setIsLoading(true);
    
      fetch(GET_CURRENCIES_URL)
      .then(response => response.json())
      .then(data => {
        setCurrencies(data);
        setIsLoading(false);
      });
    
    
  }, []);

  const handleExchange = () => {
    setIsLoading(true);

    if (useGraphQL) {
       // Perform exchange using GraphQL
    const graphqlQuery = JSON.stringify({
      query: `
        {
          currencyConversion(
            sourceCurrencyName: "${sourceCurrency}",
            targetCurrencyName: "${targetCurrency}",
            amount: ${amount}
          )
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
        return response.json().then(body => {
          throw new Error(body.errors.map(error => error.message).join('\n'));
        });
      }
      return response.json();
    })
    .then(data => {
      if (data.errors) {
        // If the GraphQL response contains errors, throw them to be caught by the catch block
        throw new Error(data.errors.map(error => error.message).join('\n'));
      }
      // Handle the data returned from the GraphQL API
      setExchangeResult(data.data.currencyConversion);
      setIsLoading(false); // Reset loading state
    })
    .catch(error => {
      console.error('Error:', error);
      setIsLoading(false); // Reset loading state
    });
    } else {
      
      const url = `${GET_EXCHANGE_CURRENCIES_URL}?sourceCurrencyName=${sourceCurrency}&targetCurrencyName=${targetCurrency}&amount=${amount}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setExchangeResult(data.targetAmount);
          setIsLoading(false);
        });
    }
  };



  return (
    <div className={`container mt-5 ${loadingBackground}`}>
       {isLoading && 
      <div className="loading-spinner text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    }
      <h1 className="mb-4">Currency Exchange</h1>
      <div className="mb-3">
        <label htmlFor="sourceCurrency" className="form-label">Source Currency</label>
        <select className="form-select" id="sourceCurrency" value={sourceCurrency} onChange={e => setSourceCurrency(e.target.value)}>
          <option>Select Currency</option>
          {currencies.map(currency => (
            <option key={currency._id} value={currency.name}>{currency.name} ({currency.abbreviation})</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="targetCurrency" className="form-label">Target Currency</label>
        <select className="form-select" id="targetCurrency" value={targetCurrency} onChange={e => setTargetCurrency(e.target.value)}>
          <option>Select Currency</option>
          {currencies.map(currency => (
            <option key={currency._id} value={currency.name}>{currency.name} ({currency.abbreviation})</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="amount" className="form-label">Amount</label>
        <input type="number" className="form-control" id="amount" value={amount} onChange={e => setAmount(e.target.value)} />
      </div>
      
      <div className="form-check form-switch">
  <input className="form-check-input" type="checkbox" id="graphql-switch" onChange={(e) => setUseGraphQL(e.target.checked)}/>
  <label className="form-check-label" htmlFor="graphql-switch">Use GraphQL</label>
</div>
      <button className="btn btn-primary" onClick={handleExchange}>Exchange</button>
      {exchangeResult !== null && (
        <div className="mt-3">
          <label className="form-label">Exchange Result</label>
          <input type="text" className="form-control" value={exchangeResult} readOnly />
        </div>
      )}
    </div>
  );
}

export default ExchangeComponent;
