import { createMemoryHistory } from 'history';
import thunk from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { makeFakeOrder } from '../../utils/mocks';
import { Provider } from 'react-redux';
import { unstable_HistoryRouter as HistoryRouter} from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Ticker from './ticker';

const history = createMemoryHistory();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const orders = [makeFakeOrder()];

describe('Ticker', () => {
  it('should render "Ticker" screen', () => {
    const store = mockStore({
      MARKET: {
        ordersLoaded: true,
        orders: orders,
      }
    });
    
    const fakeApp = (
      <Provider store={store}>
        <HistoryRouter history={history}>
          <Ticker/>
        </HistoryRouter>
      </Provider>
    );
    render(fakeApp);
    expect(screen.getByText(/Please select instrument/i)).toBeInTheDocument();
  });
})