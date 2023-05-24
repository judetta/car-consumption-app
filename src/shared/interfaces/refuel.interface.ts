export interface Refuel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id?: any;
  carId: string;
  date: string;
  amount: number;
  price: number;
  odometer: number;
}