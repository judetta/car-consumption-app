import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { CarType, units } from '../../shared/interfaces/car.interface';

export function ConsumptionSummaryTable(props: { 
  type: CarType, 
  totals: { totalAmount: string, avgPrice: string, totalPrice: string } 
}) {

  const { type, totals } = props;
  const unit = units[type];

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 400 }}>
      <Table sx={{ width: 400 }} size='small'>
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}>
              Summary for {type} cars
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Amount</TableCell>
            <TableCell>Price per unit</TableCell>
            <TableCell>Total price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{totals.totalAmount}&nbsp;{unit}</TableCell>
            <TableCell>{totals.avgPrice}&nbsp;€/{unit}</TableCell>
            <TableCell>{totals.totalPrice}&nbsp;€</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}