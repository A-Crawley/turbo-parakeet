export const formatDate = (date: Date): string => {
  return `${formatNumber(date.getDate())}/${formatNumber(
    date.getMonth() + 1
  )}/${date.getFullYear()}`;
};

const formatNumber = (number: Number): string => {
  let stringValue = number.toString();
  if (number < 10) stringValue = `0${number}`;
  return stringValue;
};

// CURRENCY CONVERSION
// 1000 Copper => 1 Silver
// 1000 Silver => 1 Gold

interface Currency {
  copper: number;
  silver: number;
  gold: number;
}

export const getCurrenyDivisions = (copper: number): Currency => {
  const silverConversionRate = 1000;
  const goldConversionRate = silverConversionRate * 1000;

  copper = Math.round(copper);

  let currency = { copper: 0, silver: 0, gold: 0 };

  if (copper >= goldConversionRate) {
    let temp = Math.floor(copper / goldConversionRate);
    currency.gold = temp;
    copper -= temp * goldConversionRate;
  }

  if (copper >= silverConversionRate) {
    let temp = Math.floor(copper / silverConversionRate);
    currency.silver = temp;
    copper -= temp * silverConversionRate;
  }

  if (copper > 0) {
    currency.copper = copper;
  }

  return currency;
};

export const prettyPrintCurrency = (currency: Currency): string => {
  return `${currency.gold > 0 ? currency.gold + "g" : ""} 
      ${currency.silver > 0 ? currency.silver + "s" : ""} 
      ${currency.copper > 0 ? currency.copper + "c" : "0c"}`;
};
