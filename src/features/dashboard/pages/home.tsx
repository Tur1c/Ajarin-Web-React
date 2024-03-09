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
  StudentDiscOutput,
  // transformToAccountDiscOutput,
  transfromToAccountOutput,
} from "../../../model/Account";
import { ApiResponse } from "../../../model/schema/base_schema";
import { Sidebar } from "../../../shared";
import HomeClass from "../components/home-class";
import HomeDiscussion from "../components/home-discussion";
import "./home.css";
import dayjs from "dayjs";

function Home() {
  const isLogged = sessionStorage.getItem("jwt");
  const email = sessionStorage.getItem("user");
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
    urlImage: "",
  });

  // const [accountDisc, setAccountDisc] = useState<StudentDiscOutput>({
  //   studentdisc_list: [],
  // })
  const [key, setKey] = useState("discussion");
  const HOME_URL = "/api/account?email=" + email;
  const navigate = useNavigate();

  const fetchDataAccount = async () => {
    try {
      const response = await axios.get<ApiResponse<AccountSchema>>(
        HOME_URL,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + isLogged,
          },
          withCredentials: true,
        }
      );
      console.log(response.data.outputSchema, "ABCCCCC");
      setAccount(transfromToAccountOutput(response.data.outputSchema));
      // setAccountDisc(transformToAccountDiscOutput(response.data.outputSchema));
    } catch (error) {}
  };

  useEffect(() => {
    if (isLogged) {
      fetchDataAccount();
    }
  }, []);

  console.log(account);

  const goToDisc = (discDate:any) => {
    navigate("/calendar", 
      {
        state: {
          account:account,
          discDate:discDate
        }
      }
    )
  }

  return (
    // <body className="">
      <div className="all-page">
        <div className="sidebar-content">
          <Sidebar account={account}></Sidebar>
        </div>

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
                />
              </div>
              <div className="search-right">
                <button className="search-button" id="search">
                  <IoSearch color="#6E6E6E" font-size={"24"} />
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
              <Tab
                className=""
                eventKey="discussion"
                title="Discussion"
              >
                <HomeDiscussion />
              </Tab>

              <Tab className="" eventKey="class" title="Class">
                <HomeClass account={account} />
              </Tab>
            </Tabs>
            
          </div>
        </div>

        <div className="right-home">
          <div className="upcoming-discussion">
            <p style={{ marginLeft:"15px" }}>Upcoming Discussion</p>
            <Link
              style={{
                textDecoration: "none",
                marginLeft:"15px"
              }}
              to={"/calendar"}
              state={account}
            >
              <div className="view-all">View All</div>
            </Link>
            {
              account.studentdisc_list.slice(0,3).map( (disc,idx) => (
                  <div className="card-body disc-body rounded" key={idx} onClick={() => goToDisc(disc.disc.disc_date)}>
                      <h5 className="card-text d-flex h-100">
                          <div className="disc-date col-2 pe-3 ps-2 text-center my-auto border-end border-white" >
                              <h4 style={{ margin:0, fontSize:"18px" }}>{dayjs(disc.disc.disc_date).format("DD")}</h4>
                              <h5 style={{ fontSize:"12px" }}>{dayjs(disc.disc.disc_date).format("MMM")}</h5>
                          </div>
                          <div className="disc-title my-auto col-6 d-flex justify-content-center">
                              <h6 className=""style={{ margin:0, fontSize:"12px",width:"80%" }}>{disc.disc.disc_title}<br />by Godwin</h6>
                          </div>
                          <div className="disc-time col-3 text-center my-auto border-start border-white text-center" style={{ height:"45px" }}>
                              <h6 className="d-flex align-items-center justify-content-center ms-2" style=  {{ height:"100%",fontSize:"9px" }}>
                                  {disc.disc.disc_starttime.toString()}-{disc.disc.disc_endtime.toString()}
                                  </h6>
                          </div>
                      </h5>
                  </div>
              ))
            }
          </div>

          <div className="statistic">
            <div className="card-title fw-bold">
              <h2>Statistics</h2>
              <p>You have finished xxx courses in this Month! Keep it up!</p>
            </div>
          </div>
        </div>
      </div>
    // </body>
  );
}

export default Home;
