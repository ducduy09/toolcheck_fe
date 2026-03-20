import { ExchangeRateProps } from "../type";

export function changeExchangeRate(data: ExchangeRateProps) {
  return {
    type: "CHANGE_EXCHANGE_RATE",
    data: data,
  };
}