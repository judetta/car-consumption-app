import { createSlice } from '@reduxjs/toolkit';

import { Car } from './interfaces/car.interface';
import { Refuel } from './interfaces/refuel.interface';
import { RootState } from './store';

type Modal = null | 'carEdit' | 'refuelEdit';

type ModalPayload = {
  modal: Modal;
  car?: Car;
  refuel?: Refuel;
}

type ModalAction = {
  payload: ModalPayload;
  type: string;
}

type ModalState = {
  currentModal: Modal;
  currentCar: Car | undefined;
  currentRefuel: Refuel | undefined;
}

const initialState: ModalState = {
  currentModal: null,
  currentCar: undefined,
  currentRefuel: undefined
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: ModalAction) => {
      state.currentModal = action.payload.modal;
      state.currentCar = action.payload.car;
      state.currentRefuel = action.payload.refuel;
    },
    closeModal: state => {
      state.currentModal = null;
      // TODO dialog has some delay closing, thus flashing defaults right before closing
      state.currentCar = undefined;
      state.currentRefuel = undefined;
    }
  }
});

export const { openModal, closeModal } = modalSlice.actions;

export const selectCurrentModal = (state: RootState) => state.modal.currentModal;
export const selectModalCar = (state: RootState) => state.modal.currentCar;
export const selectModalRefuel = (state: RootState) => state.modal.currentRefuel;

export default modalSlice.reducer;