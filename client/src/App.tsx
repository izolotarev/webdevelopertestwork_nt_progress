import 'bootstrap/dist/css/bootstrap.min.css';
import OrderTable from './components/order-table/order-table';
import Ticker from './components/ticker/ticker';
import { Container } from 'react-bootstrap';

function App() {

  // wsClient.connection!.onopen = () => {
  //   wsClient.subscribeMarketData(Instrument.eur_rub);
  //   setTimeout(() => {
  //     wsClient.unsubscribeMarketData("4a33135d-8aa3-47ba-bcfd-faa297b7fb5b");
  //   }, 15 * 1000)
  // }

  return (
    <Container>
      <Ticker></Ticker>
      <OrderTable/>
    </Container>
  );
}

export default App;
