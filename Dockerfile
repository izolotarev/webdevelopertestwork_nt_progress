FROM tiangolo/uvicorn-gunicorn:python3.10

ENV APP_MODULE server.app:api

COPY ./server/requirements.txt /app

RUN pip install --upgrade pip && \
    pip install -r /app/requirements.txt

COPY ./ /app