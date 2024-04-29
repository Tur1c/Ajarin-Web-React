import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axios from "../../../api/axios";
import { AccountOutput } from "../../../model/Account";
import {
  CourseListOutput,
  CourseListSchema,
  transfromToCourseListOutput,
} from "../../../model/course/course-list";
import { ApiResponse } from "../../../model/schema/base_schema";
import { Pagination } from "../../../shared";

const COURSE_URL = "/api/course";

interface Props {
  account: AccountOutput;
  searchData: string;
}

function HomeClass({ account, searchData }: Props) {
  const [courseList, setCourseList] = useState<CourseListOutput>({
    courseList: [],
  });
  const [tempCourseList, setTempCourseList] = useState<CourseListOutput>({
    courseList: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [searchTextFromHome, setSearchTextFromHome] = useState("");
  const [statusSortSubject, setStatusSortSubject] = useState(false);
  const [statusSortEducation, setStatusSortEducation] = useState(false);

  const [currentPageCourse, setCurrentPageCourse] = useState(1);
  const [classPerPageCourse, setClassPerPageCourse] = useState(4);

  const lastCourseIndex = currentPageCourse * classPerPageCourse;
  const firstCourseIndex = lastCourseIndex - classPerPageCourse;
  const currentCourse = courseList.courseList.slice(
    firstCourseIndex,
    lastCourseIndex
  );

  const navigate = useNavigate();
  const acc: AccountOutput | undefined = !account.fullName
    ? undefined
    : account;

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
        Math.ceil(courseList.courseList.length / classPerPageCourse)
      );
    } else {
      setCurrentPageCourse(value);
    }
  }

  const fetchDataCourse = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse<CourseListSchema>>(
        COURSE_URL,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response, "course");
      setCourseList(transfromToCourseListOutput(response.data.outputSchema));
      setTempCourseList(
        transfromToCourseListOutput(response.data.outputSchema)
      );
    } catch (error) {}
    setIsLoading(false);
  };

  function handleSearch() {
    setCurrentPageCourse(1);
    console.log(searchData, "he");

    if (searchData || searchTextFromHome) {
      if (searchData != "default") {
        setSearchTextFromHome(searchData);
      } else {
        setCourseList(tempCourseList);
        return;
      }
      console.log(tempCourseList);
      
      const findCourse = tempCourseList.courseList.filter((u) =>
        u.title.toLowerCase().includes(searchData.toLowerCase()) ||
        u.teacher?.user.fullName.toLocaleLowerCase().includes(searchTextFromHome.toLowerCase())
      );
      setCourseList({ courseList: findCourse });
    } else {
      setCourseList(tempCourseList);
    }
  }

  useEffect(() => {
    handleSearch();
  }, [searchData, searchTextFromHome]);

  useEffect(() => {
    fetchDataCourse();
  }, []);

  const sortBySubject = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse<CourseListSchema>>(
        COURSE_URL,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response, "course");
      setCourseList(transfromToCourseListOutput(response.data.outputSchema));
      setTempCourseList(
        transfromToCourseListOutput(response.data.outputSchema)
      );
      if (!statusSortSubject) {
        tempCourseList.courseList.sort((a, b) =>
          a.category < b.category ? -1 : 1
        );
        setCourseList({ courseList: tempCourseList.courseList });
        setStatusSortSubject(!statusSortSubject);
      } else {
        tempCourseList.courseList.sort((a, b) =>
          a.category > b.category ? -1 : 1
        );
        setCourseList({ courseList: tempCourseList.courseList });
        setStatusSortSubject(!statusSortSubject);
      }
    } catch (error) {}
    setIsLoading(false);
  };

  const sortByEducation = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse<CourseListSchema>>(
        COURSE_URL,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response, "course");
      setCourseList(transfromToCourseListOutput(response.data.outputSchema));
      setTempCourseList(
        transfromToCourseListOutput(response.data.outputSchema)
      );
      if (!statusSortEducation) {
        tempCourseList.courseList.sort((a, b) => (a.level < b.level ? -1 : 1));
        setCourseList({ courseList: tempCourseList.courseList });
        setStatusSortEducation(!statusSortEducation);
      } else {
        tempCourseList.courseList.sort((a, b) => (a.level > b.level ? -1 : 1));
        setCourseList({ courseList: tempCourseList.courseList });
        setStatusSortEducation(!statusSortEducation);
      }
    } catch (error) {}
    setIsLoading(false);
  };

  return (
    <>
      {!isLoading ? (
        <div className="m-1 d-flex row">
          <div className="filter">
            {/* <div className="filter-btn">Subject</div>
          <div className="filter-btn">Education Level</div> */}
            {/* <div className="d-flex col"> */}
            {/* <FilterList></FilterList> */}
            <div className="filter-btn" onClick={() => sortBySubject()}>
              Subject
            </div>
            <div className="filter-btn" onClick={() => sortByEducation()}>
              Education Level
              {/* </div> */}
            </div>
          </div>
          <div
            className="homes card card-container"
            style={{
              backgroundColor: "#11235a",
              border: "none",
              marginTop: "0.25rem",
            }}
          >
            <div className="w-100">
              <div className="row">
                {currentCourse.length > 0 ? (
                  <>
                    {currentCourse.map((data, index) => (
                      <div
                        className="col-md-3 d-flex align-items-stretch mb-2"
                        key={index}
                      >
                        <div
                          className="card"
                          style={{ border: "none", width: "20vw" }}
                        >
                          <Link
                            to={"/course/" + data.title}
                            state={{
                              data: data,
                              acc: account,
                              teacher: data.teacher,
                              link: "/"
                            }}
                            style={{ textDecoration: "none" }}
                          >
                            <div className="container-class-header">
                              <div className="class-thumbnail">
                                <img
                                  className="class-image img-fluid"
                                  src={`assets/${data.image}`}
                                  alt=""
                                  style={{ objectFit: "fill" }}
                                />
                              </div>

                              <div className="top-left">
                                <img
                                  className="img-fluid"
                                  src={`assets/coin.png`}
                                  alt=""
                                  style={{ height: "14px" }}
                                />
                                <span style={{ marginLeft: "5px" }}>
                                  {data.price}
                                </span>
                              </div>
                              <div className="top-right">
                                {data.chapter} Chapter
                              </div>
                            </div>

                            <div className="card-body p-2 text-decoration-none">
                              <div className="class w-100 h-100 align-content-between">
                                <div
                                  className="h-25"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    src={
                                      "/assets/" + data.teacher?.user.urlImage
                                    }
                                    alt="abc"
                                    className="me-2"
                                    style={{
                                      width: "3vh",
                                      height: "3vh",
                                      borderRadius: "0.25rem",
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: "#000",
                                      alignItems: "center",
                                      fontSize: "10px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {data.teacher?.user.fullName}
                                  </span>
                                </div>
                                <div className="d-block h-75 justify-content-between align-content-between d-flex row m-0">
                                  <div className="title-class m-0 p-0">
                                    <h3
                                      style={{
                                        color: "#000",
                                        fontSize: "18px",
                                        marginTop: "0.5rem",
                                      }}
                                    >
                                      {data.title}
                                    </h3>
                                  </div>
                                  <div
                                    className="row"
                                    style={{ gap: "0.5rem" }}
                                  >
                                    <div className="chip">{data.category}</div>
                                    <div className="chip">{data.level}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center text-white"
                    style={{ height: "25rem" }}
                  >
                    No Course Found
                  </div>
                )}
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
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "60vh" }}
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
}

export default HomeClass;
