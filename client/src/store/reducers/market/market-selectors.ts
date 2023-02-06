import { Quote } from '../../../Models/Base';
import { State } from '../../../types/types';
import { NameSpace } from '../root-reducer';

export const getSubscriptionId = (state: State): string | undefined => state[NameSpace.market].subscriptionId;
export const getQuote = (state: State): Quote | undefined => state[NameSpace.market].quote;