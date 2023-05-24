import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { CarItem } from './CarItem';
import { LoadingSpinner } from '../loadingSpinner/LoadingSpinner';
import { selectCars, selectCarsLoadingState } from './carsSlice';
import { useAppDispatch, useAppSelector } from '../../shared/hooks';
import { openModal } from '../../shared/modalSlice';

export function Cars() {

  const cars = useAppSelector(selectCars);
  const isLoading = useAppSelector(selectCarsLoadingState);
  const dispatch = useAppDispatch();

  const addCar = () => {
    dispatch(openModal({ modal: 'carEdit' }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="Cars">
      {cars?.map(c => <CarItem key={c.id} car={c} />)}
      <Button
        className="new-car-btn"
        variant='contained'
        startIcon={<AddIcon />}
        onClick={addCar} 
      >
        Add new car
      </Button>
    </div>
  );
}