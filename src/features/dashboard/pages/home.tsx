import { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { IoIosArrowForward } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "../../../api/axios";
import {
  AccountOutput,
  AccountSchema,
  StudentDiscOutput,
  transformToAccountDiscOutput,
  transfromToAccountOutput,
} from "../../../model/Account";
import { ApiResponse } from "../../../model/schema/base_schema";
import { Sidebar } from "../../../shared";
import HomeClass from "../components/home-class";
import HomeDiscussion from "../components/home-discussion";
import "./home.css";

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
    coin: 0 
  });

  const [accountDisc, setAccountDisc] = useState<StudentDiscOutput>({
    studentdisc_list: [],
  })
  const [key, setKey] = useState("discussion");
  const HOME_URL = "/api/account?email=" + email;

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
      console.log(response.data.outputSchema);
      setAccount(transfromToAccountOutput(response.data.outputSchema));
      setAccountDisc(transformToAccountDiscOutput(response.data.outputSchema));
      console.log(accountDisc,"ini disc");
    } catch (error) {}
  };

  useEffect(() => {
    if (isLogged) {
      fetchDataAccount();
    }
  }, []);

  console.log(account);

  return (
    <body className="">
      <div className="all-page">
        <div className="sidebar-content">
          <Sidebar account={account} accountDisc={accountDisc}></Sidebar>
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
                COIN <IoIosArrowForward />
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
                <HomeClass />
              </Tab>
            </Tabs>
            
          </div>
        </div>

        <div className="right-home">
          <div className="upcoming-discussion">
            <p>Upcoming Discussion</p>
            <Link
              style={{
                textDecoration: "none",
              }}
              to={"/discussion"}
            >
              <div className="view-all">View All</div>
            </Link>
          </div>

          <div className="statistic">
            <div className="card-title fw-bold">
              <h2>Statistics</h2>
              <p>You have finished xxx courses in this Month! Keep it up!</p>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}

export default Home;
