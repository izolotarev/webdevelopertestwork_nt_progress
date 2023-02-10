import App from './app';
import { createMemoryHistory } from 'history';
import thunk from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { makeFakeOrder } from '../../utils/mocks';
import { Provider } from 'react-redux';
import { unstable_HistoryRouter as HistoryRouter} from 'react-router-dom';
import { render, screen } from '@testing-library/react';

const history = createMemoryHistory();

describe('App', () => {

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const orders = [makeFakeOrder()];

  it('should render "App" screen when user navigate to "/"', () => {
    const store = mockStore({
      MARKET: {
        ordersLoaded: true,
        orders: orders,
      }
    });
    
    const fakeApp = (
      <Provider store={store}>
        <HistoryRouter history={history}>
          <App />
        </HistoryRouter>
      </Provider>
    );
    history.push('/');
    render(fakeApp);
    expect(orders.length).toBe(1);
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Side/i)).toBeInTheDocument();
    expect(screen.getByText(/Price/i)).toBeInTheDocument();
  });
})