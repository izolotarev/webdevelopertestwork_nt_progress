import { Instrument } from '../Enums';
import { Order, Quote } from '../Models/Base';
import { RootState } from '../store/reducers/root-reducer';


export type MarketState = {
  subscriptionId: string,
  instrument?: Instrument,
  quote?: Quote,
  orders?: [Order],
  ordersLoaded: boolean,
}

export type State = RootState;