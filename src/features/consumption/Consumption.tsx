import { useEffect, useState } from 'react';
import { Button, FormControl, MenuItem, Select } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EvStationIcon from '@mui/icons-material/EvStation';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

import './Consumption.scss';
import { ConsumptionTable } from './ConsumptionTable';
import { ConsumptionChart } from './ConsumptionChart';
import { ConsumptionSummaryTable } from './ConsumptionSummaryTable';
import { LoadingSpinner } from '../loadingSpinner/LoadingSpinner';
import { selectRefuelLoadingState, selectRefuels } from './refuelSlice';
import { selectCars, selectCarsLoadingState, selectSeLectedCarId, setSelectedCarId } from '../cars/carsSlice';
import { useAppDispatch, useAppSelector } from '../../shared/hooks';
import { Car } from '../../shared/interfaces/car.interface';
import { openModal } from '../../shared/modalSlice';
import { Refuel } from '../../shared/interfaces/refuel.interface';
import { calculateConsumption, getAverageFromArray, getSumFromArray, sortRefuels } from '../../shared/helperFunctions';

export function Consumption() {

  const refuels = useAppSelector(selectRefuels);
  const refuelsLoading = useAppSelector(selectRefuelLoadingState);
  const cars = useAppSelector(selectCars);
  const carsLoading = useAppSelector(selectCarsLoadingState);
  const selectedCarId = useAppSelector(selectSeLectedCarId);
  const dispatch = useAppDispatch();

  const [carsWithCons, setCarsWithCons] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car>();
  const [selectedRefuels, setSelectedRefuels] = useState<Refuel[]>([]);
  const [totals, setTotals] = useState({ totalAmount: '', avgPrice: '', totalPrice: '', avgCons: '' });
  const [hasSeveralSameType, setHasSeveralSameType] = useState(false);
  const [totalsPerType, setTotalsPerType] = useState({ totalAmount: '', avgPrice: '', totalPrice: '' });
  
  useEffect(() => {
    const car = cars.find(c => c.id === selectedCarId);
    setSelectedCar(car);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCarId]);
  
  useEffect(() => {
    const carsWithCons = cars.filter(car => refuels.map(e => e.carId).includes(car.id));
    setCarsWithCons(carsWithCons);

    const selectedRefuels = sortRefuels(refuels.filter(r => r.carId === selectedCar?.id));
    setSelectedRefuels(selectedRefuels);

    if (selectedRefuels.length > 0) {
      // calculate sums & averages for table summary
      const lastIndex = selectedRefuels.length - 1;
      const totalAmount = getSumFromArray(selectedRefuels.map(r => r.amount));
      const avgPrice = getAverageFromArray(selectedRefuels.map(r => r.price / r.amount));
      const totalPrice = getSumFromArray(selectedRefuels.map(r => r.price));
      const avgCons = calculateConsumption(
        totalAmount - selectedRefuels[lastIndex].amount, 
        selectedRefuels[0].odometer - selectedRefuels[lastIndex].odometer
      );
      setTotals({ 
        totalAmount: totalAmount.toFixed(2),
        avgPrice: avgPrice.toFixed(3),
        totalPrice: totalPrice.toFixed(2),
        avgCons: avgCons.toFixed(2)
       });
    } else {
      setTotals({ totalAmount: '', avgPrice: '', totalPrice: '', avgCons: '' });
    }

    const selectedCarType = selectedCar?.type;
    if (selectedCarType) {
      const sameTypeCarIds = carsWithCons.filter(c => c.type === selectedCarType).map(c => c.id);
      if (sameTypeCarIds.length > 1) {
        setHasSeveralSameType(true);
        const sameTypeRefuels = refuels.filter(r => sameTypeCarIds.includes(r.carId));
        const totalAmount = getSumFromArray(sameTypeRefuels.map(r => r.amount));
        const avgPrice = getAverageFromArray(sameTypeRefuels.map(r => r.price / r.amount));
        const totalPrice = getSumFromArray(sameTypeRefuels.map(r => r.price));
        setTotalsPerType({
          totalAmount: totalAmount.toFixed(2),
          avgPrice: avgPrice.toFixed(3),
          totalPrice: totalPrice.toFixed(2)
        });
      } else {
        setHasSeveralSameType(false);
        setTotalsPerType({ totalAmount: '', avgPrice: '', totalPrice: '' });
      }
    } else {
      setHasSeveralSameType(false);
      setTotalsPerType({ totalAmount: '', avgPrice: '', totalPrice: '' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCar, refuels]);

  if (refuelsLoading || carsLoading) {
    return <LoadingSpinner />;
  }

  if (refuels.length === 0) {
    return (
      <div className="Consumption">
        <p>No consumption available</p>
        {cars.length > 0 &&
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => dispatch(openModal({ modal: 'refuelEdit' }))}
          >
            Add refuel or recharge
          </Button>
        }
        {cars.length === 0 &&
          <div>
            <p>Start by adding a car</p>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => dispatch(openModal({ modal: 'carEdit' }))}
            >
              Add your first car
            </Button>
          </div>
        }
      </div>
    );
  }

  return (
    <div className="Consumption">
      {carsWithCons.length > 0 &&
        <div className="row">
          <FormControl sx={{ minWidth: 250 }}>
            {!selectedCar &&
              <p>Select car</p>
            }
            <Select
              className="car-select"
              variant="standard"
              value={selectedCarId}
              onChange={e => dispatch(setSelectedCarId(e.target.value))}
            >
              {carsWithCons.map(car =>
                <MenuItem key={car.id} value={car.id}>
                  {car.brand} {car.model} ({car.registration})
                </MenuItem>)
              }
            </Select>
          </FormControl>
          {selectedCar &&
            <Button
              className="add-button"
              title={selectedCar.type === 'electric' ? 'Add recharge' : 'Add refuel'}
              variant='contained'
              size="small"
              onClick={() => dispatch(openModal({ modal: 'refuelEdit', car: selectedCar }))}
            >
              {selectedCar.type === 'electric' ? <EvStationIcon /> : <LocalGasStationIcon />}
              <AddIcon />
            </Button>
          }
        </div>
      }
      {selectedRefuels.length > 0 &&
        <ConsumptionTable refuels={selectedRefuels} totals={totals} />
      }
      {selectedRefuels.length > 2 && selectedCar &&
        <ConsumptionChart refuels={selectedRefuels} type={selectedCar.type} />
      }
      {hasSeveralSameType && selectedCar &&
        <ConsumptionSummaryTable type={selectedCar?.type} totals={totalsPerType} />
      }
    </div>
  );
}