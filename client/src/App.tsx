import 'bootstrap/dist/css/bootstrap.min.css';
import OrderTable from './components/order-table/order-table';
import Ticker from './components/ticker/ticker';
import { Container } from 'react-bootstrap';
import OrderTableEmpty from './components/order-table-empty/order-table-empty';
import { useSelector } from 'react-redux';
import { getOrders } from './store/reducers/market/market-selectors';

function App() {
  const orders = useSelector(getOrders);

  return (
    <Container>
      <Ticker></Ticker>
      {
        orders && orders.length > 0
          ?
          <OrderTable orders={orders}/>
          :
          <OrderTableEmpty/>
      } 
    </Container>
  );
}

export default App;
