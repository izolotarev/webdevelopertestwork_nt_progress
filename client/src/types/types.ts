import { Instrument } from '../Enums';
import { Quote } from '../Models/Base';
import { RootState } from '../store/reducers/root-reducer';


export type MarketState = {
  subscriptionId: string,
  instrument?: Instrument,
  quote?: Quote,
}

export type State = RootState;