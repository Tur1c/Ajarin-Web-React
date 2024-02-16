import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { IoIosArrowForward } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { Sidebar } from "../../../shared";
import HomeClass from "../components/home-class";
import HomeDiscussion from "../components/home-discussion";
import "./home.css";

function Home() {
  const [key, setKey] = useState("discussion");

  return (
    <div>
      <Sidebar>
        <div className="container-fluid p-3">
          <div className="row">
            <div className="col-9">
              <div className="search-wrapper mb-3">
                <div className="search-container">
                  <IoSearch />
                  <input
                    type="search"
                    name=""
                    id="search-input"
                    placeholder="Search"
                  />
                  <button id="search">Search</button>
                </div>
              </div>
              <div className="home-wrapper">
                <div className="greetings">
                  <h1>Hello,</h1>
                  <h4>
                    <i>Ready to Learn Something New ?</i>
                  </h4>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    className="img-fluid"
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                    }}
                    src={`assets/coin.png`}
                    alt=""
                  />
                  <div style={{ textAlign: "center", marginLeft: "1rem" }}>
                    Coin <IoIosArrowForward />
                  </div>
                </div>
              </div>
              <div className="content-home">
                <Tabs
                  id="home-tab"
                  activeKey={key}
                  onSelect={(k) => setKey(k || "discussion")}
                  className="mb-3"
                  fill
                >
                  <Tab eventKey="discussion" title="Discussion">
                    <HomeDiscussion />
                  </Tab>
                  <Tab eventKey="class" title="Class">
                    <HomeClass />
                  </Tab>
                </Tabs>
              </div>
            </div>

            <div className="col-3">
              <div className="right-menu d-block">
                <div
                  className="card mb-3 text-center"
                  style={{ height: "20rem" }}
                >
                  <h3 className="card-title p-3">Upcoming Discussion</h3>
                  <div
                    className="card-body"
                    style={{ backgroundColor: "#11235A" }}
                  >
                    <div className="card-text"></div>
                  </div>
                </div>
                <div className="card p-3" style={{ height: "44rem" }}>
                  <div className="card-title fw-bold">
                    <h2 className="mb-0">Statistics</h2>
                    <small>
                      You have finished xxx courses in this Month! Keep it up!
                    </small>
                  </div>
                  <div className="card-body">
                    <div className="card-text"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}

export default Home;
