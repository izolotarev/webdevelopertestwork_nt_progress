import random
from decimal import Decimal
from server.enums import Instrument, OrderStatus
from server.models.base import Quote

def uuid_to_str(cls, v):
    if v:
        return str(v)
    return v

def to_str(cls, v):
    return str(v)

def generateQuote(inst: Instrument):
    if inst == Instrument.eur_usd:
        bid = decimalInRange(1.0722, 1.0742)
        offer = decimalInRange(1.0759, 1.0799)
        return Quote(bid = bid, offer = offer, min_amount = bid, max_amount = offer)
    
    if inst == Instrument.eur_rub:
        bid = decimalInRange(74.4885, 75.1234)
        offer = decimalInRange(76.1234, 77.6685)
        return Quote(bid = bid, offer = offer, min_amount = bid, max_amount = offer)

    if inst == Instrument.usd_rub:
        bid = decimalInRange(70.4465, 70.9213)
        offer = decimalInRange(71.1003, 71.1230)
        return Quote(bid = bid, offer = offer, min_amount = bid, max_amount = offer)

def decimalInRange(a, b):
    n = random.uniform(a, b)
    return round(Decimal(n), 4)

def generateStatus():
    n = random.randint(1, 3)
    return OrderStatus(n)