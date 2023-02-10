from __future__ import annotations

from typing import TYPE_CHECKING
import uuid
from server.enums import Instrument, OrderStatus, OrderSide
import asyncio
from server.utils import generateQuote, generateStatus
from server.database import get_database
from server.models.db_models import orders, OrderCreate, OrderDB
from fastapi import HTTPException
from server.models import server_messages
from datetime import datetime


if TYPE_CHECKING:
    import fastapi

    from server.models import client_messages
    from server.ntpro_server import NTProServer


async def subscribe_market_data_processor(
        server: NTProServer,
        websocket: fastapi.WebSocket,
        message: client_messages.SubscribeMarketData,
):
    con_obj = server.connections[websocket.client]
    random_id = uuid.uuid4()
    send_market_data_task = asyncio.create_task(send_market_data(server, websocket, random_id, message.instrument))
    con_obj.subscriptions[random_id] = send_market_data_task

    return server_messages.SuccessInfo(subscription_id = random_id)

async def send_market_data(server: NTProServer, websocket: fastapi.WebSocket, id: uuid, instr: Instrument):    
    while True:
        quote = generateQuote(instr)
        serv_message = server_messages.MarketDataUpdate(subscription_id = id, instrument = instr, quotes = [quote])
        await asyncio.sleep(1)
        await server.send(serv_message, websocket)

async def unsubscribe_market_data_processor(
        server: NTProServer,
        websocket: fastapi.WebSocket,
        message: client_messages.UnsubscribeMarketData,
):
    con_obj = server.connections[websocket.client]
    task = con_obj.subscriptions[message.subscription_id]
    task.cancel()

    return server_messages.SuccessInfo(description = f'{message.subscription_id} unsubscribed')

async def get_order_or_404(id: int) -> OrderDB:
    db = get_database()
    select_query = orders.select().where(orders.c.id == id)
    raw_order = await db.fetch_one(select_query)

    if raw_order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return OrderDB(**raw_order)

async def place_order_processor(
        server: NTProServer,
        websocket: fastapi.WebSocket,
        message: client_messages.PlaceOrder
):
    order = OrderCreate(
        status = generateStatus(), 
        instrument = Instrument(message.instrument), 
        side = OrderSide(message.side), 
        amount = message.amount, 
        price = message.price
    )

    db = get_database()
    insert_query = orders.insert().values(order.dict())
    order_id = await db.execute(insert_query)
    order_db = await get_order_or_404(order_id)

    return server_messages.SuccessInfo(order = order_db, description = 'created')

async def get_orders_processor(
        server: NTProServer,
        websocket: fastapi.WebSocket,
        message: client_messages.GetOrders
):
    db = get_database()
    select_query = orders.select()
    rows = await db.fetch_all(select_query)
    results = [OrderDB(**row) for row in rows]

    return server_messages.SuccessInfo(orders = results)

async def cancel_order_processor(
        server: NTProServer,
        websocket: fastapi.WebSocket,
        message: client_messages.CancelOrder
):
    db = get_database()
    update_query = (
        orders.update()
        .where(orders.c.id == message.order_id)
        .values(status = OrderStatus.cancelled, change_time = datetime.now())
    )
    await db.execute(update_query)
    order = await get_order_or_404(message.order_id)

    return server_messages.SuccessInfo(order = order, description = 'cancelled')