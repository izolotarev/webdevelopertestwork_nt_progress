import {ClientMessage} from "./Models/ClientMessages";
import {ClientMessageType, Instrument, OrderSide, ServerMessageType} from "./Enums";
import Decimal from "decimal.js";
import {ServerEnvelope} from "./Models/ServerMessages";

class WSConnector {
  connection: WebSocket | undefined;

  constructor() {
    this.connection = undefined;
  }

  connect = () => {
    this.connection = new WebSocket('ws://127.0.0.1:8000/ws/');
    this.connection.onclose = () => {
      this.connection = undefined;
    };

    this.connection.onerror = () => {
      
    };

    this.connection.onopen = () => {
      
    };

    this.connection.onmessage = (event) => {
      const message: ServerEnvelope = JSON.parse(event.data);
      console.log(message);
      switch (message.messageType) {
        case ServerMessageType.success:
          
          break;
        case ServerMessageType.error:
          
          break;
        case ServerMessageType.executionReport:

          break;
        case ServerMessageType.marketDataUpdate:

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
}

export const wsClient = new WSConnector(); 