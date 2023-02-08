export enum ActionType {
  SubscribeMarketData = 'MARKET/SUBSCRIBE_MARKET_DATA',
  UnsubscribeMarketData = 'MARKET/UNSUBSCRIBE_MARKET_DATA',
  LoadQuote = 'MARKET/LOAD_QUOTE',
  LoadOrders = 'MARKET/LOAD_ORDERS',
  RedirectToRoute = 'USER/REDIRECT',
}