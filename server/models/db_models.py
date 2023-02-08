import sqlalchemy
from pydantic import BaseModel, Field
from datetime import datetime
from pydantic import validator, root_validator
from server.utils import to_str
from server.models.base import snake_to_camel
from server.enums import OrderStatus, OrderSide, Instrument
from decimal import Decimal

metadata = sqlalchemy.MetaData()

class OrderBase(BaseModel):
    creation_time: datetime = Field(default_factory=datetime.now)
    change_time: datetime = Field(default_factory=datetime.now)
    status: OrderStatus
    side: OrderSide
    price: Decimal
    amount: Decimal
    instrument: Instrument

    _vaidate_creation_time = validator("creation_time", allow_reuse = True)(to_str)
    _vaidate_change_time = validator("change_time", allow_reuse = True)(to_str)
    _vaidate_price = validator("price", allow_reuse = True)(to_str)
    _vaidate_amount = validator("amount", allow_reuse = True)(to_str)

    class Config:
        alias_generator = snake_to_camel
        allow_population_by_field_name = True

  

class OrderCreate(OrderBase):
    pass

class OrderDB(OrderBase):
    id: int

  

orders = sqlalchemy.Table(
    "orders",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True, autoincrement=True),
    sqlalchemy.Column("creation_time", sqlalchemy.DateTime(), nullable=False),
    sqlalchemy.Column("change_time", sqlalchemy.DateTime(), nullable=False),
    sqlalchemy.Column("status", sqlalchemy.Integer, nullable=False),
    sqlalchemy.Column("side", sqlalchemy.Integer, nullable=False),
    sqlalchemy.Column("price", sqlalchemy.Float, nullable=False),
    sqlalchemy.Column("amount", sqlalchemy.Float, nullable=False),
    sqlalchemy.Column("instrument", sqlalchemy.Integer, nullable=False),
)