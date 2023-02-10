import { createMemoryHistory } from 'history';
import thunk from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { makeFakeOrder } from '../../utils/mocks';
import { Provider } from 'react-redux';
import { unstable_HistoryRouter as HistoryRouter} from 'react-router-dom';
import { render } from '@testing-library/react';
import OrderTable from './order-table';

const history = createMemoryHistory();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const orders = [makeFakeOrder()];

describe('OrderTable', () => {
  it('should render "OrderTable" screen', () => {
    const store = mockStore({
      MARKET: {
        ordersLoaded: true,
        orders: orders,
      }
    });
    
    const fakeApp = (
      <Provider store={store}>
        <HistoryRouter history={history}>
          <OrderTable orders={orders}/>
        </HistoryRouter>
      </Provider>
    );
    render(fakeApp);
    expect(orders.length).toBe(1);
  });
})