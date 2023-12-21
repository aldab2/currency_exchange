import React from 'react';
import ExchangeComponent from './ExchangeComponent';
import AddComponent from './AddComponent';
import ListComponent from './ListComponent';

const MainComponent = () => {
  const [selectedRadio, setSelectedRadio] = React.useState("btnExchange");

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.id);
  };

  return (
    <div className="container mt-3">
      <div className="row mb-3">
        <div className="col d-flex justify-content-center">
          <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" className="btn-check" name="btnradio" id="btnExchange" autoComplete="off" checked={selectedRadio === 'btnExchange'} onChange={handleRadioChange} />
            <label className="btn btn-outline-primary" htmlFor="btnExchange">Exchange Currencies</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnAdd" autoComplete="off" checked={selectedRadio === 'btnAdd'} onChange={handleRadioChange} />
            <label className="btn btn-outline-primary" htmlFor="btnAdd">Add Currencies</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnDelete" autoComplete="off" checked={selectedRadio === 'btnDelete'} onChange={handleRadioChange} />
            <label className="btn btn-outline-primary" htmlFor="btnDelete">Delete Currencies</label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          {selectedRadio === "btnExchange" && <ExchangeComponent />}
          {selectedRadio === "btnAdd" && <AddComponent />}
          {selectedRadio === "btnDelete" && <ListComponent />}
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
