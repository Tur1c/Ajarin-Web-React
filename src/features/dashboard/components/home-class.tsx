import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  CourseListOutput,
  CourseListSchema,
  transfromToCourseListOutput,
} from "../../../model/course/course-list";
import { ApiResponse } from "../../../model/schema/base_schema";
import { Pagination } from "../../../shared";

const COURSE_URL = "/api/course";

function HomeClass() {
  const [courseList, setCourseList] = useState<CourseListOutput>({
    courseList: [],
  });
  const [currentPageCourse, setCurrentPageCourse] = useState(1);
  const [classPerPageCourse, setClassPerPageCourse] = useState(4);

  const lastCourseIndex = currentPageCourse * classPerPageCourse;
  const firstCourseIndex = lastCourseIndex - classPerPageCourse;
  const currentCourse = courseList.courseList.slice(
    firstCourseIndex,
    lastCourseIndex
  );

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
    fetchDataCourse();
  }, []);

  return (
    <>
      <div className="class-wrapper">
        <div
          className="card"
          style={{ backgroundColor: "#11235a", border: "none" }}
        >
          <div className="card-body">
            <div className="row">
              {currentCourse.map((data, index) => (
                <div
                  className="col-md-3 d-flex align-items-stretch mb-3"
                  key={index}
                >
                  <div className="card" style={{ border: "none" }}>
                    <div className="container-class-header">
                      <img
                        className="disc-image img-fluid"
                        src={`assets/${data.image}`}
                        alt=""
                        style={{ height: "20rem" }}
                      />

                      <div className="top-left p-1">
                        <img
                          className="img-fluid"
                          src={`assets/coin.png`}
                          alt=""
                          style={{ height: "24px" }}
                        />
                        <span style={{ marginLeft: "5px" }}>{data.price}</span>
                      </div>
                      <div className="top-right" style={{ fontSize: "14px" }}>
                        {data.chapter} chapter
                      </div>
                    </div>
                    <div className="card-body p-2">
                      <div className="card-text">
                        <div className="class-content">
                          <div className="class">
                            <div className="d-block">
                              <div
                                className=""
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <img
                                  src={`assets/coin.png`}
                                  alt="abc"
                                  className="me-2"
                                />
                                <span
                                  style={{
                                    color: "#000",
                                    alignItems: "center",
                                  }}
                                >
                                  Pengajar
                                </span>
                              </div>
                              <div className="d-block p-1">
                                <div className="title-class mb-2">
                                  <h3 style={{ color: "#000" }}>
                                    {data.title}
                                  </h3>
                                </div>
                                <span
                                  className="badge badge-outlined me-2"
                                  style={{
                                    borderColor: "#000",
                                    backgroundColor: "#fff",
                                    color: "#000",
                                    borderRadius: "15px",
                                  }}
                                >
                                  {data.category}
                                </span>
                                <span
                                  className="badge badge-outlined me-2"
                                  style={{
                                    borderColor: "#000",
                                    backgroundColor: "#fff",
                                    color: "#000",
                                    borderRadius: "15px",
                                  }}
                                >
                                  {data.level}
                                </span>
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
    </>
  );
}

export default HomeClass;
