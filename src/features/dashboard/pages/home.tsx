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
import { Sidebar } from "../../../shared";
import HomeClass from "../components/home-class";
import HomeDiscussion from "../components/home-discussion";
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
  });
  const [showModalAddDiscussion, setShowModalAddDiscussion] = useState(false);

  let search = false;
  const [searchText, setSearchText] = useState("");
  const [key, setKey] = useState("discussion");
  const HOME_URL = "/api/account?email=" + email;
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
      console.log(response.data.outputSchema, "ABCCCCC");
      setAccount(transfromToAccountOutput(response.data.outputSchema));
      // setAccountDisc(transformToAccountDiscOutput(response.data.outputSchema));
    } catch (error) {}
  };

  const handleCloseModalAddDiscussion = () => setShowModalAddDiscussion(false);

  const handleShowModalAddDiscussion = () => {
    setShowModalAddDiscussion(true);
  };

  useEffect(() => {
    if (isLogged) {
      fetchDataAccount();
    }
  }, []);

  console.log(account);

  const goToDisc = (discDate: any) => {
    navigate("/calendar", {
      state: {
        account: account,
        discDate: discDate,
      },
    });
  };

  return (
    // <body className="">
    <div className="all-page">
      <div className="sidebar-content">
        <Sidebar account={account}></Sidebar>
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
              <div className="col-6 mt-3">
                <button
                  className="private-discussion-button"
                  style={{ width: "100%" }}
                >
                  Private Discussion Request
                </button>
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

              <Tab className="" eventKey="class" title="Class">
                <HomeClass account={account} />
              </Tab>
            </Tabs>
          </div>
        </div>
      )}

      <div className="right-home">
        <div className="upcoming-discussion">
          <p className="mt-3" style={{ marginLeft: "15px" }}>
            Upcoming Discussion
          </p>
          <Link
            style={{
              textDecoration: "none",
              marginLeft: "15px",
            }}
            to={"/calendar"}
            state={account}
          >
            <div className="view-all mb-3">View All</div>
          </Link>
          {account.studentdisc_list.slice(0, 3).map((disc, idx) => (
            <div
              className={
                "card-body disc-body rounded right-disc" +
                (idx === 0 ? " right-disc-active" : "")
              }
              style={{
                backgroundColor: idx === 0 ? "rgba(97, 134, 246, 0.3)" : "none",
              }}
              key={idx}
              onClick={() => goToDisc(disc.disc.disc_date)}
            >
              <h5 className="card-text d-flex h-100">
                <div className="disc-date col-2 pe-3 ps-2 text-center my-auto border-end border-white">
                  <h4 style={{ margin: 0, fontSize: "18px" }}>
                    {dayjs(disc.disc.disc_date).format("DD")}
                  </h4>
                  <h5 style={{ fontSize: "12px" }}>
                    {dayjs(disc.disc.disc_date).format("MMM")}
                  </h5>
                </div>
                <div className="disc-title my-auto col-6 d-flex justify-content-center">
                  <h6
                    className=""
                    style={{ margin: 0, fontSize: "12px", width: "80%" }}
                  >
                    {disc.disc.disc_title}
                    <br />
                    by Godwin
                  </h6>
                </div>
                <div
                  className="disc-time col-3 text-center my-auto border-start border-white text-center"
                  style={{ height: "45px" }}
                >
                  <h6
                    className="d-flex align-items-center justify-content-center ms-2"
                    style={{ height: "100%", fontSize: "9px" }}
                  >
                    {disc.disc.disc_starttime.toString()}-
                    {disc.disc.disc_endtime.toString()}
                  </h6>
                </div>
              </h5>
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
      ></TeacherModalAddDiscussion>
    </div>
    // </body>
  );
}

export default Home;
