import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Route,
  BrowserRouter as Router,
  RouterProvider,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { ErrorPage } from './shared';
import { Register } from './features/account/register';
import { Login } from './features/account/login';
import Home from './features/dashboard/Home';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<Home></Home>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/register" element={<Register></Register>}></Route>

      <Route path="*" element={<ErrorPage></ErrorPage>}></Route>
    </Route>
  )
);

function App() {

  return (
    <RouterProvider router={router}></RouterProvider>
  );
}

export default App;
