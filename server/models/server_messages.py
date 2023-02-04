from __future__ import annotations

import uuid
from typing import TypeVar, Optional

import bidict as bidict

from server import enums
from server.models.base import Envelope, Message, Quote

from pydantic import validator, Field, Extra
from server.models.base import snake_to_camel
from server.utils import uuid_to_str

class ServerMessage(Message):
    class Config:
        extra = Extra.forbid

    def get_type(self: ServerMessageT) -> enums.ServerMessageType:
        return _SERVER_MESSAGE_TYPE_BY_CLASS[self.__class__]

class ErrorInfo(ServerMessage):
    reason: str


class SuccessInfo(ServerMessage):
    subscription_id: Optional[uuid.UUID] = Field(None)
    
    _vaidate_id = validator("subscription_id", allow_reuse = True)(uuid_to_str)


class ExecutionReport(ServerMessage):
    order_id: uuid.UUID
    order_status: enums.OrderStatus


class MarketDataUpdate(ServerMessage):
    subscription_id: uuid.UUID
    instrument: enums.Instrument
    quotes: list[Quote]

    _vaidate_id = validator("subscription_id", allow_reuse = True)(uuid_to_str)


class ServerEnvelope(Envelope):
    message_type: enums.ServerMessageType

    def get_parsed_message(self):
        return _SERVER_MESSAGE_TYPE_BY_CLASS.inverse[self.message_type].parse_obj(self.message)


_SERVER_MESSAGE_TYPE_BY_CLASS = bidict.bidict({
    SuccessInfo: enums.ServerMessageType.success,
    ErrorInfo: enums.ServerMessageType.error,
    ExecutionReport: enums.ServerMessageType.execution_report,
    MarketDataUpdate: enums.ServerMessageType.market_data_update,
})
ServerMessageT = TypeVar('ServerMessageT', bound=ServerMessage)

