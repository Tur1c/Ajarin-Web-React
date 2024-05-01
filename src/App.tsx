import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import { Login } from "./features/account/login";
import Profile from "./features/account/profile/Profile";
import { Register } from "./features/account/register";
import RegisterTeacher from "./features/account/register/components/RegisterTeacher";
import Calendar from "./features/calendar/Calendar";
import CourseDetail from "./features/course_detail/courseDetail";
import Coin from "./features/dashboard/pages/coin";
import Home from "./features/dashboard/pages/home";
import Forum from "./features/forum/page/forum";
import ForumDetail from "./features/forum/page/forumDetail";
import Lecturer from "./features/lecturer/lecturer";
import LecturerDetail from "./features/lecturer/lecturerDetail";
import { ErrorPage } from "./shared";
import CourseChapter from "./features/course_detail/courseChapter";
import LecturerRating from "./features/lecturer/lecturerRating";

function App() {
  // return <RouterProvider router={router}></RouterProvider>;
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/forum" element={<Forum></Forum>}></Route>
        <Route path="/lecturer" element={<Lecturer></Lecturer>}></Route>
        <Route
          path="/course/:course_title"
          element={<CourseDetail></CourseDetail>}
        ></Route>
        <Route
          path="/course/:course_title/:course_chapter"
          element={<CourseChapter></CourseChapter>}
        ></Route>
        <Route
          path="/lecturer/:lecturer_name"
          element={<LecturerDetail></LecturerDetail>}
        ></Route>
        <Route
          path="/lecturer/:lecturer_name/rating"
          element={<LecturerRating></LecturerRating>}
        ></Route>
        <Route
          path="/forum/:forum_title"
          element={<ForumDetail></ForumDetail>}
        ></Route>
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
        <Route
          path="/register/teacher"
          element={
            <ProtectedRoute>
              <RegisterTeacher></RegisterTeacher>
            </ProtectedRoute>
          }
        ></Route>
        <Route path="*" element={<ErrorPage></ErrorPage>}></Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
