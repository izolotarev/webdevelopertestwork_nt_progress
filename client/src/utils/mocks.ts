import Decimal from 'decimal.js';
import { Instrument, OrderSide, OrderStatus } from '../Enums';
import { ServerOrder } from '../Models/Base';

export const makeFakeOrder = (): ServerOrder => ({
  id: 1,
  creationTime: new Date(),
  changeTime: new Date(),
  status: OrderStatus.active,
  side: OrderSide.buy,
  price: new Decimal('123.2'),
  amount: new Decimal('123.2'),
  instrument: Instrument.eur_usd,
});