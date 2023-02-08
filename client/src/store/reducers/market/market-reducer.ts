import { createReducer } from '@reduxjs/toolkit';
import { MarketState, } from '../../../types/types';
import { loadOrdersAction, loadQuoteAction, subscribeMarketDataAction, unsubscribeMarketDataAction } from '../../actions/actions';



export const initialState: MarketState = {
  subscriptionId: '',
  instrument: undefined,
  quote: undefined,
  orders: undefined,
  ordersLoaded: false,
};

export const marketData = createReducer(initialState, (builder) => {
  builder
    .addCase(subscribeMarketDataAction, (state, action) => {
      state.subscriptionId = action.payload.subscriptionId;
    })
    .addCase(unsubscribeMarketDataAction, (state, action) => {
      state.subscriptionId = initialState.subscriptionId;
      state.instrument = initialState.instrument;
      state.quote = initialState.quote;
    })
    .addCase(loadQuoteAction, (state, action) => {
      state.quote = action.payload.quote;
      state.instrument = action.payload.instrument;
    })
    .addCase(loadOrdersAction, (state, action) => {
      state.orders = action.payload.orders;
      state.ordersLoaded = true;
    })
});
