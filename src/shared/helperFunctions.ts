import { Refuel } from './interfaces/refuel.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNumber = (input: any) => {
  if (isNaN(Number(input))) {
    return false;
  }
  return true;
};

/** Sorts array of `refuels` by date descending and then by odometer descending */
export const sortRefuels = (refuels: Refuel[]) => {
  if (!refuels.length) {
    return [];
  }
  const sorted = [...refuels].sort((a, b) => {
    if (a.date > b.date || a.odometer > b.odometer) {
      return -1;
    }
    if (a.date < b.date || a.odometer < b.odometer) {
      return 1;
    }
    return 0;
  });
  return sorted;
};

/** Get average consumption for 100 km */
export function calculateConsumption(amount: number, distance: number) {
  return (amount / (distance / 100));
}

/** Sum from array of numbers */
export function getSumFromArray(array: number[]) {
  array = array.filter(i => i !== undefined || null);
return array.reduce((a, b) => a + b, 0);
}

/** Average from array of numbers */
export function getAverageFromArray(array: number[]) {
  array = array.filter(i => i !== undefined || null);
  return (array.reduce((a, b) => a + b, 0) / array.length);

}
