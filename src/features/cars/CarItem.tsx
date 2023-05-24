import { IconButton, Paper } from '@mui/material';
import EvStationIcon from '@mui/icons-material/EvStation';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import './Cars.scss';
import { Car } from '../../shared/interfaces/car.interface';
import { useAppDispatch } from '../../shared/hooks';
import { openModal } from '../../shared/modalSlice';

export function CarItem(props: {car: Car}) {
  const car = props.car;

  const dispatch = useAppDispatch();

  const editCar = () => {
    dispatch(openModal({ modal: 'carEdit', car: car }));
  };

  const addRefuel = () => {
    dispatch(openModal({ modal: 'refuelEdit', car: car }));
  };

  return (
    <div>
      <Paper elevation={3} className='CarItem'>
        {car.type === 'electric' ? <EvStationIcon fontSize="large" /> : <LocalGasStationIcon fontSize="large" />}
        <div className="car-details">
          <p><strong>{car.brand} {car.model}</strong></p>
          <p>{car.registration}</p>
        </div>
        <div>
          <IconButton
            title="Edit car"
            color="primary"
            onClick={editCar}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            title={car.type === 'electric' ? 'Add recharge' : 'Add refuel'}
            color='primary'
            onClick={addRefuel}
          >
            <AddIcon />
          </IconButton>
        </div>
      </Paper>
    </div>
  );
}