import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
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
  TeacherOutput,
  transfromToTeacherListOutput,
} from "../../model/teacher/teacher-model";
import { Pagination, Sidebar } from "../../shared";
import "./lecturer.css";
import ReqPrivate from "./reqPrivate";
import useModal from "../../hooks/useModal";
import dayjs from "dayjs";

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

  // console.log(state, "state lecturer");

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
    notification: []
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
    notification: []
  });

  //modal
  const {isOpen, toggle} = useModal();
  const [teacherid, setTeacherId] = useState(0);


  const fetchTeacherData = async () => {
    try {
      const response = await axios.get<ApiResponse<InquiryTeacherSchema>>(
        INQUIRY_TEACHER,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // console.log(response,"lecturer");
      setTeacher(transfromToTeacherListOutput(response.data.outputSchema));
      setTempTeacher(transfromToTeacherListOutput(response.data.outputSchema));
    } catch (error) {}
  };

  const fetchDataAccount = async () => {
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
  };

  const handleTeacherDetail = (data: any) => {
    navigate("/lecturer/" + data.account.fullName, {
      state: { data },
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
      fetchDataAccount();
      currentTeacherList = account.subscribed_lecturer.slice(
        firstIndex,
        lastIndex
      );
    } catch (error) {}
  };

  const handleUnsubscribe = (data: SubscribedLecturer) => {
    unsubscribeLecturer(data);
  };

  const getCurrTeacher = () => {
   return teachers.teachers.find((teacher) => teacher.account.email === account.email);
  }

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

  const lastIndexTeacher = currentPage * classPerPage;
  const firstIndexTeacher = lastIndex - classPerPage;
  let currentListTeacher = teachers.teachers.slice(firstIndex, lastIndex);

  function handlePageTeacherChange(value: any) {
    if (value === "&laquo;" || value === "... ") {
      setCurrentPage(1);
    } else if (value === "&lsaquo;") {
      if (currentPageTeacher !== 1) {
        setCurrentPageTeacher(currentPageTeacher - 1);
      }
    } else if (value === "&rsaquo;") {
      if (
        currentPageTeacher !==
        Math.ceil(account.subscribed_lecturer.length / classPerPageTeacher)
      ) {
        setCurrentPageTeacher(currentPageTeacher + 1);
      }
    } else if (value === "&raquo;" || value === " ...") {
      setCurrentPageTeacher(
        Math.ceil(account.subscribed_lecturer.length / classPerPageTeacher)
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
  const [currPrivate,setCurrPrivate] = useState<PrivateDiscOut>({
    id:"",
    title:"",
    education:"",
    subject:"",
    difficulty:"",
    date: "",
    start_time: "",
    end_time: "",
    status:"",
    coin:0,
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
    }
  });
  console.log(currTeacher);

  console.log(teacherid,currentTeacherList);
  return (
    <div className="all-page">
                    <ReqPrivate isOpen={isOpen} toggle={toggle} account={account.id} teacher={teacherid} currPrivate={currPrivate} role={role}/>
      <div className="sidebar-content">
        {userRole === "Teacher" ? 
        <Sidebar teacheracc={currTeacher} account={account}></Sidebar>
        :
        <Sidebar account={account}></Sidebar>
      }
      </div>
      <div className="d-block w-100 lecturer-page">
        {isLogged ? (
          userRole === "Teacher" ? (
            <div className="lecturer-private-discussion p-4">
              <h3 className="fw-bold">Private Discussion Request</h3>
              <div className="table-container">
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow >
                        <TableCell className="text-white" width={"2%"}>
                          #
                        </TableCell>
                        <TableCell className="text-white" width={"30%"}>
                          Title
                        </TableCell>
                        <TableCell className="text-white">Date</TableCell>
                        <TableCell className="text-white">Category</TableCell>
                        <TableCell className="text-white">Coin</TableCell>
                        {/* <TableCell className="text-white">Action</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currTeacher?.private_disc.map((data,idx) => (
                        <TableRow
                          key={idx}
                          sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          onClick={() => {toggle(); setCurrPrivate(data);setRole("Teacher")}}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            className="text-white"
                          >
                            {idx + 1}
                          </TableCell>
                          <TableCell className="text-white">
                            <img
                              className="img-fluid"
                              src={
                                data.user.urlImage ||
                                `assets/default_picture.png`
                              }
                              alt=""
                              style={{ height: "10%", width: "10%" }}
                            />
                            <span> {data.user.fullName}</span>
                          </TableCell>
                          <TableCell className="text-white">
                            <p>{dayjs(data.date).format("ddd, MMM D, YYYY")}</p>
                            {data.start_time} - {data.end_time}
                          </TableCell>
                          <TableCell className="text-white">
                            {data.education}
                          </TableCell>
                          <TableCell className="text-white">
                            {data.coin}
                          </TableCell>
                          {/* <TableCell className="text-white lecturer-request-private-button">
                            <button className="request-private-btn me-3">
                              Accept
                            </button>
                            <button className="unsubscribe-btn">Decline</button>
                          </TableCell> */}
                      </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          ) : (
            <div className="lecturer-subscribed p-4 ">
              <h3 className="fw-bold">My Lecturer</h3>
              <div className="search-wrapper m-0">
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
                        fetchDataAccount();
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
                <div
                  className="lecturer-subscribed-content row mt-4"
                  style={{ height: "25rem" }}
                >
                  {currentTeacherList.map((data) => (
                    <div className="col-6">
                      <div
                        className="card"
                        style={{
                          height: "7rem",
                          background: "rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <div className="row" style={{ height: "100vh" }}>
                          <div
                            className="col-2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <img
                              className="img-fluid"
                              src={
                                data.user?.pic_url ||
                                `assets/default_picture.png`
                              }
                              alt=""
                              style={{ width: "70%" }}
                            />
                          </div>
                          <div className="col-10">
                            <div className="card-text text-white fw-bold d-flex justify-content-between p-3">
                              <h5>
                                {data.user.firstName} {data.user.lastName}
                              </h5>
                              <div className="d-flex flex-column lecturer-subscribed-button">
                                <button className="request-private-btn" onClick={() => {
                                  toggle();
                                  setTeacherId(data.id);
                                  setRole("Student");
                                }
                                }>
                                  Request Private
                                </button>
                                <button
                                  className="unsubscribe-btn"
                                  onClick={() => handleUnsubscribe(data)}
                                >
                                  Unsubscribe
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  totalClass={account.subscribed_lecturer.length}
                  classPerPage={classPerPage}
                  onPageChange={handlePageChange}
                  currentPage={currentPage}
                />
              </div>
            </div>
          )
        ) : (
          ""
        )}

        <div className="lecturer-content">
          <div className="greetings">
            <h3 className="fw-bold">Lecturer Leaderboard</h3>
            <h4>
              <span>
                There are{" "}
                <span style={{ color: "#F6ECA9", fontWeight: "bold" }}>
                  10 Best Lecturer
                </span>{" "}
                of this Month! Congratulations!
              </span>
            </h4>
          </div>
          <div className="table-container p-4">
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="text-white" width={"2%"}>
                      #
                    </TableCell>
                    <TableCell className="text-white" width={"55%"}>
                      Name
                    </TableCell>
                    <TableCell className="text-white">Course Sold</TableCell>
                    <TableCell className="text-white">
                      Discussion Participant
                    </TableCell>
                    <TableCell className="text-white">Forum Points</TableCell>
                    <TableCell className="text-white">Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tempTeachers.teachers.slice(0, 10).map((data, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      onClick={() => handleTeacherDetail(data)}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        className="text-white"
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-white">
                        <img
                          className="img-fluid"
                          src={
                            data.account.urlImage ||
                            `assets/default_picture.png`
                          }
                          alt=""
                          style={{ height: "10%", width: "10%" }}
                        />
                        <span> {data.account.fullName}</span>
                      </TableCell>
                      <TableCell className="text-white">{data.courseSold} solds</TableCell>
                      <TableCell className="text-white">
                        200 Participants
                      </TableCell>
                      <TableCell className="text-white">96 Points</TableCell>
                      <TableCell className="text-white">
                        <FaStar
                          style={{
                            color: "green",
                            fontSize: "25px",
                            marginRight: "5px",
                          }}
                        />{" "}
                        {data.rating}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>

        <div className="lecturer-subscribed p-4 ">
          <h3 className="fw-bold">Search Lecturer</h3>
          <div className="search-wrapper m-0">
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
            <div
              className="lecturer-subscribed-content row mt-4"
              style={{ height: "25rem" }}
            >
              {currentListTeacher.map((data) => (
                <div
                  className="col-6"
                  onClick={() => handleTeacherDetail(data)}
                >
                  <div
                    className="card"
                    style={{
                      height: "7rem",
                      background: "rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <div className="row" style={{ height: "100vh" }}>
                      <div
                        className="col-2"
                        style={{
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        <img
                          className="img-fluid"
                          src={
                            data.account?.urlImage ||
                            `assets/default_picture.png`
                          }
                          alt=""
                          style={{ width: "70%" }}
                        />
                      </div>
                      <div className="col-10">
                        <div className="card-text text-white fw-bold d-flex justify-content-between p-3">
                          <h5>{data.account.fullName}</h5>
                          <div className="d-flex flex-column lecturer-subscribed-button"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              totalClass={teachers.teachers.length}
              classPerPage={classPerPage}
              onPageChange={handlePageTeacherChange}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lecturer;
