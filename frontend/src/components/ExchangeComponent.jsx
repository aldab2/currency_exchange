import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExchangeComponent = () => {
  const [currencies, setCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sourceCurrency, setSourceCurrency] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [exchangeResult, setExchangeResult] = useState(null);
  // Add a CSS class for the loading overlay and the greyed-out background
  const loadingOverlay = isLoading ? "loading-overlay" : "";
  const loadingBackground = isLoading ? "loading-background" : "";


  //const GET_CURRENCIES_URL = "/gateway/get-all";
  //const GET_EXCHANGE_CURRENCIES_URL = "/gateway/exchange-currency";
  const GET_CURRENCIES_URL = "https://currencyv8-cbem0hbz.uc.gateway.dev/get-all";
  const GET_EXCHANGE_CURRENCIES_URL = "https://currencyv8-cbem0hbz.uc.gateway.dev/exchange-currency";


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
    const url = `${GET_EXCHANGE_CURRENCIES_URL}?sourceCurrencyName=${sourceCurrency}&targetCurrencyName=${targetCurrency}&amount=${amount}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setExchangeResult(data.targetAmount);
        setIsLoading(false);
      });
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
