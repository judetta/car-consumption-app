import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import modalReducer from './modalSlice';
import carsReducer from '../features/cars/carsSlice';
import refuelReducer from '../features/consumption/refuelSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    cars: carsReducer,
    refuel: refuelReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
