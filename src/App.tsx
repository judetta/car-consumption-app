import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button, createTheme, ThemeProvider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import './App.scss';
import { login, logout, selectUser } from './features/auth/authSlice';
import { CarEditModal } from './features/cars/CarEditModal';
import { auth } from './firebase/firebase';
import { useAppDispatch, useAppSelector } from './shared/hooks';
import { getCars, resetCars } from './features/cars/carsSlice';
import { RefuelModal } from './features/consumption/RefuelModal';
import { getRefuels, resetRefuels } from './features/consumption/refuelSlice';

const theme = createTheme({
  palette: {
    primary: {
      light: '#39796b',
      main: '#004d40',
      dark: '#00251a',
      contrastText: '#fff',
    },
    secondary: {
      light: '#62727b',
      main: '#37474f',
      dark: '#102027',
      contrastText: '#fff',
    },
  },
});

export function App() {

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(login({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        }));
        dispatch(getCars());
        dispatch(getRefuels());
      } else {
        dispatch(logout());
        dispatch(resetCars());
        dispatch(resetRefuels());
        navigate('/login');
      }
    });
    // eslint-disable-next-line
  }, []);

  const handleLogout = () => {
    // this will trigger onAuthStateChanged 
    // so no need to repeat dispatch & navigate here
    auth.signOut();
  };

  return (
    <ThemeProvider theme={theme}>
      <header>
        <h1>Car Consumption App</h1>
        <div hidden={!user} className='user-details'> 
          Signed in as {user?.displayName ?? user?.email}
          <Button
            className='logout-button'
            size='small'
            variant='contained'
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
        <nav>
          <NavLink to='/cars'>My cars</NavLink> 
          <NavLink to='/consumption'>Consumption</NavLink>
        </nav>
      </header>
      <Outlet />
      <CarEditModal />
      <RefuelModal />
    </ThemeProvider>

  );
}