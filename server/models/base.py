from __future__ import annotations

import abc
import asyncio
import decimal
from typing import TypeVar

import pydantic

from server.enums import ClientMessageType, ServerMessageType
from pydantic import root_validator


def snake_to_camel(snake_str: str) -> str:
    if snake_str == "":
        return snake_str

    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


class Envelope(pydantic.BaseModel, abc.ABC):
    class Config:
        extra = pydantic.Extra.forbid
        alias_generator = snake_to_camel
        allow_population_by_field_name = True

    message_type: ClientMessageType | ServerMessageType
    message: dict

    @abc.abstractmethod
    def get_parsed_message(self): ...


class Message(pydantic.BaseModel, abc.ABC):
    class Config:
        frozen = True
        extra = pydantic.Extra.forbid
        alias_generator = snake_to_camel
        allow_population_by_field_name = True

    @abc.abstractmethod
    def get_type(self): ...


class Connection(pydantic.BaseModel):
    class Config:
        arbitrary_types_allowed = True

    subscriptions: dict[uuid, asyncio.Task] = {}


class Quote(pydantic.BaseModel):
    bid: decimal.Decimal
    offer: decimal.Decimal
    min_amount: decimal.Decimal
    max_amount: decimal.Decimal

    #serialize to str
    @root_validator()
    def dec_to_str(cls, values):
        values["bid"] = str(values["bid"])
        values["offer"] = str(values["offer"])
        values["min_amount"] = str(values["min_amount"])
        values["max_amount"] = str(values["max_amount"])
        return values


MessageT = TypeVar('MessageT', bound=Message)
