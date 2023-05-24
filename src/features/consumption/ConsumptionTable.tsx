import { useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';

import './Consumption.scss';
import { ConsumptionTableRow } from './ConsumptionTableRow';
import { selectCars } from '../cars/carsSlice';
import { sortRefuels } from '../../shared/helperFunctions';
import { Refuel } from '../../shared/interfaces/refuel.interface';
import { useAppSelector } from '../../shared/hooks';
import { units } from '../../shared/interfaces/car.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ConsumptionTable(props: { refuels: Refuel[], totals: any }) {

  const refuels = sortRefuels(props.refuels);
  const totals = props.totals;
  const cars = useAppSelector(selectCars);
  const type = cars.find(car => car.id === refuels[0].carId)?.type;
  const unit = type ? units[type] : 'unknown';

  // get the previous refuel to calculate distance and average on rows
  const lastIndex = refuels.length - 1;
  const getPrevious = (current: Refuel): Refuel | null => {
    const currentIndex = refuels.findIndex(r => r.id === current.id);
    if (currentIndex !== lastIndex) {
      return refuels[currentIndex + 1];
    }
    return null;
  };

  // table pagination handling
  const rowsPerPage = 5;
  const [page, setPage] = useState(0);
  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 900 }}>
      <Table sx={{ width: 900 }} size='small'>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align='right'>Amount</TableCell>
            <TableCell align='right'>Price per {unit}</TableCell>
            <TableCell align='right'>Total price</TableCell>
            <TableCell align='right'>Odometer</TableCell>
            <TableCell align='right'>Driven since last</TableCell>
            <TableCell align='right'>Consumption</TableCell>
            <TableCell align='right'></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? refuels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : refuels
          ).map(refuel =>
            <ConsumptionTableRow
              key={refuel.id}
              unit={unit}
              refuel={refuel}
              previous={getPrevious(refuel)}
            />
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={refuels.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPageOptions={[5]}
            />
          </TableRow>
          <TableRow>
            <TableCell>Totals</TableCell>
            <TableCell align='right'>{totals.totalAmount}&nbsp;{unit}</TableCell>
            <TableCell align='right'>{totals.avgPrice}&nbsp;€</TableCell>
            <TableCell align='right'>{totals.totalPrice}&nbsp;€</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell align='right'>
              {refuels.length > 1 ? `${totals.avgCons} ${unit}/100 km` : 'Not enough data'}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>

      </Table>
    </TableContainer>
  );
}