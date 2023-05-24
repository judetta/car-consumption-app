import { IconButton, TableCell, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { getRefuels, removeRefuel } from './refuelSlice';
import { removeFromFirestore } from '../../firebase/firestore';
import { Refuel } from '../../shared/interfaces/refuel.interface';
import { calculateConsumption } from '../../shared/helperFunctions';
import { useAppDispatch } from '../../shared/hooks';

export function ConsumptionTableRow(props: { unit: string, refuel: Refuel, previous: Refuel | null }) {

  const { unit, refuel, previous } = props;

  const dispatch = useAppDispatch();

  const eventDate = (new Date(refuel.date)).toLocaleDateString();
  const pricePerUnit = (refuel.price / refuel.amount).toFixed(3);
  const kmSinceLast = previous ? refuel.odometer - previous.odometer : null;
  const consPer100Km = kmSinceLast ? calculateConsumption(refuel.amount, kmSinceLast).toFixed(2) : null;

  const handleDelete = async () => {
    await removeFromFirestore('events', refuel);
    dispatch(removeRefuel(refuel));
    dispatch(getRefuels());
  };

  return (
    <TableRow>
      <TableCell>{eventDate}</TableCell>
      <TableCell align='right'>{refuel.amount.toFixed(2)}&nbsp;{unit}</TableCell>
      <TableCell align='right'>{pricePerUnit}&nbsp;€</TableCell>
      <TableCell align='right'>{refuel.price.toFixed(2)}&nbsp;€</TableCell>
      <TableCell align='right'>{refuel.odometer.toFixed(0)}&nbsp;km</TableCell>
      <TableCell align='right'>{kmSinceLast ? `${kmSinceLast.toFixed(0)} km` : 'No previous data'}</TableCell>
      <TableCell align='right'>{consPer100Km ? `${consPer100Km} ${unit}/100 km` : 'No previous data'}</TableCell>
      <TableCell align='center'>
        <IconButton onClick={handleDelete}>
          <DeleteIcon fontSize='small' color='error' />
        </IconButton>
      </TableCell>
    </TableRow>

  );
}