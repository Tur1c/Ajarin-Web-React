import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./App.css";
import { Login } from "./features/account/login";
import { Register } from "./features/account/register";
import Home from "./features/dashboard/pages/home";
import { ErrorPage } from "./shared";
import Profile from "./features/account/profile/Profile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/register" element={<Register></Register>}></Route>
      <Route path="/profile" element={<Profile></Profile>}></Route>
      <Route path="*" element={<ErrorPage></ErrorPage>}></Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
