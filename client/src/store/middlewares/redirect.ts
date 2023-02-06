
import browserHistory from '../../browser-history/browser-history';
import { Middleware } from 'redux';
import { ActionType } from '../../const/const';
import { State } from '../../types/types';


export const redirect: Middleware<unknown, State> =
(_store) =>
  (next) =>
    (action) => {
      if (action.type === ActionType.RedirectToRoute) {
        browserHistory.push(action.payload.url);
      }
      return next(action);
    };
