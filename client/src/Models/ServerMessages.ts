import {Instrument, OrderStatus} from "../Enums";
import {Envelope, Message, ServerOrder, Quote} from "./Base";

export interface ServerEnvelope extends Envelope {
    messageType: ServerMessage
}

export interface ServerMessage extends Message {

}

export interface ErrorInfo extends ServerMessage {
    reason: string
}

export interface SuccessInfo extends ServerMessage {
    subscriptionId?: string
    description?: string
    order?: ServerOrder
    orders?: ServerOrder[]
}

export interface ExecutionReport extends ServerMessage {
    orderId: string
    orderStatus: OrderStatus
}

export interface MarketDataUpdate extends ServerMessage {
    subscriptionId: string
    instrument: Instrument
    quotes: Quote[]
}
