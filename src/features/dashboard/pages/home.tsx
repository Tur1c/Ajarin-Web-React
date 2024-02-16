import { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { IoIosArrowForward } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import axios from "../../../api/axios";
import {
  ClassList,
  DiscussionListOutput,
  DiscussionListSchema,
  transfromToDiscussionListOutput,
} from "../../../model/course/course-list";
import { ApiResponse } from "../../../model/schema/base_schema";
import { ModalCentered, Pagination, Sidebar } from "../../../shared";
import "./home.css";

const CLASS_URL = "/api/discussion";

function Home() {
  const [classList, setClassList] = useState<DiscussionListOutput>({
    classList: [],
  });

  const [classData, setClassData] = useState<ClassList>({
    title: "",
    category: "",
    date: new Date(),
    description: "",
    endtime: new Date(),
    image: "",
    maxPeople: "",
    price: "",
    starttime: new Date(),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [classPerPage, setClassPerPage] = useState(8);

  const [selected, setSelected] = useState();
  const [showModal, setShowModal] = useState(false);

  const lastClassIndex = currentPage * classPerPage;
  const firstClassIndex = lastClassIndex - classPerPage;
  const currentClass = classList.classList.slice(
    firstClassIndex,
    lastClassIndex
  );
  const [key, setKey] = useState("discussion");

  function handleTabClick(selectedTab: any) {
    setSelected(selectedTab);
  }

  function handlePageChange(value: any) {
    if (value === "&laquo;" || value === "... ") {
      setCurrentPage(1);
    } else if (value === "&lsaquo;") {
      if (currentPage !== 1) {
        setCurrentPage(currentPage - 1);
      }
    } else if (value === "&rsaquo;") {
      if (
        currentPage !== Math.ceil(classList.classList.length / classPerPage)
      ) {
        setCurrentPage(currentPage + 1);
      }
    } else if (value === "&raquo;" || value === " ...") {
      setCurrentPage(Math.ceil(classList.classList.length / classPerPage));
    } else {
      setCurrentPage(value);
    }
  }

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (data: ClassList) => {
    setClassData({
      ...classData,
      category: data.category,
      date: data.date,
      description: data.description,
      endtime: data.endtime,
      image: data.image,
      maxPeople: data.maxPeople,
      price: data.price,
      starttime: data.starttime,
      title: data.title,
    });
    setShowModal(true);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get<ApiResponse<DiscussionListSchema>>(
        CLASS_URL,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response);
      setClassList(transfromToDiscussionListOutput(response.data.outputSchema));
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

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
                    <div className="class-wrapper">
                      <div
                        className="card"
                        style={{ backgroundColor: "#11235a" }}
                      >
                        <div className="card-body">
                          <div className="row">
                            {currentClass.map((data, index) => (
                              <div
                                className="col-md-3 d-flex align-items-stretch mb-5"
                                key={index}
                                onClick={() => handleShowModal(data)}
                              >
                                <div className="card">
                                  <img
                                    className="disc-image img-fluid"
                                    src={`assets/${data.image}`}
                                    alt=""
                                  />
                                  <div className="card-body">
                                    <p className="card-text">
                                      Some quick example text to build on the
                                      card title and make up the bulk of the
                                      card's content.
                                    </p>
                                    <p>{data.date.toString()}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Pagination
                          totalClass={classList.classList.length}
                          classPerPage={classPerPage}
                          onPageChange={handlePageChange}
                          currentPage={currentPage}
                        />
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="class" title="Class">
                    Tab content for Profile
                  </Tab>
                </Tabs>
              </div>
            </div>

            <div className="col-3">
              <div className="right-menu d-block">
                <div
                  className="card mb-5 text-center"
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
                <div className="card p-3" style={{ height: "49rem" }}>
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

      <ModalCentered
        show={showModal}
        onHide={handleCloseModal}
        data={classData}
      />
    </div>
  );
}

export default Home;
