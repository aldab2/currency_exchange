import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ListComponent = () => {
    const [currencies, setCurrencies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    //const DELETE_CURRENCY_URL = "/gateway/delete-currency";
    //const GET_CURRENCIES_URL = "/gateway/get-all";
    const DELETE_CURRENCY_URL = "https://currencyv8-cbem0hbz.uc.gateway.dev/delete-currency";
    const GET_CURRENCIES_URL = "https://currencyv8-cbem0hbz.uc.gateway.dev/get-all";
    const loadingOverlay = isLoading ? "loading-overlay" : "";
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
