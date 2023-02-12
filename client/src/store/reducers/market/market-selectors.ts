import { ServerOrder, Quote } from '../../../Models/Base';
import { State } from '../../../types/types';
import { NameSpace } from '../root-reducer';

export const getSubscriptionId = (state: State): string | undefined => state[NameSpace.market].subscriptionId;
export const getQuote = (state: State): Quote | undefined => state[NameSpace.market].quote;
export const getOrders = (state: State): ServerOrder[] | undefined => state[NameSpace.market].orders;
export const getOrdersLoadedStatus = (state: State): boolean => state[NameSpace.market].ordersLoaded;