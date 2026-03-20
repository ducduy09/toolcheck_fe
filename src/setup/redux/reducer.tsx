import { combineReducers } from "@reduxjs/toolkit";
import { ExchangeRateProps } from "../type";
// import { firstInstallReducer } from "@container/home/redux/reducer";
// import { bgImageReducer } from "@container/account/redux/reducer";

const userInforState: ExchangeRateProps = {
  from: 'usd',
  to: 'usd',
  rate: 1,
  date: '',
};

export const changeRateReducer = (state = userInforState, action: any) => {
  switch (action.type) {
    case "CHANGE_EXCHANGE_RATE":
      return {
        ...state,
        from: action.data.from,
        to: action.data.to,
        rate: action.data.rate,
        date: action.data.date,
      };
    default:
      return state;
  }
};
export const rootReducer = combineReducers({
  // infoReducer,
  changeRateReducer,
});