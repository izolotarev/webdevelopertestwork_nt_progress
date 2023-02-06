from __future__ import annotations

from typing import TYPE_CHECKING
import uuid
from server.enums import Instrument
import asyncio
from server.utils import generateQuote

if TYPE_CHECKING:
    import fastapi

    from server.models import client_messages
    from server.ntpro_server import NTProServer


async def subscribe_market_data_processor(
        server: NTProServer,
        websocket: fastapi.WebSocket,
        message: client_messages.SubscribeMarketData,
):
    from server.models import server_messages

    # TODO ...
    con_obj = server.connections[websocket.client]
    random_id = uuid.uuid4()
    send_market_data_task = asyncio.create_task(send_market_data(server, websocket, random_id, message.instrument))
    con_obj.subscriptions[random_id] = send_market_data_task

    return server_messages.SuccessInfo(subscription_id = random_id)

async def send_market_data(server: NTProServer, websocket: fastapi.WebSocket, id: uuid, instr: Instrument):
    from server.models import server_messages
    
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
    from server.models import server_messages

    # TODO ...
    con_obj = server.connections[websocket.client]
    task = con_obj.subscriptions[message.subscription_id]
    task.cancel()

    return server_messages.SuccessInfo(description = f'{message.subscription_id} unsubscribed')


async def place_order_processor(
        server: NTProServer,
        websocket: fastapi.WebSocket,
        message: client_messages.PlaceOrder,
):
    from server.models import server_messages

    # TODO ...

    return server_messages.SuccessInfo()
