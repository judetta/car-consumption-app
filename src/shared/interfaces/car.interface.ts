export type CarType = 'electric' | 'petrol' | 'diesel' | 'natural gas'

export interface Car {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id?: any;
  type: CarType;
  brand: string;
  model: string;
  registration: string;
}

export const units: Record<CarType, string> = {
  'electric': 'kWh',
  'petrol': 'l',
  'diesel': 'l',
  'natural gas': 'kg',
};