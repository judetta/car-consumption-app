import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { store } from './shared/store';
import './index.css';
import { App } from './App';
import { Cars } from './features/cars/Cars';
import { Consumption } from './features/consumption/Consumption';
import { Login } from './features/auth/Login';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <App /> }>
            <Route index element={ <Navigate to='cars' /> } />
            <Route path='cars' element={ <Cars /> } />
            <Route path='consumption' element={ <Consumption /> } />
            <Route path='login' element={ <Login /> } />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
