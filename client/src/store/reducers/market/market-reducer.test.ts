import { makeFakeOrder } from '../../../utils/mocks';
import { initialState, marketData } from './market-reducer';
import { loadOrdersAction } from '../../actions/actions'


const orders = [makeFakeOrder()];

describe('Function: marketData', () => {

  it('without additional parameters should return initial state', () => {
    expect(marketData(void 0, {type: 'UNKNOWN_ACTION'}))
      .toEqual(initialState);
  });

  it('should load order on loadOrdersAction', () => {
    const state = {
      orders: [],
      ordersLoaded: false,
      subscriptionId: ''
    };
    expect(marketData(state, loadOrdersAction(orders)))
      .toEqual({
        orders: orders,
        ordersLoaded: true,
        subscriptionId: ''
      });
  });

});
