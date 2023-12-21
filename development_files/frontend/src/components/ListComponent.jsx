import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ListComponent = () => {
    const [currencies, setCurrencies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [useGraphQL, setUseGraphQL] = useState(false); // New state to track if GraphQL should be used

    //const DELETE_CURRENCY_URL = "/gateway/delete-currency";
    //const GET_CURRENCIES_URL = "/gateway/get-all";
    const DELETE_CURRENCY_URL = "https://currencyv8-cbem0hbz.uc.gateway.dev/delete-currency";
    const GET_CURRENCIES_URL = "https://currencyv8-cbem0hbz.uc.gateway.dev/get-all";
    const GQL_URL = "https://currencyv8-cbem0hbz.uc.gateway.dev/graphql";

    const loadingBackground = isLoading ? "loading-background" : "";


    useEffect(() => {
        setIsLoading(true);
        fetch(GET_CURRENCIES_URL)
            .then(response => response.json())
            .then(data => {
                setCurrencies(data);
                setIsLoading(false);
            });
    }, []);

    const handleDelete = (name) => {
        setIsLoading(true);

        if(useGraphQL){

            // Perform exchange using GraphQL
    const graphqlQuery = JSON.stringify({
        query: `
        mutation {
          deleteCurrency(name: "${name}"){
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
          setIsLoading(false);
          return response.json().then(body => {
            throw new Error(body.errors.map(error => error.message).join('\n'));
          });
        }
        setIsLoading(false);
        return response.json();
      })
      .then(data => {
        if (data.errors) {
          // If the GraphQL response contains errors, throw them to be caught by the catch block
          throw new Error(data.errors.map(error => error.message).join('\n'));
        }
        // Handle the data returned from the GraphQL API
        setCurrencies(currencies.filter(currency => currency.name !== name));
        setIsLoading(false); // Reset loading state
      })
      .catch(error => {
        //console.error('Error:', error);
        setIsLoading(false); // Reset loading state
      });
  

        }
        else {
            fetch(DELETE_CURRENCY_URL, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            })
                .then(() => {
                    // Update the list after deletion
                    setCurrencies(currencies.filter(currency => currency.name !== name));
                    setIsLoading(false);
                });
        }
       
    };



    return (
        <div className={`container mt-5 ${loadingBackground}`}>
            {isLoading && (
                <div className="loading-spinner text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}


            <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="graphql-switch" onChange={(e) => setUseGraphQL(e.target.checked)} />
                <label className="form-check-label" htmlFor="graphql-switch">Use GraphQL</label>
            </div>

            <ul className="list-group">
                {currencies.map(currency => (
                    <li key={currency._id} className="list-group-item d-flex justify-content-between align-items-center list-group-item-action">
                        {currency.name} ({currency.abbreviation})
                        <button className="btn btn-danger" onClick={() => handleDelete(currency.name)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListComponent;
