import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { IoIosArrowForward } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import {
  AccountOutput,
  AccountSchema,
  // transformToAccountDiscOutput,
  transfromToAccountOutput,
} from "../../../model/Account";
import { ApiResponse } from "../../../model/schema/base_schema";
import {
  TeacherOutput,
  transformToTeacherOutput,
} from "../../../model/teacher/teacher-model";
import { Sidebar } from "../../../shared";
import HomeClass from "../components/home-class";
import HomeDiscussion from "../components/home-discussion";
import TeacherModalAddCourse from "../components/teacher-modal-add-course";
import TeacherModalAddDiscussion from "../components/teacher-modal-add-discussion";
import "./home.css";

function Home() {
  const isLogged = sessionStorage.getItem("jwt");
  const email = sessionStorage.getItem("user");
  const userRole = sessionStorage.getItem("role");
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
  const [showModalAddDiscussion, setShowModalAddDiscussion] = useState(false);
  const [showModalAddCourse, setShowModalAddCourse] = useState(false);

  let search = false;
  let accountId = "";
  const [searchText, setSearchText] = useState("");
  const [key, setKey] = useState("discussion");
  const HOME_URL = "/api/account?email=" + email;
  const TEACHER_DATA = "/api/account/inquiry/teacher/";
  const [teacher, setTeacher] = useState<TeacherOutput>({
    achievement: "",
    courses: [],
    cvUrl: "",
    discussion: [],
    education: "",
    experience: "",
    id: 0,
    description: "",
    rating: "",
    private_disc: [],
    account: {
      age: 0,
      city: "",
      coin: 0,
      country: "",
      education: "",
      email: "",
      firstName: "",
      gender: "",
      id: "",
      lastName: "",
      fullName: "",
      phoneNumber: "",
      school: "",
      urlImage: "",
    },
  });
  const navigate = useNavigate();

  const fetchDataAccount = async () => {
    try {
      const response = await axios.get<ApiResponse<AccountSchema>>(HOME_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + isLogged,
        },
        withCredentials: true,
      });
      console.log("ini data account", response.data.outputSchema);
      accountId = response.data.outputSchema.id;
      setAccount(transfromToAccountOutput(response.data.outputSchema));

      // setAccountDisc(transformToAccountDiscOutput(response.data.outputSchema));
    } catch (error) {}
  };

  const fetchTeacherData = async () => {
    try {
      const response = await axios.get(TEACHER_DATA + email, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
        withCredentials: true,
      });
      console.log(response);
      if (response.data.outputSchema != null) {
        setTeacher(transformToTeacherOutput(response.data.outputSchema));
        console.log(teacher, "teacher coin ahah ");
      }
    } catch {}
  };

  const handleCloseModalAddDiscussion = () => setShowModalAddDiscussion(false);

  const handleShowModalAddDiscussion = () => {
    setShowModalAddDiscussion(true);
  };

  const handleCloseModalAddCourse = () => setShowModalAddCourse(false);

  const handleShowModalAddCourse = () => {
    setShowModalAddCourse(true);
  };

  useEffect(() => {
    if (isLogged) {
      fetchDataAccount();
    }
    if (userRole === "Teacher") {
      setTimeout(() => {
        console.log("MASOKKK");

        fetchTeacherData();
        fetchDataAccount();
      }, 500);
    }
  }, []);

  // console.log("dubidubidu", account);

  const goToDisc = (discDate: any) => {
    if (userRole === "Teacher") {
      navigate("/calendar", {
        state: {
          account: account,
          discDate: discDate,
          teacher: teacher,
        },
      });
    } else {
      navigate("/calendar", {
        state: {
          account: account,
          discDate: discDate,
        },
      });
    }
  };

  const handlePageChangeToCoin = () => {
    navigate("/coin", {
      state: {
        teacher,
      },
    });
  };

  console.log(teacher);
  return (
    // <body className="">
    <div className="all-page">
      <div className="sidebar-content">
        {userRole === "Teacher" ? (
          <Sidebar teacheracc={teacher} account={account}></Sidebar>
        ) : (
          <Sidebar account={account}></Sidebar>
        )}
      </div>

      {userRole === "Teacher" ? (
        <div className="home-content">
          <div className="greetings">
            <h1>Hello, {account.fullName}</h1>
            <h4>
              <i className="no-italic">Ready to Expressing Your Knowledge ?</i>
            </h4>
          </div>
          <div className="add-courses">
            <div className="row">
              <div className="col-6">
                <button
                  className="create-course-button"
                  style={{ width: "100%" }}
                  onClick={() => handleShowModalAddCourse()}
                >
                  Create Course
                </button>
              </div>
              <div className="col-6">
                <button
                  className="set-discussion-button"
                  style={{ width: "100%" }}
                  onClick={() => handleShowModalAddDiscussion()}
                >
                  Set Discussion
                </button>
              </div>
              <div className="col-6">
                <button
                  className="private-discussion-button"
                  style={{ width: "100%", marginTop: "2rem" }}
                >
                  Private Discussion Request
                </button>
              </div>
              <div className="col-6 mt-3">
                <button
                  className="coin-button"
                  style={{ width: "100%" }}
                  onClick={() => handlePageChangeToCoin()}
                >
                  Coin{" "}
                  <img
                    className="img-fluid"
                    style={{
                      width: "36px",
                      height: "36px",
                    }}
                    src={`assets/coin.png`}
                    alt=""
                  />{" "}
                  {teacher.account.coin}
                </button>
                {/* <div className="coin-wrapper">
                  <Link
                    style={{
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                    }}
                    to={"/coin"}
                    state={account}
                  >
                    <img
                      className="img-fluid"
                      style={{
                        width: "36px",
                        height: "36px",
                      }}
                      src={`assets/coin.png`}
                      alt=""
                    />
                    <div className="coin-link">
                      {account.coin} COIN <IoIosArrowForward />
                    </div>
                  </Link>
                </div> */}
              </div>
            </div>
            <div className="top-courses mt-5">
              <h1 className="fw-bold">Your Top Courses</h1>
              <div className="row d-flex justify-content-between">
                {teacher.courses
                  ? teacher.courses
                      .sort((a, b) => (a.sold > b.sold ? -1 : 1))
                      .slice(0, 5)
                      .map((data, index) => (
                        <div className="col-2">
                          <div
                            className="card"
                            style={{
                              width: "13rem",
                              height: "18rem",
                              background: "rgba(255, 255, 255, 0.1)",
                              border: "none",
                            }}
                          >
                            <div className="text-center thumbnail container-class-header">
                              <img
                                className="img-fluid"
                                src={data.image}
                                alt=""
                                style={{ width: "100%", height: "100%" }}
                              />
                              <div
                                className="bottom-left p-0"
                                style={{
                                  backgroundColor: "rgba(0, 0, 0, 0.0)",
                                }}
                              >
                                <h5
                                  style={{
                                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                                  }}
                                >
                                  #{index + 1}
                                </h5>
                              </div>
                            </div>
                            <div className="card-body h-50 p-2 text-white">
                              <div className="card-title">{data.title}</div>
                              <div
                                className="card-text"
                                style={{ height: "3rem" }}
                              >
                                {data.sold} Purchased
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  : null}
              </div>
              <div className="w-100 d-flex justify-content-center mt-3">
                <div className="filter-btn" style={{ width: "50%" }}>
                  See All
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="home-content">
          <div className="greetings">
            <h1>Hello, {account.fullName}</h1>
            <h4>
              <i className="no-italic">Ready to Learn Something New ?</i>
            </h4>
          </div>

          <div className="search-wrapper">
            <div className="search-container">
              <div className="search-left">
                <input
                  type="search"
                  name=""
                  id="search-input"
                  placeholder="Search"
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                  className="search-left-bar"
                />
              </div>
              <div className="search-right">
                <button className="search-button" id="search">
                  <IoSearch
                    color="#6E6E6E"
                    fontSize={"24"}
                    onClick={() => (search = true)}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="coin-wrapper">
            <Link
              style={{
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
              to={"/coin"}
              state={account}
            >
              <img
                className="img-fluid"
                style={{
                  width: "36px",
                  height: "36px",
                }}
                src={`assets/coin.png`}
                alt=""
              />
              <div className="coin-link">
                {account.coin} COIN <IoIosArrowForward />
              </div>
            </Link>
          </div>

          <div className="home-list">
            <Tabs
              id="home-tab"
              activeKey={key}
              onSelect={(k) => setKey(k || "discussion")}
              className=""
              fill
            >
              <Tab className="" eventKey="discussion" title="Discussion">
                <HomeDiscussion searchData={search ? searchText : ""} />
              </Tab>

              <Tab className="" eventKey="class" title="Course">
                <HomeClass account={account} />
              </Tab>
            </Tabs>
          </div>
        </div>
      )}

      <div className="right-home">
        <div className="upcoming-discussion">
          <p style={{ marginLeft: "1rem", marginTop: "1rem" }}>
            Upcoming Discussion
          </p>
          <Link
            style={{
              textDecoration: "none",
              marginLeft: "1rem",
              width: "fit-content",
              marginBottom: "1.5rem",
            }}
            to={"/calendar"}
            state={
              userRole === "Teacher"
                ? { account: account, teacher: teacher }
                : { account: account }
            }
          >
            <div className="view-all">View All</div>
          </Link>
          {userRole === "Teacher"
            ? teacher.discussion &&
              teacher.discussion.slice(0, 3).map((disc, idx) => (
                <div
                  className={
                    "card-body  right-disc" +
                    (idx === 0 ? " right-disc-active" : " ")
                  }
                  // style={{
                  //   backgroundColor: idx === 0 ? "rgba(97, 134, 246, 0.3)" : "none",
                  // }}
                  key={idx}
                  onClick={() => goToDisc(disc.date)}
                >
                  <div className="updisc-container w-100 mx-2">
                    <h5 className="card-text d-flex justify-content-between">
                      <div className="disc-date mx-auto text-center border-end border-white justify-content-center align-items-center align-items-center d-flex row">
                        <h4
                          style={{
                            margin: 0,
                            fontSize: "32px",
                            fontWeight: "bold",
                          }}
                        >
                          {dayjs(disc.date).format("DD")}
                        </h4>
                        <h5 style={{ fontSize: "18px", fontWeight: "bold" }}>
                          {dayjs(disc.date).format("MMM")}
                        </h5>
                      </div>
                      <div className="disc-title my-auto d-flex row px-2 ">
                        <h6 style={{ margin: 0, fontSize: "14px" }}>
                          {disc.title}
                          <br />
                        </h6>
                        <h6
                          style={{
                            margin: 0,
                            fontSize: "10px",
                            color: "var(--yelo)",
                          }}
                        >
                          by Godwin
                        </h6>
                      </div>
                      <div className="disc-time d-flex justify-content-center px-2 border-start border-white">
                        <h6
                          className="d-flex align-items-center justify-content-center"
                          style={{ height: "100%", fontSize: "12px" }}
                        >
                          {disc.starttime.toString().slice(0, 5)} -{" "}
                          {disc.endtime.toString().slice(0, 5)}
                        </h6>
                      </div>
                    </h5>
                  </div>
                </div>
              ))
            : account.studentdisc_list.slice(0, 3).map((disc, idx) => (
                <div
                  className={
                    "card-body  right-disc" +
                    (idx === 0 ? " right-disc-active" : " ")
                  }
                  // style={{
                  //   backgroundColor: idx === 0 ? "rgba(97, 134, 246, 0.3)" : "none",
                  // }}
                  key={idx}
                  onClick={() => goToDisc(disc.discussion.disc_date)}
                >
                  <div className="updisc-container w-100 mx-2">
                    <h5 className="card-text d-flex justify-content-between">
                      <div className="disc-date mx-auto text-center border-end border-white justify-content-center align-items-center align-items-center d-flex row">
                        <h4
                          style={{
                            margin: 0,
                            fontSize: "32px",
                            fontWeight: "bold",
                          }}
                        >
                          {dayjs(disc.discussion.disc_date).format("DD")}
                        </h4>
                        <h5 style={{ fontSize: "18px", fontWeight: "bold" }}>
                          {dayjs(disc.discussion.disc_date).format("MMM")}
                        </h5>
                      </div>

                      <div className="disc-title my-auto d-flex row px-2 ">
                        <h6 style={{ margin: 0, fontSize: "14px" }}>
                          {disc.discussion.disc_title}
                          <br />
                        </h6>
                        <h6
                          style={{
                            margin: 0,
                            fontSize: "10px",
                            color: "var(--yelo)",
                          }}
                        >
                          by Godwin
                        </h6>
                      </div>
                      
                      <div className="disc-time d-flex justify-content-center px-2 border-start border-white">
                        <h6
                          className="d-flex align-items-center justify-content-center"
                          style={{ height: "100%", fontSize: "12px" }}
                        >
                          {disc.discussion.disc_starttime
                            .toString()
                            .slice(0, 5)}{" "}
                          -{" "}
                          {disc.discussion.disc_endtime.toString().slice(0, 5)}
                        </h6>
                      </div>
                    </h5>
                  </div>
                </div>
              ))}
        </div>

        <div className="statistic">
          <div className="card-title fw-bold">
            <h2>Statistics</h2>
            <p>You have finished xxx courses in this Month! Keep it up!</p>
          </div>
        </div>
      </div>
      <TeacherModalAddDiscussion
        show={showModalAddDiscussion}
        onHide={handleCloseModalAddDiscussion}
        teacher={teacher.id}
      ></TeacherModalAddDiscussion>
      <TeacherModalAddCourse
        show={showModalAddCourse}
        onHide={handleCloseModalAddCourse}
        teacher={teacher.id}
      ></TeacherModalAddCourse>
    </div>
    // </body>
  );
}

export default Home;
