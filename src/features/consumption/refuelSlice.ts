import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getFromFirestore } from '../../firebase/firestore';
import { Refuel } from '../../shared/interfaces/refuel.interface';
import { RootState } from '../../shared/store';

interface RefuelState {
  events: Refuel[];
  isLoading: boolean;
  hasError: boolean;
}

const initialState: RefuelState = {
  events: [],
  isLoading: false,
  hasError: false
};

export const getRefuels = createAsyncThunk(
  'refuel/getRefuels',
  async () => {
    try {
      const events = await getFromFirestore('events');
      return events;
    } catch (e) {
      console.log('Cannot get events from Firestore:', e);
    }
  }
);

const refuelSlice = createSlice({
  name: 'refuel',
  initialState,
  reducers: {
    addRefuel: (state, action: PayloadAction<Refuel>) => {
      state.events.push(action.payload);
    },
    removeRefuel: (state, action: PayloadAction<Refuel>) => {
      state.events = state.events.filter(e => e.id !== action.payload.id);
    },
    resetRefuels: () => initialState
  },
  extraReducers: builder => {
    builder
      .addCase(getRefuels.pending, state => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getRefuels.fulfilled, (state, action) => {
        state.events = action.payload as Refuel[];
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getRefuels.rejected, state => {
        state.isLoading = false;
        state.hasError = true;
      });
  }
});

export const { addRefuel, removeRefuel, resetRefuels } = refuelSlice.actions;

export const selectRefuels = (state: RootState) => state.refuel.events;
export const selectRefuelLoadingState = (state: RootState) => state.refuel.isLoading;
export const selectRefuelHasErrorState = (state: RootState) => state.refuel.hasError;

export default refuelSlice.reducer;