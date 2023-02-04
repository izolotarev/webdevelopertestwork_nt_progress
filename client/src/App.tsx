import React from 'react';
import './App.css';
import { Instrument } from './Enums';
import { wsClient } from './WSClient';

function App() {
  
  wsClient.connection!.onopen = () => {
    wsClient.subscribeMarketData(Instrument.eur_rub);
    setTimeout(() => {
      wsClient.unsubscribeMarketData("4a33135d-8aa3-47ba-bcfd-faa297b7fb5b");
    }, 15 * 1000)
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;
