import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFromFirestore } from '../../firebase/firestore';

import { Car } from '../../shared/interfaces/car.interface';
import { RootState } from '../../shared/store';

interface CarsState {
  cars: Car[];
  selectedCarId: string;
  isLoading: boolean;
  hasError: boolean;
}

const initialState: CarsState = {
  cars: [],
  selectedCarId: '',
  isLoading: false,
  hasError: false
};

export const getCars = createAsyncThunk(
  'cars/getCars',
  async () => {
    try {
      const cars = await getFromFirestore('cars');
      return cars;
    } catch (e) {
      console.log('Cannot get cars from Firestore:', e);
    }
  }
);

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    addCar: (state, action: PayloadAction<Car>) => {
      state.cars.push(action.payload);
    },
    removeCar: (state, action: PayloadAction<Car>) => {
      state.cars = state.cars.filter(c => c.id !== action.payload.id);
    },
    setSelectedCarId: (state, action: PayloadAction<string>) => {
      state.selectedCarId = action.payload;
    },
    resetCars: () => initialState
  },
  extraReducers: builder => {
    builder
      .addCase(getCars.pending, state => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getCars.fulfilled, (state, action) => {
        state.cars = action.payload as Car[];
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getCars.rejected, state => {
        state.isLoading = false;
        state.hasError = true;
      });
  }
});

export const { addCar, removeCar, setSelectedCarId, resetCars } = carsSlice.actions;

export const selectCars = (state: RootState) => state.cars.cars;
export const selectSeLectedCarId = (state: RootState) => state.cars.selectedCarId;
export const selectCarsLoadingState = (state: RootState) => state.cars.isLoading;
export const selectCarsHasErrorState = (state: RootState) => state.cars.hasError;

export default carsSlice.reducer;
