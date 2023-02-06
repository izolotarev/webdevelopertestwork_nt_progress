import { combineReducers } from '@reduxjs/toolkit';
import { marketData } from './market/market-reducer';


export enum NameSpace {
  market = 'MARKET',
}

export const rootReducer = combineReducers({
  [NameSpace.market]: marketData,
});

export type RootState = ReturnType<typeof rootReducer>;