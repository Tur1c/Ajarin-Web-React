import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import { Login } from "./features/account/login";
import Profile from "./features/account/profile/Profile";
import { Register } from "./features/account/register";
import Coin from "./features/dashboard/pages/coin";
import Home from "./features/dashboard/pages/home";
import Forum from "./features/forum/page/forum";
import { ErrorPage } from "./shared";
import Calendar from "./features/calendar/Calendar";

function App() {
  // return <RouterProvider router={router}></RouterProvider>;
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/forum" element={<Forum></Forum>}></Route>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile></Profile>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/coin"
          element={
            <ProtectedRoute>
              <Coin></Coin>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
                <Calendar></Calendar>
            </ProtectedRoute>
          }
        ></Route>
        <Route path="*" element={<ErrorPage></ErrorPage>}></Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
