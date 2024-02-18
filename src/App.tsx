import {
  Navigate,
  Route,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./App.css";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import { Login } from "./features/account/login";
import Profile from "./features/account/profile/Profile";
import { Register } from "./features/account/register";
import Home from "./features/dashboard/pages/home";
import { ErrorPage } from "./shared";

const isLogged = localStorage.getItem("jwt");
console.log(isLogged);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/register" element={<Register></Register>}></Route>
      <Route
        path="/profile"
        element={isLogged ? <Profile></Profile> : <Navigate to="/login" />}
      ></Route>
      <Route path="*" element={<ErrorPage></ErrorPage>}></Route>
    </Route>
  )
);

function App() {
  // return <RouterProvider router={router}></RouterProvider>;
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile></Profile>
            </ProtectedRoute>
          }
        ></Route>
        <Route path="*" element={<ErrorPage></ErrorPage>}></Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
