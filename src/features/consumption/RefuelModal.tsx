import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField } from '@mui/material';

import { getRefuels } from './refuelSlice';
import { selectCars } from '../cars/carsSlice';
import { addToFirestore, removeFromFirestore, updateInFirestore } from '../../firebase/firestore';
import { closeModal, selectCurrentModal, selectModalCar, selectModalRefuel } from '../../shared/modalSlice';
import { useAppDispatch, useAppSelector } from '../../shared/hooks';
import { Car, units } from '../../shared/interfaces/car.interface';
import { Refuel } from '../../shared/interfaces/refuel.interface';

export function RefuelModal() {

  // today formatted 'yyyy-MM-dd' for the date input
  const today = (new Date().toLocaleDateString('en-CA'));
  const [isValid, setIsValid] = useState(false);

  const numberPattern = '[0-9]{1,}[.]{0,1}[0-9]{0,5}';

  const isOpen = useAppSelector(selectCurrentModal) === 'refuelEdit';
  const refuel = useAppSelector(selectModalRefuel);
  const initialCar = useAppSelector(selectModalCar);
  const cars = useAppSelector(selectCars);
  const dispatch = useAppDispatch();

  const [car, setCar] = useState<Car>();
  const [unit, setUnit] = useState('');
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [odometer, setOdometer] = useState('');

  const [amountIsValid, setAmountIsValid] = useState(true);
  const [priceIsValid, setPriceIsValid] = useState(true);
  const [odometerIsValid, setOdometerIsValid] = useState(true);

  useEffect(() => {
    if (initialCar) {
      setCar(initialCar);
    }
    if (refuel) {
      setCar(cars.find(c => c.id === refuel.carId));
      setDate(refuel.date ?? today);
      setAmount(refuel.amount?.toString() ?? '');
      setPrice(refuel.price?.toString() ?? '');
      setOdometer(refuel.odometer?.toString() ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCar, refuel]);

  useEffect(() => {
    const unit = car ? units[car.type] : '';
    setUnit(unit);
  }, [car]);

  useEffect(() => {
    const hasData = amount !== '' && price !== '' && odometer !== '';
    const dataIsValid = amountIsValid && priceIsValid && odometerIsValid;
    setIsValid(hasData && dataIsValid);
  }, [amountIsValid, priceIsValid, odometerIsValid, amount, price, odometer]);

  const deleteRefuel = async () => {
    await removeFromFirestore('events', refuel as Refuel);
    dismissModal();
    dispatch(getRefuels());
  };

  const saveRefuel = async () => {
    const newData: Refuel = {
      carId: car?.id,
      date: date,
      amount: Number(amount),
      price: Number(price),
      odometer: Number(odometer)
    };
    if (refuel) {
      newData.id = refuel.id;
      await updateInFirestore('events', newData);
    } else {
      await addToFirestore('events', newData);
    }
    dispatch(getRefuels());
    dismissModal();
  };

  const dismissModal = () => {
    dispatch(closeModal());
    setCar(undefined);
    resetForm();
  };

  const resetForm = () => {
    setDate(today);
    setAmount('');
    setPrice('');
    setOdometer('');
  };

  return (
    <Dialog
      open={isOpen}
      onClose={dismissModal}
      className='Modal'
      fullWidth
    >
      <DialogTitle>{refuel ? 'Edit details' : `Add new ${car?.type === 'electric' ? 'recharge' : 'refuel'}`}</DialogTitle>
      <DialogContent className="dialog-content">
        <Select
          className="input"
          value={car?.id ?? cars[0]?.id ?? ''}
          onChange={e => setCar(cars.find(c => c.id === e.target.value))}
          required
        >
          {cars.map((car, index) =>
            <MenuItem key={index} value={car.id}>
              {car.brand} {car.model} ({car.registration})
            </MenuItem>)
          }
        </Select>
        <TextField
          id="date"
          name="date"
          className='input'
          value={date}
          type='date'
          onChange={e => setDate(e.target.value)}
          required
        />
        <TextField
          id="amount"
          name="amount"
          className="input"
          value={amount}
          label={`Amount (${unit})`}
          required={true}
          inputProps={{ pattern: numberPattern }}
          onChange={e => { setAmount(e.target.value); setAmountIsValid(e.target.validity.valid); }}
          error={!amountIsValid}
        />
        <TextField
          id="price"
          name="price"
          className="input"
          value={price}
          label='Total price (€)'
          required={true}
          inputProps={{ pattern: numberPattern }}
          onChange={e => { setPrice(e.target.value); setPriceIsValid(e.target.validity.valid); }}
          error={!priceIsValid}
        />
        <TextField
          id="odometer"
          name="odometer"
          className="input"
          value={odometer}
          label='Odometer (km)'
          required={true}
          inputProps={{ pattern: numberPattern }}
          onChange={e => { setOdometer(e.target.value); setOdometerIsValid(e.target.validity.valid); }}
          error={!odometerIsValid}
        />
      </DialogContent>
      <DialogActions>
        {refuel
          ? <Button color='error' onClick={deleteRefuel}>Remove</Button>
          : <Button color='error' onClick={resetForm}>Reset</Button>
        }
        <Button variant='outlined' color='secondary' onClick={dismissModal}>Cancel</Button>
        <Button disabled={!isValid} variant='contained' onClick={saveRefuel}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}