from __future__ import annotations

import decimal
import uuid
from typing import TypeVar, TYPE_CHECKING

import bidict as bidict
import fastapi
import pydantic
from pydantic import validator, Field

from server import message_processors, enums
from server.models.base import Envelope, Message
from server.models.server_messages import ServerMessageT

if TYPE_CHECKING:
    from server.ntpro_server import NTProServer


class ClientEnvelope(Envelope):
    message_type: enums.ClientMessageType

    def get_parsed_message(self):
        return _CLIENT_MESSAGE_TYPE_BY_CLASS.inverse[self.message_type].parse_obj(self.message)


class ClientMessage(Message):
    async def process(self: ClientMessageT, server: NTProServer, websocket: fastapi.WebSocket) -> ServerMessageT:
        return await _MESSAGE_PROCESSOR_BY_CLASS[self.__class__](server, websocket, self)

    def get_type(self: ClientMessageT) -> enums.ClientMessageType:
        return _CLIENT_MESSAGE_TYPE_BY_CLASS[self.__class__]


class SubscribeMarketData(ClientMessage):
    instrument: enums.Instrument

    #"message":{"instrument":2}
    #convert 2 to enums.Instrument
    @validator("instrument", pre=True)
    def convert_int_to_enum(cls, v):
        instrument_list = [e for e in enums.Instrument]
        return instrument_list[v - 1]



class UnsubscribeMarketData(ClientMessage):
    subscription_id: uuid.UUID

class PlaceOrder(ClientMessage):
    instrument: enums.Instrument
    side: enums.OrderSide
    amount: pydantic.condecimal(gt=decimal.Decimal())
    price: pydantic.condecimal(gt=decimal.Decimal())


_MESSAGE_PROCESSOR_BY_CLASS = {
    SubscribeMarketData: message_processors.subscribe_market_data_processor,
    UnsubscribeMarketData: message_processors.unsubscribe_market_data_processor,
    PlaceOrder: message_processors.place_order_processor,
}
_CLIENT_MESSAGE_TYPE_BY_CLASS = bidict.bidict({
    SubscribeMarketData: enums.ClientMessageType.subscribe_market_data,
    UnsubscribeMarketData: enums.ClientMessageType.unsubscribe_market_data,
    PlaceOrder: enums.ClientMessageType.place_order,
})

ClientMessageT = TypeVar('ClientMessageT', bound=ClientMessage)
