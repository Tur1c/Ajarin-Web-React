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
import Login from './features/account/login/Login';
import Register from './features/account/register/pages/Register';
import ErrorPage from './shared/error-page/ErrorPage';
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
  useEffect(() => {
    const script = document.createElement('script');
    
  }, []);

  return (
    <RouterProvider router={router}></RouterProvider>
  );
}

export default App;
