import { useWindowWidth } from "@wojtekmaj/react-hooks";
import { Key } from "react";
import { FaStar } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { CourseList } from "../../model/course/course-list";
import "./lecturerDetail.css";
import { TeacherOutput } from "../../model/teacher/teacher-model";
import { useAuth } from "../../context/AuthProvider";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const SUBSCRIBE_LECTURER = "/api/account/subscribe?teacher-id=";

const LecturerDetail = () => {
  const isLogged = sessionStorage.getItem("jwt");
  const emailUser = sessionStorage.getItem("user");
  const userRole = sessionStorage.getItem("role");
  const { logout, login }: any = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const width = useWindowWidth();


  console.log(state, "lecturer detail");

  var pdfAsDataUri = "data:application/pdf;base64," + state.data.cvUrl;

  const handleOpenPdf = () => {
    window.open(pdfAsDataUri);
  };

  const subscribeLecturer = async () => {
    try {
      const response = await axios.get(
        SUBSCRIBE_LECTURER + state.data.id + "&email=" + emailUser,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + isLogged,
          },
          withCredentials: true,
        }
      );
      navigate("/lecturer");
    } catch (error) {}
  };

  const hanldeSubscribe = () => {
    subscribeLecturer();
  };

  const editProfile = () => {

  }

  const handleLogout = () => {
    // setAccount({ ...account, id: account.id });
    logout();
  };

  console.log(state, "lecturer detail");

  return (
    <div className="container-fluid p-5" style={{ height: "100vh" }}>
      <div className="row">
        <div className="col-5">
          <div className="left-container d-block">
            <div className="mb-5">
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "50px",
                }}
              >
                <IoCloseCircleOutline onClick={() => navigate(-1)} />
              </button>
            </div>
            <div
              className="teacher-content d-flex flex-column justify-content-center"
              style={{ height: "70vh" }}
            >
              <div className="d-flex">
                <img
                  className="img-fluid mb-4"
                  src={state.data.account.urlImage || `assets/coin.png`}
                  alt=""
                  style={{ width: "20rem" }}
                />
                <div className="d-block ms-3">
                  <h3>{state.data.account.fullName}</h3>
                  <p>{state.data.description}</p>
                </div>
              </div>
              <FaStar
                style={{
                  color: "green",
                  fontSize: "25px",
                  marginRight: "5px",
                }}
              />{" "}
              {state.data.rating}
              <p>
                {state.data.account.city}, {state.data.account.country}
              </p>

              <button
                    className="btn btn-primary profile-button"
                    type="button"
                    style={{
                      width: "200px",
                      height: "60px",
                      borderRadius: "25px",
                      border: "2px solid none",
                      backgroundColor: "#11235A",
                      color: "#fff",
                    }}
                    onClick={userRole === "Teacher"? () => editProfile() : () => hanldeSubscribe()}
                  >
                    {userRole === "Teacher"? "Edit Detail" : "Subscribe"}
                </button>
                <button
                  className="btn profile-button"
                  type="button"
                  style={{
                    width: "250px",
                    borderRadius: "25px",
                    border: "2px solid #11235A",
                    backgroundColor: "#fff",
                    color: "#11235A",
                  }}
                  onClick={handleLogout}
                >
                  <b>Logout</b>
                </button>
            </div>
          </div>
        </div>
        <div className="col-7">
          <div className="logo_content" style={{ marginBottom: "45px" }}>
            <div className="logo">
              <div className="logo_name">
                <h1
                  className="fw-bold"
                  style={{
                    color: "#fff",
                    fontSize: "35px",
                    marginLeft: "1rem",
                  }}
                >
                  ajar
                  <span style={{ color: "#F6ECA9" }}>in</span>
                </h1>
              </div>
            </div>
          </div>
          <div className="teacher-container-card-scroll">
            <ul className="cards">
              <li
                className="card text-white"
                style={{ background: "rgba(255, 255, 255, 0.1)" }}
              >
                <div>
                  <div className="" style={{ height: "30rem" }}>
                    <h2 className="fw-bold">Education & Experience</h2>
                    <div className="card-body h-50">
                      <div className="card-text" style={{ height: "3rem" }}>
                        {state.data.education}
                      </div>
                      <div className="card-text" style={{ height: "3rem" }}>
                        {state.data.experience}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li
                className="card text-white"
                style={{ background: "rgba(255, 255, 255, 0.1)" }}
              >
                <div>
                  <div className="" style={{ height: "30rem" }}>
                    <h2 className="fw-bold">Achievement</h2>
                    <div className="card-body h-50">
                      <div className="card-text" style={{ height: "3rem" }}>
                        {state.data.achievement}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li
                className="card text-white"
                style={{ background: "rgba(255, 255, 255, 0.1)" }}
              >
                <div>
                  <div className="" style={{ height: "30rem" }}>
                    <h2 className="fw-bold">CV Data</h2>
                    <div className="card-body h-50">
                      <div className="card-text" style={{ height: "30rem" }}>
                        <Document file={state.data.cvUrl}>
                          <Page
                            pageNumber={1}
                            width={Math.min(width ? width * 0.2 : 0)}
                          />
                        </Document>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li
                className="card text-white"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  width: "100rem",
                }}
              >
                <div>
                  <div className="" style={{ height: "30rem" }}>
                    <h2 className="fw-bold">Top Courses</h2>
                    <div className="card-body h-50">
                      <ul
                        className="cards"
                        style={{
                          height: "32rem",
                          gridAutoColumns: "calc(25% - 290px",
                        }}
                      >
                        {state.data.courses
                          .sort((a: { sold: number }, b: { sold: number }) =>
                            a.sold > b.sold ? -1 : 1
                          )
                          .slice(0, 5)
                          .map(
                            (
                              course: CourseList,
                              index: any
                            ) => (
                              <li
                                className="card"
                                key={index}
                                style={{ width: "20rem", height: "28rem" }}
                              >
                                <div className="text-center thumbnail container-class-header">
                                  <img
                                    className="img-fluid"
                                    src={`/assets/${course.image}`}
                                    alt=""
                                    style={{width: "20rem"}}
                                  />
                                  <div className="bottom-left p-0" style={{backgroundColor: "rgba(0, 0, 0, 0.0)"}}>
                                    <h2 style={{backgroundColor: "rgba(0, 0, 0, 0.8)"}}>#{index+1}</h2>
                                  </div>
                                </div>
                                <div className="card-body h-50 mt-5">
                                  <div className="card-title">
                                    {course.title}
                                  </div>
                                  <div
                                    className="card-text"
                                    style={{ height: "3rem" }}
                                  >
                                    {course.sold} Purchased
                                  </div>
                                </div>
                              </li>
                            )
                          )}
                        {/* <div className="row d-flex">
                        {state.data.courses
                          .sort((a: { sold: number }, b: { sold: number }) =>
                            a.sold > b.sold ? 1 : -1
                          )
                          .slice(0, 5)
                          .map((course: CourseList) => (
                            <div
                              className="card ms-5"
                              style={{ height: "25rem", width: "15rem" }}
                            >
                              <div className="card-body">
                                <img
                                  className="img-fluid"
                                  src={`assets/${course.image}`}
                                  alt=""
                                  style={{ height: "10rem" }}
                                />
                              </div>
                            </div>
                          ))}
                      </div> */}
                      </ul>
                      <button>See All</button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDetail;
