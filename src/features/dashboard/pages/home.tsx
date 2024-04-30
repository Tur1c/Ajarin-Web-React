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
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHome, setIsLoadingHome] = useState(false);

  let accountId = "";
  const [searchData, setSearchData] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchTextTemp, setSearchTextTemp] = useState("");
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
    courseSold: 0,
    discussionParticipant: 0,
    forumPoints: 0,
    user: {
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

  console.log("ini data courses", teacher);

  const fetchDataAccount = async () => {
    setIsLoadingHome(true);
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
    setIsLoadingHome(false);
  };

  const fetchTeacherData = async () => {
    setIsLoadingHome(true);
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
    setIsLoadingHome(false);
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
    if (isLogged && userRole === "Student") {
      fetchDataAccount();
    } else {
      fetchTeacherData();
      fetchDataAccount();
    }
    // if (userRole === "Teacher") {
    //   setTimeout(() => {
    //     console.log("MASOKKK");

    //     fetchTeacherData();
    //     // fetchDataAccount();
    //   }, 500);
    // }
  }, [userRole]);

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

  const handlePageChangePrivateDiscussion = () => {
    navigate("/lecturer", {
      state: {
        teacher,
      },
    });
  };

  const handleLoadingTrue = () => setIsLoading(true);
  const handleLoadingFalse = () => setIsLoading(false);

  console.log(teacher);
  return (
    // <body className="">
    <>
      {!isLoading ? (
        <div className="all-page">
          <div className="sidebar-content">
            {userRole === "Teacher" ? (
              <Sidebar
                teacheracc={teacher}
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

          {userRole === "Teacher" ? (
            <div className="home-content">
              <div className="greetings">
                <h1>Hello, {account.fullName}</h1>
                <h4>
                  <i className="no-italic">
                    Ready to Expressing Your Knowledge ?
                  </i>
                </h4>
              </div>
              {!isLoadingHome ? (
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
                        onClick={() => handlePageChangePrivateDiscussion()}
                      >
                        Private Discussion Request{" "}
                        {teacher.private_disc?.length === 0 ? (
                          ""
                        ) : (
                          <div className="private-discussion-reminder rounded-circle">
                            {teacher.private_disc?.length}
                          </div>
                        )}
                      </button>
                    </div>
                    {/* <div className="col-6">
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
              </div> */}
                    <div className="col-6">
                      <button
                        className="coin-withdraw-button"
                        style={{ width: "100%", marginTop: "2rem" }}
                        onClick={() => handlePageChangeToCoin()}
                      >
                        Coin{" "}
                        <img
                          className="img-fluid"
                          style={{
                            width: "2vw",
                            height: "2vw",
                          }}
                          src={`assets/coin.png`}
                          alt=""
                        />
                        {teacher.user.coin}
                      </button>
                    </div>
                  </div>
                  <div className="top-courses">
                    <h1 className="fw-bold">Your Top Courses</h1>
                    <div className="row d-flex m-0 justify-content-around">
                      {teacher.courses
                        ? teacher.courses
                            .sort((a, b) => (a.sold > b.sold ? -1 : 1))
                            .slice(0, 5)
                            .map((data, index) => (
                              <div className="course-item w-auto d-flex  p-0">
                                <div
                                  style={{
                                    width: "12vw",
                                    height: "18vw",
                                    background: "rgba(255, 255, 255, 0.1)",
                                    borderRadius: "0.5rem",
                                  }}
                                >
                                  <div className="thumbnail container-class-header">
                                    <img
                                      className="img-flui"
                                      // src={data.image}
                                      src={"/assets/" + data.image}
                                      alt=""
                                      style={{
                                        width: "12vw",
                                        height: "12vw",
                                        objectFit: "fill",
                                        padding: "0.5rem",
                                        borderRadius: "0.5rem",
                                      }}
                                    />
                                    <div
                                      className="bottom-left-courses"
                                      style={{
                                        backgroundColor: "rgba(0, 0, 0, 0.0)",
                                      }}
                                    >
                                      <h5
                                        style={{
                                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                                          padding: "0.25rem",
                                          fontWeight: "600",
                                          letterSpacing: "2px",
                                          borderRadius: "0.25rem",
                                        }}
                                      >
                                        #{index + 1}
                                      </h5>
                                    </div>
                                  </div>
                                  <div
                                    className="d-flex row m-0 text-white align-content-between"
                                    style={{ minHeight: "6vw" }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: "600",
                                        fontSize: "18px",
                                      }}
                                    >
                                      {data.title}
                                    </div>
                                    <div className="purchased-course">
                                      <p>{data.sold} Purchased</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                        : null}
                    </div>
                    <div className="w-100 d-flex justify-content-center mt-3">
                      <button className="see-all-btn">See All</button>
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
                        setSearchTextTemp(e.target.value);
                      }}
                      className="search-left-bar"
                    />
                  </div>
                  <div className="search-right">
                    <button className="search-button" id="search">
                      <IoSearch
                        color="#6E6E6E"
                        fontSize={"24"}
                        onClick={() => {
                          setSearchData(true);
                          setSearchText(searchTextTemp);
                        }}
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
                      width: "32px",
                      height: "32px",
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
                  <Tab
                    className=""
                    eventKey="discussion"
                    title="Discussion"
                    onClick={() => setSearchData(false)}
                  >
                    <HomeDiscussion
                      searchData={searchText ? searchText : "default"}
                    />
                  </Tab>

                  <Tab
                    className=""
                    eventKey="class"
                    title="Course"
                    onClick={() => setSearchData(false)}
                  >
                    <HomeClass
                      account={account}
                      searchData={searchText ? searchText : "default"}
                    />
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
              {!isLoadingHome ? (
                <>
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
                                <h5
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                  }}
                                >
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
                                  {dayjs(disc.discussion.disc_date).format(
                                    "DD"
                                  )}
                                </h4>
                                <h5
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {dayjs(disc.discussion.disc_date).format(
                                    "MMM"
                                  )}
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
                                  {disc.discussion.disc_endtime
                                    .toString()
                                    .slice(0, 5)}
                                </h6>
                              </div>
                            </h5>
                          </div>
                        </div>
                      ))}
                </>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center card-body  right-disc"
                  style={{ height: "100%", width: "100%" }}
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
    // </body>
  );
}

export default Home;
