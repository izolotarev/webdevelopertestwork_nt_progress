import asyncio

import pytest
from fastapi.testclient import TestClient

from server.app import api


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def websocket_client():
    with TestClient(api) as websocket_client:
        yield websocket_client


@pytest.mark.asyncio
async def test_websocket_subscribe(websocket_client: TestClient):
    with websocket_client.websocket_connect("/ws/") as websocket:
        websocket.send_json({"messageType":1,"message":{"instrument":1}})
        message = websocket.receive_json()
        assert message["message"]["subscriptionId"] is not None


@pytest.mark.asyncio
async def test_websocket_unsubscribe(websocket_client: TestClient):
    with websocket_client.websocket_connect("/ws/") as websocket:
        websocket.send_json({"messageType":1,"message":{"instrument":1}})
        message = websocket.receive_json()
        subscription_id = message["message"]["subscriptionId"]

        websocket.send_json({"messageType":2,"message":{"subscriptionId":subscription_id}})
        message_success = websocket.receive_json()
        assert message_success["messageType"] == 1