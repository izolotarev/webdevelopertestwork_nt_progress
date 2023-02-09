import {ClientMessage} from "./Models/ClientMessages";
import {ClientMessageType, Instrument, OrderSide, ServerMessageType} from "./Enums";
import Decimal from "decimal.js";
import {MarketDataUpdate, ServerEnvelope, SuccessInfo} from "./Models/ServerMessages";
import { StoreType } from './index';
import { loadOrdersAction, loadQuoteAction, subscribeMarketDataAction } from './store/actions/actions';
import { toast } from 'react-toastify';

export default class WSConnector {
  connection: WebSocket | undefined;
  store: StoreType | undefined;

  constructor(store: StoreType) {
    this.connection = undefined;
    this.store = store;
  }

  connect = () => {
    this.connection = new WebSocket('ws://127.0.0.1:8000/ws/');
    this.connection.onclose = () => {
      this.connection = undefined;
    };

    this.connection.onerror = () => {
      
    };

    this.connection.onopen = () => {
      this.getOrders();
    };

    this.connection.onmessage = (event) => {
      const envelope: ServerEnvelope = JSON.parse(event.data);
      switch (envelope.messageType) {
        case ServerMessageType.success:
          const message: SuccessInfo = envelope.message

          if (message.subscriptionId) {
            this.store?.dispatch(subscribeMarketDataAction(message.subscriptionId));
          }

          if (message.order) {
            toast.info(`The order with id ${message.order.id} was ${message.description}`)
            this.getOrders();
          }

          if (message.orders && message.orders.length > 0) {
            this.store?.dispatch(loadOrdersAction(message.orders))
          }

          break;
        case ServerMessageType.error:
          
          break;
        case ServerMessageType.executionReport:

          break;
        case ServerMessageType.marketDataUpdate:
          const marketDataMessage: MarketDataUpdate = envelope.message
          if (marketDataMessage.quotes.length > 0 && marketDataMessage.instrument) {
            const instrument = marketDataMessage.instrument;
            const quote = marketDataMessage.quotes[0];
            this.store?.dispatch(loadQuoteAction(quote, instrument));
          }
          break;
      }
    };
  }

  disconnect = () => {
    this.connection?.close();
  }

  send = (message: ClientMessage) => {
    this.connection?.send(JSON.stringify(message));
  }

  subscribeMarketData = (instrument: Instrument) => {
    this.send({
      messageType: ClientMessageType.subscribeMarketData,
      message: {
        instrument,
      }
    });
  }

  unsubscribeMarketData = (subscriptionId: string) => {
    this.send({
      messageType: ClientMessageType.unsubscribeMarketData,
      message: {
        subscriptionId,
      }
    });
  }

  placeOrder = (instrument: Instrument, side: OrderSide, amount: Decimal, price: Decimal) => {
    this.send({
      messageType: ClientMessageType.placeOrder,
      message: {
        instrument,
        side,
        amount,
        price,
      }
    });
  }

  getOrders = () => {
    this.send({
      messageType: ClientMessageType.getOrders,
      message: {}
    })
  }

  cancelOrder = (orderId: number) => {
    this.send({
      messageType: ClientMessageType.cancelOrder,
      message: {
        orderId,
      }
    })
  }


}