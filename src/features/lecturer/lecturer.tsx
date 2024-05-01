import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "../../api/axios";
import useModal from "../../hooks/useModal";
import {
  AccountOutput,
  AccountSchema,
  PrivateDiscOut,
  SubscribedLecturer,
  transfromToAccountOutput,
} from "../../model/Account";
import { ApiResponse } from "../../model/schema/base_schema";
import {
  InquiryTeacherSchema,
  TeacherListOutput,
  transfromToTeacherListOutput,
} from "../../model/teacher/teacher-model";
import { Pagination, Sidebar } from "../../shared";
import "./lecturer.css";
import ReqPrivate from "./reqPrivate";

const INQUIRY_TEACHER = "/api/account/inquiry/teacher";
const UNSUBSCRIBE_LECTURER = "/api/account/unsubscribe?teacher-id=";

const Lecturer = () => {
  const isLogged = sessionStorage.getItem("jwt");
  const emailUser = sessionStorage.getItem("user");
  const userRole = sessionStorage.getItem("role");
  const { state } = useLocation();
  const [searchText, setSearchText] = useState("");
  const [searchTeacherText, setSearchTeacherText] = useState("");

  const HOME_URL = "/api/account?email=" + emailUser;

  console.log(state, "state lecturer");

  const navigate = useNavigate();

  const [teachers, setTeacher] = useState<TeacherListOutput>({
    teachers: [],
  });

  const [tempTeachers, setTempTeacher] = useState<TeacherListOutput>({
    teachers: [],
  });

  const [account, setAccount] = useState<AccountOutput>({
    fullName: "",
    firstName: "",
    lastName: "",
    email: "",
    age: 0,
    gender: "",
    phoneNumber: "",
    education: "",
    city: "",
    country: "",
    school: "",
    coin: 0,
    studentdisc_list: [],
    studentcourse_list: [],
    subscribed_lecturer: [],
    urlImage: "",
    notification: [],
  });

  const [tempAccount, setTempAccount] = useState<AccountOutput>({
    fullName: "",
    firstName: "",
    lastName: "",
    email: "",
    age: 0,
    gender: "",
    phoneNumber: "",
    education: "",
    city: "",
    country: "",
    school: "",
    coin: 0,
    studentdisc_list: [],
    studentcourse_list: [],
    subscribed_lecturer: [],
    urlImage: "",
    notification: [],
  });

  //modal
  const { isOpen, toggle } = useModal();
  const [teacherid, setTeacherId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMyLecturer, setIsLoadingMyLecturer] = useState(false);
  const [isLoadingChangeAccount, setIsLoadingChangeAccount] = useState(false);

  const fetchTeacherData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse<InquiryTeacherSchema>>(
        INQUIRY_TEACHER,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // console.log(response,"lecturer");
      setIsLoading(true);
      setTeacher(transfromToTeacherListOutput(response.data.outputSchema));
      setTempTeacher(transfromToTeacherListOutput(response.data.outputSchema));
    } catch (error) {}
    // setTimeout(() => {
    setIsLoading(false);
    // }, 1000);
  };

  const fetchDataAccount = async () => {
    setIsLoadingMyLecturer(true);
    try {
      const response = await axios.get<ApiResponse<AccountSchema>>(HOME_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + isLogged,
        },
        withCredentials: true,
      });
      setAccount(transfromToAccountOutput(response.data.outputSchema));
      setTempAccount(transfromToAccountOutput(response.data.outputSchema));
    } catch (error) {}
    setIsLoadingMyLecturer(false);
  };

  const handleTeacherDetail = (data: any) => {
    navigate("/lecturer/" + data.account.fullName, {
      state: { data, account },
    });
  };

  const unsubscribeLecturer = async (data: SubscribedLecturer) => {
    try {
      const response = await axios.get(
        UNSUBSCRIBE_LECTURER + data.id + "&email=" + emailUser,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + isLogged,
          },
          withCredentials: true,
        }
      );
      Swal.fire({
        title: "Success Subscribed Lecturer",
        icon: "success",
        background: "#11235a",
        color: "#fff",
        confirmButtonColor: "#f6e976",
        confirmButtonText: "<span style='color:#000'> <b>OK</b> </span>",
      }).then(function () {
        fetchDataAccount();
        currentTeacherList = account.subscribed_lecturer.slice(
          firstIndex,
          lastIndex
        );
      });
    } catch (error) {}
  };

  const handleUnsubscribe = (data: SubscribedLecturer) => {
    unsubscribeLecturer(data);
  };

  const getCurrTeacher = () => {
    return teachers.teachers.find(
      (teacher) => teacher.account.email === account.email
    );
  };

  useEffect(() => {
    fetchTeacherData();
    fetchDataAccount();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [classPerPage, setClassPerPage] = useState(6);

  const lastIndex = currentPage * classPerPage;
  const firstIndex = lastIndex - classPerPage;
  let currentTeacherList = account.subscribed_lecturer.slice(
    firstIndex,
    lastIndex
  );

  function handlePageChange(value: any) {
    if (value === "&laquo;" || value === "... ") {
      setCurrentPage(1);
    } else if (value === "&lsaquo;") {
      if (currentPage !== 1) {
        setCurrentPage(currentPage - 1);
      }
    } else if (value === "&rsaquo;") {
      if (
        currentPage !==
        Math.ceil(account.subscribed_lecturer.length / classPerPage)
      ) {
        setCurrentPage(currentPage + 1);
      }
    } else if (value === "&raquo;" || value === " ...") {
      setCurrentPage(
        Math.ceil(account.subscribed_lecturer.length / classPerPage)
      );
    } else {
      setCurrentPage(value);
    }
  }

  function handleClickSearch() {
    const findSubsTeacher = tempAccount.subscribed_lecturer.filter(
      (u) =>
        u.user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        u.user.lastName.toLowerCase().includes(searchText.toLowerCase())
    );
    setAccount({ ...account, subscribed_lecturer: findSubsTeacher });
    // console.log(tempAccount.subscribed_lecturer);
    // account.subscribed_lecturer = findSubsTeacher;
    // console.log(account.subscribed_lecturer);
    currentTeacherList = account.subscribed_lecturer.slice(
      firstIndex,
      lastIndex
    );
  }

  // search teacher
  const [currentPageTeacher, setCurrentPageTeacher] = useState(1);
  const [classPerPageTeacher, setClassPerPageTeacher] = useState(6);

  const lastIndexTeacher = currentPageTeacher * classPerPageTeacher;
  const firstIndexTeacher = lastIndexTeacher - classPerPageTeacher;
  let currentListTeacher = teachers.teachers.slice(
    firstIndexTeacher,
    lastIndexTeacher
  );

  function handlePageTeacherChange(value: any) {
    if (value === "&laquo;" || value === "... ") {
      setCurrentPageTeacher(1);
    } else if (value === "&lsaquo;") {
      if (currentPageTeacher !== 1) {
        setCurrentPageTeacher(currentPageTeacher - 1);
      }
    } else if (value === "&rsaquo;") {
      if (
        currentPageTeacher !==
        Math.ceil(teachers.teachers.length / classPerPageTeacher)
      ) {
        setCurrentPageTeacher(currentPageTeacher + 1);
      }
    } else if (value === "&raquo;" || value === " ...") {
      setCurrentPageTeacher(
        Math.ceil(teachers.teachers.length / classPerPageTeacher)
      );
    } else {
      setCurrentPageTeacher(value);
    }
  }

  function handleClickSearchTeacher() {
    const findTeacher = tempTeachers.teachers.filter((u) =>
      u.account.fullName.toLowerCase().includes(searchTeacherText.toLowerCase())
    );
    setTeacher({ teachers: findTeacher });
  }

  let currTeacher = userRole === "Teacher" ? getCurrTeacher() : null;
  const [role, setRole] = useState("Student");
  const [currPrivate, setCurrPrivate] = useState<PrivateDiscOut>({
    id: "",
    title: "",
    education: "",
    subject: "",
    difficulty: "",
    date: "",
    start_time: "",
    end_time: "",
    status: "",
    coin: 0,
    user: {
      fullName: "",
      firstName: "",
      lastName: "",
      email: "",
      age: 0,
      gender: "",
      phoneNumber: "",
      education: "",
      city: "",
      country: "",
      school: "",
      coin: 0,
      urlImage: "",
    },
  });
  console.log(currTeacher, "currTeachera");

  console.log(teacherid, currentTeacherList);

  const handleLoadingTrue = () => setIsLoadingChangeAccount(true);
  const handleLoadingFalse = () => setIsLoadingChangeAccount(false);

  return (
    <>
      {!isLoadingChangeAccount ? (
        <div className="all-page">
          <ReqPrivate
            isOpen={isOpen}
            toggle={toggle}
            account={account.id}
            teacher={teacherid}
            currPrivate={currPrivate}
            role={role}
          />
          <div className="sidebar-content">
            {userRole === "Teacher" ? (
              <Sidebar
                teacheracc={currTeacher}
                account={account}
                onLoadingTrue={handleLoadingTrue}
                onLoadingFalse={handleLoadingFalse}
              ></Sidebar>
            ) : (
              <Sidebar
                account={account}
                onLoadingTrue={handleLoadingTrue}
                onLoadingFalse={handleLoadingFalse}
              ></Sidebar>
            )}
          </div>

          <div className="d-block w-100 lecturer-page">
            {isLogged ? (
              userRole === "Teacher" ? (
                <div className="lecturer-private-discussion">
                  <h3
                    className="private-discussion-text fw-bold"
                    style={{ fontSize: "48px" }}
                  >
                    Private Discussion Request
                  </h3>
                  <div className="table-container p-3">
                    <TableContainer>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell
                              className="text-white fw-bold"
                              width={"2%"}
                              style={{
                                fontSize: "14px",
                                fontFamily: "Montserrat",
                                opacity: "0.6",
                              }}
                            >
                              #
                            </TableCell>
                            <TableCell
                              className="text-white fw-bold"
                              width={"30%"}
                              style={{
                                fontSize: "14px",
                                fontFamily: "Montserrat",
                                opacity: "0.6",
                              }}
                            >
                              Title
                            </TableCell>
                            <TableCell
                              className="text-white fw-bold"
                              width={"15%"}
                              style={{
                                fontSize: "14px",
                                fontFamily: "Montserrat",
                                opacity: "0.6",
                              }}
                            >
                              Date
                            </TableCell>
                            <TableCell
                              className="text-white fw-bold"
                              width={"12.5%"}
                              style={{
                                fontSize: "14px",
                                fontFamily: "Montserrat",
                                opacity: "0.6",
                              }}
                            >
                              Category
                            </TableCell>
                            <TableCell
                              className="text-white fw-bold"
                              width={"12.5%"}
                              style={{
                                fontSize: "14px",
                                fontFamily: "Montserrat",
                                opacity: "0.6",
                              }}
                            >
                              Level
                            </TableCell>
                            <TableCell
                              className="text-white fw-bold"
                              width={"10%"}
                              style={{
                                fontSize: "14px",
                                fontFamily: "Montserrat",
                                opacity: "0.6",
                              }}
                            >
                              Coin
                            </TableCell>
                            <TableCell
                              className="text-white fw-bold"
                              style={{
                                fontSize: "14px",
                                fontFamily: "Montserrat",
                                opacity: "0.6",
                              }}
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {currTeacher?.private_disc?.map((data, idx) => (
                            <TableRow
                              key={idx}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                              onClick={() => {
                                toggle();
                                setCurrPrivate(data);
                                setRole("Teacher");
                              }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                className="text-white fw-bold"
                              >
                                {idx + 1}
                              </TableCell>
                              <TableCell className="text-white">
                                <div className="d-flex align-items-center">
                                  <img
                                    className="img-fluid"
                                    src={"/assets/" + data.user.profile_pic}
                                    alt=""
                                    style={{
                                      height: "5vh",
                                      width: "5vh",
                                      borderRadius: "0.25rem",
                                    }}
                                  />
                                  <span className="d-flex row m-0">
                                    <p
                                      className="m-0"
                                      style={{ opacity: "0.75" }}
                                    >
                                      {data.user.firstName} {data.user.lastName}
                                    </p>
                                    <p
                                      className="m-0 fw-bold"
                                      style={{ fontSize: "18px" }}
                                    >
                                      {data.title}
                                    </p>
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-white">
                                {/* <p>
                                  {dayjs(data.date).format("ddd, MMM D, YYYY")}
                                </p>
                                {data.start_time} - {data.end_time} */}
                                <span className="d-flex row m-0">
                                  <p
                                    className="m-0 p-0"
                                    style={{ opacity: "0.75" }}
                                  >
                                    {dayjs(data.date).format(
                                      "ddd, MMM D, YYYY"
                                    )}
                                  </p>
                                  <p
                                    className="m-0 p-0"
                                    style={{ opacity: "0.75" }}
                                  >
                                    {data.start_time.slice(0, 5)} -{" "}
                                    {data.end_time.slice(0, 5)}
                                  </p>
                                </span>
                              </TableCell>
                              <TableCell className="text-white">
                                <div className="chip fw-bold">
                                  {data.subject}
                                </div>
                              </TableCell>
                              <TableCell className="text-white">
                                <div className="chip fw-bold">
                                  {data.education}
                                </div>
                              </TableCell>
                              <TableCell className="text-white">
                                <div className="d-flex col align-items-center align-content-center text-center private-coin">
                                  <img
                                    src={`assets/coin.png`}
                                    alt="abc"
                                    style={{
                                      height: "3vh",
                                      width: "3vh",
                                      marginRight: "0.25rem",
                                    }}
                                  />
                                  <p className="m-0 fw-bold ">{data.coin}</p>
                                </div>
                              </TableCell>
                              <TableCell className="text-white lecturer-request-private-button">
                                <div className="d-flex row gap-2">
                                  <button className="request-private-btn m-0">
                                    Accept
                                  </button>
                                  <button className="unsubscribe-btn m-0">
                                    Decline
                                  </button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              ) : (
                <>
                  <div className="lecturer-subscribed">
                    <h3
                      className="fw-bold"
                      style={{ fontSize: "48px", marginBottom: "2rem" }}
                    >
                      My Lecturer
                    </h3>
                    <div className="" style={{ marginBottom: "6rem" }}>
                      <div className="search-container">
                        <div className="search-left">
                          <input
                            type="search"
                            name=""
                            id="search-input"
                            style={{ width: "99%" }}
                            placeholder="Search"
                            onChange={(e) => {
                              setSearchText(e.target.value);
                              setAccount(tempAccount);
                            }}
                          />
                        </div>
                        <div className="search-right">
                          <button className="search-button" id="search">
                            <IoSearch
                              color="#6E6E6E"
                              fontSize={"24"}
                              onClick={handleClickSearch}
                            />
                          </button>
                        </div>
                      </div>

                      {!isLoadingMyLecturer ? (
                        <div
                          // List Lecturer yang di Subscribe
                          className="lecturer-subscribed-content mt-4"
                          style={{
                            maxHeight: "25rem",
                            padding: "0rem 0rem",
                            marginBottom: "2rem",
                          }}
                        >
                          {currentTeacherList.length > 0 ? (
                            <div className="d-flex row">
                              {currentTeacherList.map((data) => (
                                <div className="w-50 p-2">
                                  <div
                                    className="d-flex"
                                    style={{
                                      height: "10vh",
                                      background:
                                        "radial-gradient(#90928f, #bab8cc)",
                                      padding: "0rem 1rem",
                                      borderRadius: "0.25rem",
                                    }}
                                  >
                                    <div
                                      className="d-flex align-items-center"
                                      style={{
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                      }}
                                    >
                                      <img
                                        className="img-fluid bg-light"
                                        src={
                                          "/assets/" +
                                          (data.user.profile_pic !== null
                                            ? data.user.profile_pic
                                            : "default_picture.png")
                                        }
                                        alt=""
                                        style={{
                                          width: "8vh",
                                          height: "8vh",
                                          borderRadius: "0.25rem",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </div>
                                    <div className="w-100">
                                      <div className="card-text text-white fw-bold d-flex justify-content-between align-items-center h-100 p-3">
                                        <div>
                                          <h5 className="fw-bold">
                                            {data.user.firstName}{" "}
                                            {data.user.lastName}
                                          </h5>
                                        </div>

                                        <div className="d-flex flex-column lecturer-subscribed-button h-100">
                                          <button
                                            className="request-private-btn"
                                            onClick={() => {
                                              toggle();
                                              setTeacherId(data.id);
                                              setRole("Student");
                                            }}
                                          >
                                            Request Private
                                          </button>
                                          <button
                                            className="unsubscribe-btn"
                                            onClick={() =>
                                              handleUnsubscribe(data)
                                            }
                                          >
                                            Unsubscribe
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div
                              className="no-subscribe-lecturer"
                              style={{ height: "25rem" }}
                            >
                              No Subscribed Lecturer Found
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ height: "45vh" }}
                        >
                          <svg
                            width="80"
                            height="80"
                            stroke="#fff"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g>
                              <circle
                                cx="12"
                                cy="12"
                                r="9.5"
                                fill="none"
                                stroke-width="3"
                                stroke-linecap="round"
                              >
                                <animate
                                  attributeName="stroke-dasharray"
                                  dur="1.5s"
                                  calcMode="spline"
                                  values="0 150;42 150;42 150;42 150"
                                  keyTimes="0;0.475;0.95;1"
                                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                                  repeatCount="indefinite"
                                />
                                <animate
                                  attributeName="stroke-dashoffset"
                                  dur="1.5s"
                                  calcMode="spline"
                                  values="0;-16;-59;-59"
                                  keyTimes="0;0.475;0.95;1"
                                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                                  repeatCount="indefinite"
                                />
                              </circle>
                              <animateTransform
                                attributeName="transform"
                                type="rotate"
                                dur="2s"
                                values="0 12 12;360 12 12"
                                repeatCount="indefinite"
                              />
                            </g>
                          </svg>
                          <Pagination
                            totalClass={account.subscribed_lecturer.length}
                            classPerPage={classPerPage}
                            onPageChange={handlePageChange}
                            currentPage={currentPage}
                          />
                        </div>
                      )}
                      <Pagination
                        totalClass={account.subscribed_lecturer.length}
                        classPerPage={classPerPage}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                      />
                    </div>
                  </div>
                </>
              )
            ) : (
              ""
            )}

            <div className="lecturer-content">
              <div className="greetings">
                <h3 className="fw-bold" style={{ fontSize: "48px" }}>
                  Lecturer Leaderboard
                </h3>
                <h4>
                  <span>
                    There are{" "}
                    <span style={{ color: "#F6ECA9", fontWeight: "bold" }}>
                      10 Best Lecturer
                    </span>{" "}
                    of this Month ! Congratulations !
                  </span>
                </h4>
              </div>
              <div className="table-container p-3">
                {!isLoading ? (
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow style={{ cursor: "default" }}>
                          <TableCell
                            className="text-white fw-bold top-row-table"
                            width={"2%"}
                            style={{
                              fontSize: "14px",
                              fontFamily: "Montserrat",
                              opacity: "0.6",
                            }}
                          >
                            #
                          </TableCell>
                          <TableCell
                            className="text-white fw-bold"
                            width={"30%"}
                            style={{
                              fontSize: "14px",
                              fontFamily: "Montserrat",
                              opacity: "0.6",
                            }}
                          >
                            Name
                          </TableCell>
                          <TableCell
                            className="text-white fw-bold"
                            style={{
                              fontSize: "14px",
                              fontFamily: "Montserrat",
                              opacity: "0.6",
                            }}
                          >
                            Course Sold
                          </TableCell>
                          <TableCell
                            className="text-white fw-bold"
                            style={{
                              fontSize: "14px",
                              fontFamily: "Montserrat",
                              opacity: "0.6",
                            }}
                          >
                            Discussion Participant
                          </TableCell>
                          <TableCell
                            className="text-white fw-bold"
                            style={{
                              fontSize: "14px",
                              fontFamily: "Montserrat",
                              opacity: "0.6",
                            }}
                          >
                            Forum Points
                          </TableCell>
                          <TableCell
                            className="text-white fw-bold"
                            style={{
                              fontSize: "14px",
                              fontFamily: "Montserrat",
                              opacity: "0.6",
                            }}
                          >
                            Rating
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {teachers.teachers.slice(0, 10).map((data, index) => (
                          <TableRow
                            className="lecturer-leaderboard-table"
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                            onClick={() => handleTeacherDetail(data)}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              className="text-white fw-bold"
                              style={{ fontFamily: "Montserrat" }}
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell
                              className="text-white"
                              style={{ fontFamily: "Montserrat" }}
                            >
                              <img
                                className="img-fluid bg-light"
                                src={"/assets/" + data.account.urlImage}
                                alt=""
                                style={{
                                  height: "5vh",
                                  width: "5vh",
                                  borderRadius: "0.25rem",
                                  marginRight: "0.5rem",
                                }}
                              />
                              <span className="top-lecturers">
                                {data.account.fullName}
                              </span>
                            </TableCell>
                            <TableCell
                              className="text-white"
                              style={{ fontFamily: "Montserrat" }}
                            >
                              <div className="chip-leaderboard fw-bold">
                                {data.courseSold} solds
                              </div>
                            </TableCell>
                            <TableCell
                              className="text-white"
                              style={{ fontFamily: "Montserrat" }}
                            >
                              <div className="chip-leaderboard fw-bold">
                                {data.discussionParticipant} Participants
                              </div>
                            </TableCell>
                            <TableCell
                              className="text-white"
                              style={{ fontFamily: "Montserrat" }}
                            >
                              <div className="chip-leaderboard-forum-points fw-bold">
                                {data.forumPoints} Points
                              </div>
                            </TableCell>
                            <TableCell
                              className="text-white"
                              style={{ fontFamily: "Montserrat" }}
                            >
                              <FaStar
                                style={{
                                  color: "green",
                                  fontSize: "25px",
                                  marginRight: "5px",
                                }}
                              />{" "}
                              {data.teacher_rating}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "30vh" }}
                  >
                    <svg
                      width="80"
                      height="80"
                      stroke="#fff"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="9.5"
                          fill="none"
                          stroke-width="3"
                          stroke-linecap="round"
                        >
                          <animate
                            attributeName="stroke-dasharray"
                            dur="1.5s"
                            calcMode="spline"
                            values="0 150;42 150;42 150;42 150"
                            keyTimes="0;0.475;0.95;1"
                            keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="stroke-dashoffset"
                            dur="1.5s"
                            calcMode="spline"
                            values="0;-16;-59;-59"
                            keyTimes="0;0.475;0.95;1"
                            keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          dur="2s"
                          values="0 12 12;360 12 12"
                          repeatCount="indefinite"
                        />
                      </g>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div
              className=""
              style={{ padding: "0rem 2rem", marginTop: "4rem" }}
            >
              <h3
                className="fw-bold"
                style={{ fontSize: "48px", marginBottom: "1rem" }}
              >
                All Lecturer
              </h3>
              <div className="lecturer-page-menu">
                <div className="search-container">
                  <div className="search-left">
                    <input
                      type="search"
                      name=""
                      id="search-input"
                      style={{ width: "99%" }}
                      placeholder="Search"
                      onChange={(e) => {
                        setSearchTeacherText(e.target.value);
                        setTeacher(tempTeachers);
                      }}
                    />
                  </div>
                  <div className="search-right">
                    <button className="search-button" id="search">
                      <IoSearch
                        color="#6E6E6E"
                        fontSize={"24"}
                        onClick={handleClickSearchTeacher}
                      />
                    </button>
                  </div>
                </div>
                {!isLoading ? (
                  <div
                    className="lecturer-subscribed-content row mt-4 w-100"
                    style={{ minHeight: "auto", marginBottom: "2rem" }}
                  >
                    {currentListTeacher.map((data) => (
                      <div
                        className="p-2 w-50"
                        onClick={() => handleTeacherDetail(data)}
                      >
                        <div
                          className="d-flex col all-lecturer-container"
                          style={{
                            height: "10vh",
                            // background: "rgba(255, 255, 255, 0.1)",
                            padding: "0rem 0.75rem",
                            borderRadius: "0.25rem",
                          }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <img
                              className="img-fluid bg-light"
                              src={"/assets/" + data.account.urlImage}
                              alt=""
                              style={{
                                width: "8vh",
                                height: "8vh",
                                borderRadius: "0.25rem",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div className="w-100">
                            <div className="card-text text-white fw-bold d-flex justify-content-between align-items-center h-100 p-3">
                              <h5 className="fw-bold all-lecturer-name">
                                {data.account.fullName}
                              </h5>
                              <div className="d-flex flex-column lecturer-subscribed-button"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "30vh" }}
                  >
                    <svg
                      width="80"
                      height="80"
                      stroke="#fff"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="9.5"
                          fill="none"
                          stroke-width="3"
                          stroke-linecap="round"
                        >
                          <animate
                            attributeName="stroke-dasharray"
                            dur="1.5s"
                            calcMode="spline"
                            values="0 150;42 150;42 150;42 150"
                            keyTimes="0;0.475;0.95;1"
                            keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="stroke-dashoffset"
                            dur="1.5s"
                            calcMode="spline"
                            values="0;-16;-59;-59"
                            keyTimes="0;0.475;0.95;1"
                            keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          dur="2s"
                          values="0 12 12;360 12 12"
                          repeatCount="indefinite"
                        />
                      </g>
                    </svg>
                  </div>
                )}
                <Pagination
                  totalClass={teachers.teachers.length}
                  classPerPage={classPerPageTeacher}
                  onPageChange={handlePageTeacherChange}
                  currentPage={currentPageTeacher}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <svg
            width="80"
            height="80"
            stroke="#fff"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <circle
                cx="12"
                cy="12"
                r="9.5"
                fill="none"
                stroke-width="3"
                stroke-linecap="round"
              >
                <animate
                  attributeName="stroke-dasharray"
                  dur="1.5s"
                  calcMode="spline"
                  values="0 150;42 150;42 150;42 150"
                  keyTimes="0;0.475;0.95;1"
                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-dashoffset"
                  dur="1.5s"
                  calcMode="spline"
                  values="0;-16;-59;-59"
                  keyTimes="0;0.475;0.95;1"
                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                  repeatCount="indefinite"
                />
              </circle>
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="2s"
                values="0 12 12;360 12 12"
                repeatCount="indefinite"
              />
            </g>
          </svg>
        </div>
      )}
    </>
  );
};

export default Lecturer;
