import { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { IoIosArrowForward } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import axios from "../../../api/axios";
import {
  ClassList,
  CourseListOutput,
  CourseListSchema,
  DiscussionListOutput,
  DiscussionListSchema,
  transfromToCourseListOutput,
  transfromToDiscussionListOutput,
} from "../../../model/course/course-list";
import { ApiResponse } from "../../../model/schema/base_schema";
import { ModalCentered, Pagination, Sidebar } from "../../../shared";
import "./home.css";

const CLASS_URL = "/api/discussion";
const COURSE_URL = "/api/course";

function Home() {
  const [classList, setClassList] = useState<DiscussionListOutput>({
    classList: [],
  });

  const [courseList, setCourseList] = useState<CourseListOutput>({
    courseList: [],
  });

  const [classData, setClassData] = useState<ClassList>({
    title: "",
    category: [],
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

  const [currentPageCourse, setCurrentPageCourse] = useState(1);
  const [classPerPageCourse, setClassPerPageCourse] = useState(4);

  const [selected, setSelected] = useState();
  const [showModal, setShowModal] = useState(false);

  const lastClassIndex = currentPage * classPerPage;
  const firstClassIndex = lastClassIndex - classPerPage;
  const currentClass = classList.classList.slice(
    firstClassIndex,
    lastClassIndex
  );

  const lastCourseIndex = currentPageCourse * classPerPageCourse;
  const firstCourseIndex = lastCourseIndex - classPerPageCourse;
  const currentCourse = courseList.courseList.slice(
    firstCourseIndex,
    lastCourseIndex
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

  function handlePageChangeCourse(value: any) {
    if (value === "&laquo;" || value === "... ") {
      setCurrentPageCourse(1);
    } else if (value === "&lsaquo;") {
      if (currentPageCourse !== 1) {
        setCurrentPageCourse(currentPageCourse - 1);
      }
    } else if (value === "&rsaquo;") {
      if (
        currentPageCourse !==
        Math.ceil(courseList.courseList.length / classPerPageCourse)
      ) {
        setCurrentPageCourse(currentPageCourse + 1);
      }
    } else if (value === "&raquo;" || value === " ...") {
      setCurrentPageCourse(
        Math.ceil(courseList.courseList.length / classPerPage)
      );
    } else {
      setCurrentPageCourse(value);
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

  const fetchDataDiscussion = async () => {
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

  const fetchDataCourse = async () => {
    try {
      const response = await axios.get<ApiResponse<CourseListSchema>>(
        COURSE_URL,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response);
      setCourseList(transfromToCourseListOutput(response.data.outputSchema));
    } catch (error) {}
  };

  useEffect(() => {
    fetchDataDiscussion();
    fetchDataCourse();
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
                                className="col-md-3 d-flex align-items-stretch mb-3"
                                key={index}
                                onClick={() => handleShowModal(data)}
                              >
                                <div
                                  className="card"
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                  }}
                                >
                                  <div className="container-class-header">
                                    <img
                                      className="disc-image img-fluid"
                                      src={`assets/${data.image}`}
                                      alt=""
                                      style={{ height: "10rem" }}
                                    />
                                    <div className="bottom-left">
                                      {data.date.toString()}
                                    </div>
                                    <div className="top-left p-1">
                                      <img
                                        className="img-fluid"
                                        src={`assets/coin.png`}
                                        alt=""
                                        style={{ height: "24px" }}
                                      />
                                      <span style={{ marginLeft: "5px" }}>
                                        {data.price}
                                      </span>
                                    </div>
                                    <div className="top-right">Top Right</div>
                                    <div className="bottom-right">
                                      {data.starttime.toString()} -{" "}
                                      {data.endtime.toString()}
                                    </div>
                                  </div>
                                  <div className="card-body p-2">
                                    <div className="card-text">
                                      <div className="class-content">
                                        <div className="class">
                                          <div className="d-flex">
                                            <div className="me-2">
                                              <img
                                                src={`assets/coin.png`}
                                                alt="abc"
                                              />
                                            </div>
                                            <div className="d-block">
                                              <div className="title-class mb-2">
                                                <h3>{data.title}</h3>
                                                <span>Pengajar</span>
                                              </div>
                                              {data.category.map(
                                                (category, index) => (
                                                  <span
                                                    className="badge badge-outlined text-white me-2"
                                                    key={index}
                                                  >
                                                    {category}
                                                  </span>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
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
                    <div className="class-wrapper">
                      <div
                        className="card"
                        style={{ backgroundColor: "#11235a" }}
                      >
                        <div className="card-body">
                          <div className="row">
                            {currentCourse.map((data, index) => (
                              <div
                                className="col-md-3 d-flex align-items-stretch mb-3"
                                key={index}
                              >
                                <div
                                  className="card"
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                  }}
                                >
                                  <div className="container-class-header">
                                    <img
                                      className="disc-image img-fluid"
                                      src={`assets/${data.image}`}
                                      alt=""
                                      style={{ height: "10rem" }}
                                    />

                                    <div className="top-left p-1">
                                      <img
                                        className="img-fluid"
                                        src={`assets/coin.png`}
                                        alt=""
                                        style={{ height: "24px" }}
                                      />
                                      <span style={{ marginLeft: "5px" }}>
                                        {data.price}
                                      </span>
                                    </div>
                                    <div className="top-right">Top Right</div>
                                  </div>
                                  <div className="card-body p-2">
                                    <div className="card-text">
                                      <div className="class-content">
                                        <div className="class">
                                          <div className="d-flex">
                                            <div className="me-2">
                                              <img
                                                src={`assets/coin.png`}
                                                alt="abc"
                                              />
                                            </div>
                                            <div className="d-block">
                                              <div className="title-class mb-2">
                                                <h3>{data.title}</h3>
                                                <span>Pengajar</span>
                                              </div>
                                              {data.category.map(
                                                (category, index) => (
                                                  <span
                                                    className="badge badge-outlined text-white me-2"
                                                    key={index}
                                                  >
                                                    {category}
                                                  </span>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Pagination
                          totalClass={courseList.courseList.length}
                          classPerPage={classPerPageCourse}
                          onPageChange={handlePageChangeCourse}
                          currentPage={currentPageCourse}
                        />
                      </div>
                    </div>
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

      <ModalCentered
        show={showModal}
        onHide={handleCloseModal}
        data={classData}
      />
    </div>
  );
}

export default Home;
