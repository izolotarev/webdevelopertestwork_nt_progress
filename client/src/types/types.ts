import { Instrument } from '../Enums';
import { ServerOrder, Quote } from '../Models/Base';
import { RootState } from '../store/reducers/root-reducer';


export type MarketState = {
  subscriptionId: string,
  instrument?: Instrument,
  quote?: Quote,
  orders?: ServerOrder[],
  ordersLoaded: boolean,
}

export type State = RootState;