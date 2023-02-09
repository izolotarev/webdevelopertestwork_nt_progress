import { createAction } from '@reduxjs/toolkit';
import { ActionType } from '../../const/const';
import { Instrument } from '../../Enums';
import { Order, Quote } from '../../Models/Base';

export const subscribeMarketDataAction = createAction(
  ActionType.SubscribeMarketData,
  (subscriptionId: string) => ({
    payload: {
      subscriptionId,
    }
  })
);
 
export const unsubscribeMarketDataAction = createAction(ActionType.UnsubscribeMarketData);

export const loadQuoteAction = createAction(
  ActionType.LoadQuote,
  (quote: Quote, instrument: Instrument) => ({
    payload: {
      instrument,
      quote,
    }
  })
);

export const loadOrdersAction = createAction(
  ActionType.LoadOrders,
  (orders: Order[]) => ({
    payload: {
      orders
    }
  })
)