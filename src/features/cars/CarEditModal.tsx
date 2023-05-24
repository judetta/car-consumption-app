import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField } from '@mui/material';

import { getCars } from './carsSlice';
import { addToFirestore, removeFromFirestore, updateInFirestore } from '../../firebase/firestore';
import { Car, CarType } from '../../shared/interfaces/car.interface';
import { useAppDispatch, useAppSelector } from '../../shared/hooks';
import { closeModal, selectCurrentModal, selectModalCar } from '../../shared/modalSlice';

export function CarEditModal() {

  const isOpen = useAppSelector(selectCurrentModal) === 'carEdit';
  const car = useAppSelector(selectModalCar);
  const dispatch = useAppDispatch();

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [registration, setRegistration] = useState('');
  const [type, setType] = useState<CarType>('electric');

  useEffect(() => {
    if (car) {
      setBrand(car.brand);
      setModel(car.model);
      setRegistration(car.registration);
      setType(car.type);
    }
  }, [car]);

  const saveData = async () => {
    const newData: Car = {
      brand: brand,
      model: model,
      registration: registration,
      type: type
    };
    if (car) {
      newData.id = car.id;
      await updateInFirestore('cars', newData);
    } else {
      await addToFirestore('cars', newData);
    }
    dismissModal();
    dispatch(getCars());
  };

  const deleteCar = async () => {
    // TODO: alert/confirmation?
    await removeFromFirestore('cars', car as Car);
    dismissModal();
    dispatch(getCars());
  };

  const dismissModal = () => {
    dispatch(closeModal());
    setBrand('');
    setModel('');
    setRegistration('');
    setType('electric');
  };

  return (
    <Dialog
      open={isOpen}
      onClose={dismissModal}
      className='Modal'
      fullWidth
    >
      <DialogTitle>{car ? 'Edit car details' : 'Add new car'}</DialogTitle>
      <DialogContent className="dialog-content">
        <TextField
          className="input"
          value={brand}
          label='Brand'
          onChange={e => setBrand(e.target.value)}
        />
        <TextField
          className="input"
          value={model}
          label='Model'
          onChange={e => setModel(e.target.value)}
        />
        <TextField
          className="input"
          value={registration}
          label='Registration'
          onChange={e => setRegistration(e.target.value)}
        />
        <Select
          className="input"
          value={type}
          onChange={e => setType(e.target.value as CarType)}
        >
          <MenuItem selected value='electric'>Electric</MenuItem>
          <MenuItem value='petrol'>Petrol</MenuItem>
          <MenuItem value='diesel'>Diesel</MenuItem>
          <MenuItem value='natural gas'>Natural gas</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button disabled={!car} color='error' onClick={deleteCar}>Remove</Button>
        <Button variant='outlined' color='secondary' onClick={dismissModal}>Cancel</Button>
        <Button variant='contained' onClick={saveData}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}