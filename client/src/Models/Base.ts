import Decimal from "decimal.js";
import { Instrument, OrderSide, OrderStatus } from '../Enums';
import {ClientMessage} from "./ClientMessages";
import {ServerMessage} from "./ServerMessages";

export interface Envelope {
    messageType: ClientMessage | ServerMessage
    message: any
}

export interface Message {

}

export interface Quote {
    bid: Decimal
    offer: Decimal
    minAmount: Decimal
    maxAmount: Decimal
}

export interface Order {
    side: OrderSide
    price: Decimal
    amount: Decimal
    instrument: Instrument
}

export interface ClientOrder extends Order {}

export interface ServerOrder extends Order {
    id: number
    creationTime: Date
    changeTime: Date
    status: OrderStatus
}