import { store } from './reduxStore';
import WSConnector from './WSClient';

export const wsClient = new WSConnector(store); //Singleton
wsClient.connect();