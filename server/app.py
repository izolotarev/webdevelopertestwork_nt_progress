import mimetypes
import pathlib

import fastapi
from server.database import get_database, sqlalchemy_engine
from server.models.db_models import metadata
from server.ntpro_server import NTProServer
from databases import Database

api = fastapi.FastAPI()
server = NTProServer()
html = pathlib.Path('test.html').read_text()

@api.on_event("startup")
async def startup():
    await get_database().connect()
    metadata.create_all(sqlalchemy_engine)


@api.on_event("shutdown")
async def shutdown():
    await get_database().disconnect()


@api.get('/')
async def get():
    return fastapi.responses.HTMLResponse(html)


@api.get('/static/{path}')
async def get(path: pathlib.Path):
    static_file = (pathlib.Path('static') / path).read_text()
    mime_type, encoding = mimetypes.guess_type(path)
    return fastapi.responses.PlainTextResponse(static_file, media_type=mime_type)


@api.websocket('/ws/')
async def websocket_endpoint(websocket: fastapi.WebSocket):
    await server.connect(websocket)

    try:
        await server.serve(websocket)
    except fastapi.WebSocketDisconnect:
        server.disconnect(websocket)
