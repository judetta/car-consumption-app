/* eslint-disable @typescript-eslint/no-explicit-any */
import { Paper } from '@mui/material';
import { 
  BarController, 
  BarElement, 
  CategoryScale, 
  Chart as ChartJS, 
  ChartData, 
  ChartOptions, 
  Legend, 
  LinearScale, 
  LineController, 
  LineElement, 
  PointElement, 
  Title, 
  Tooltip 
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

import { calculateConsumption, sortRefuels } from '../../shared/helperFunctions';
import { CarType, units } from '../../shared/interfaces/car.interface';
import { Refuel } from '../../shared/interfaces/refuel.interface';

ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
);

export function ConsumptionChart(props: { refuels: Refuel[], type: CarType }) {

  const refuels = sortRefuels(props.refuels).reverse();
  const unit = units[props.type];
  const eventName = props.type === 'electric' ? 'Recharge' : 'Refuel';

  const getConsumptions = (): any[] => {
    const consumptionsData: any[] = [null];
    for (let i = 1; i < refuels.length; i++) {
      const distance = refuels[i].odometer - refuels[i - 1].odometer; 
      const cons = calculateConsumption(refuels[i].amount, distance);
      consumptionsData.push(cons);
    }
    return consumptionsData;
  };

  const options: ChartOptions = {
    elements: {
      bar: {
        backgroundColor: '#009688',
        hoverBackgroundColor: '#52c7b8',
        borderColor: '#009688',
      },
      line: {
        backgroundColor: '#37474f',
        borderColor: '#37474f',
      },
      point: {
        backgroundColor: '#37474f',
        borderColor: '#37474f',
      }
    },
    scales: {
      y: {
        title: {
          text: `Amount (${unit})`,
          display: true,
        },
        grace: '2%'
      },
      'y-cons': {
        title: {
          text: `Consumption (${unit}/100 km)`,
          display: true,
        },
        position: 'right',
        grace: '2%'
      }
    },
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
        }
      },
      title: {
        text: `${eventName} amount and consumption`,
        display: true,
      },
      tooltip: {
        boxPadding: 3,
        callbacks: {
          label: ctx => {
            let label = ctx.dataset.label ?? '';
            if (label === 'Amount') {
              label += `: ${ctx.parsed.y.toFixed(2)} ${unit}`;
            }
            if (label === 'Consumption') {
              label += `: ${ctx.parsed.y.toFixed(2)} ${unit}/100 km`;
            }
            return label;
          }
        }
      },
    }
  };

  const data: ChartData = {
    labels: refuels.map(r => r.date),
    datasets: [
      {
        type: 'line',
        data: getConsumptions(),
        label: 'Consumption',
        pointStyle: 'circle',
        yAxisID: 'y-cons'
      },
      {
        type: 'bar',
        data: refuels.map(r => r.amount),
        label: 'Amount',
        pointStyle: 'rect'
      },
    ]
  };

  return (
    <Paper sx={{ maxWidth: 900, maxHeight: 450 }}>
      <Chart type="bar" data={data} options={options} />
    </Paper>
  );
}