import { useWindowWidth } from "@wojtekmaj/react-hooks";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthProvider";
import { CourseList } from "../../model/course/course-list";
import "./lecturerDetail.css";
import TeacherModalEditProfile from "./teacher-modal-edit-profile";

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

  const [isLoading, setIsLoading] = useState(false);
  const [showModalEditProfile, setShowModalEditProfile] = useState(false);
  const [flagLoadingModal, setFlagLoadingModal] = useState(false);

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
    handleShowModalEditProfile();
  };

  const handleLogout = () => {
    // setAccount({ ...account, id: account.id });
    logout();
  };

  const handleCloseModalEditProfile = () => setShowModalEditProfile(false);

  const handleFlagModalEditProfile = () =>
    setFlagLoadingModal(!flagLoadingModal);

  const handleShowModalEditProfile = () => {
    setShowModalEditProfile(true);
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [flagLoadingModal]);

  console.log(state, "lecturer detail");

  return (
    <div
      className="lecturer-detail-page"
      style={{ height: "100vh", padding: "2rem 4rem" }}
    >
      {!isLoading ? (
        <>
          <div className="d-flex justify-content-between align-items-center ">
            <div>
              <button
                style={{
                  position: "relative",
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "50px",
                }}
              >
                <IoCloseCircleOutline onClick={() => navigate("/lecturer")} />
              </button>
            </div>
            <div className="logo_content" style={{ cursor: "default" }}>
              <div className="logo">
                <div className="logo_name">
                  <h1
                    className="fw-bold"
                    style={{
                      color: "#fff",
                      fontSize: "36px",
                    }}
                  >
                    ajar
                    <span style={{ color: "#F6ECA9" }}>in</span>
                  </h1>
                </div>
              </div>
            </div>
            <div></div>
          </div>
          <div className="row">
            <div className="d-flex col-6 justify-content-center align-items-center">
              <div className="left-container d-flex row text-white w-100">
                <div className="d-flex col w-100">
                  <div>
                    <img
                      className="bg-light"
                      src={
                        "/assets/" + state.data.user.urlImage ||
                        `assets/coin.png`
                      }
                      alt=""
                      style={{
                        width: "25vh",
                        height: "25vh",
                        objectFit: "fill",
                      }}
                    />
                  </div>

                  <div
                    className="d-block w-100"
                    style={{ margin: "0rem 1rem" }}
                  >
                    <h3>
                      <b>{state.data.user.fullName}</b>
                    </h3>
                    <p>{state.data.description}</p>
                  </div>
                </div>

                <div className="" style={{ margin: "0.5rem 0rem" }}>
                  <FaStar
                    style={{
                      color: "yellow",
                      fontSize: "25px",
                      marginRight: "4px",
                    }}
                  />{" "}
                  {state.data.rating}
                </div>

                <div style={{ opacity: "0.6" }}>
                  <p className="">
                    {state.data.user.city}, {state.data.user.country}
                  </p>
                </div>

                <div className="d-flex" style={{ gap: "1rem" }}>
                  {userRole === "Teacher" &&
                  (state.account === undefined ||
                    state.account?.fullName ===
                      state.data.user.firstName +
                        " " +
                        state.data.user.lastName) ? (
                    <>
                      <button
                        className="subs-edit-btn"
                        type="button"
                        onClick={() => editProfile()}
                      >
                        <b>Edit Detail</b>
                      </button>
                      <button
                        className="logout-btn"
                        type="button"
                        onClick={handleLogout}
                      >
                        <b>Logout</b>
                      </button>
                    </>
                  ) : (
                    <>
                      {userRole === "Student" &&
                      state.account.fullName !==
                        state.data.user.firstName +
                          " " +
                          state.data.user.lastName ? (
                        <button
                          className="subs-edit-btn"
                          type="button"
                          onClick={() => hanldeSubscribe()}
                        >
                          <b>Subscribe</b>
                        </button>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="teacher-container-card-scroll">
                <ul className="cards">
                  <li
                    className="card text-white"
                    style={{ background: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <div>
                      <h2 className="fw-bold">Education & Experience</h2>
                    </div>

                    <div className="d-block align-items-start card-body h-100">
                      <div className="card-text" style={{ height: "3rem" }}>
                        {state.data.education}
                      </div>
                      <div className="align-items-start card-body h-100">
                        <p className="w-100">{state.data.experience}</p>
                      </div>
                    </div>
                  </li>
                  <li
                    className="card text-white"
                    style={{ background: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <div>
                      <h2 className="fw-bold">Achievement</h2>
                    </div>
                    <div className="align-items-start card-body h-100">
                      <p className=" w-100">{state.data.achievement}</p>
                    </div>
                  </li>
                  <li
                    className="card text-white"
                    style={{ background: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <div>
                      <div>
                        <h2 className="fw-bold">CV Data</h2>
                        <div className="card-body h-50 justify-content-center">
                          <div className="card-text">
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
                    className="card text-white d-flex"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      width: "145rem",
                    }}
                  >
                    <h2 className="fw-bold">Top Courses</h2>
                    <div className="h-100">
                      <ul
                        className="d-flex col"
                        style={{
                          gridAutoColumns: "calc(25% - 290px)",
                          minHeight: "30rem",
                        }}
                      >
                        {state.data.courses
                          .sort((a: { sold: number }, b: { sold: number }) =>
                            a.sold > b.sold ? -1 : 1
                          )
                          .slice(0, 5)
                          .map((course: CourseList, index: any) => (
                            <li
                              className="top-course-item"
                              key={index}
                              style={{
                                marginRight: "2rem",
                                borderRadius: "0.5rem",
                                backgroundColor: "rgba(255,255,255,0.2)",
                              }}
                            >
                              <div className="">
                                <div className="bottom-left-rank">
                                  <h2
                                    style={{
                                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                                      fontWeight: "bold",
                                      padding: "0.25rem",
                                      borderRadius: "0.25rem",
                                    }}
                                  >
                                    #{index + 1}
                                  </h2>
                                </div>
                                <img
                                  src={`/assets/${course.image}`}
                                  alt=""
                                  style={{
                                    width: "20vw",
                                    height: "20vw",
                                    objectFit: "cover",
                                    padding: "2rem",
                                  }}
                                />

                                {/* <div
                              className="bottom-left-rank p-0"
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.0)",
                              }}
                            >
                              <h2
                                style={{
                                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                                  
                                }}
                              >
                                #{index + 1}
                              </h2>
                            </div> */}
                              </div>
                              <div className="">
                                <div className="w-100">
                                  <h5
                                    className="fw-bold"
                                    style={{
                                      width: "20vw",
                                      fontSize: "21px",
                                      padding: "0rem 2rem",
                                    }}
                                  >
                                    {course.title}
                                  </h5>
                                </div>
                                <div
                                  style={{
                                    padding: "0rem 2rem",
                                    opacity: "0.8",
                                  }}
                                >
                                  {course.sold} Purchased
                                </div>
                              </div>
                            </li>
                          ))}
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
                      <div
                        className="w-100 justify-content-center d-flex"
                        style={{ marginTop: "2rem" }}
                      >
                        <button className="see-all-btn">See All</button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <TeacherModalEditProfile
              show={showModalEditProfile}
              onHide={handleCloseModalEditProfile}
              teacher={state.data}
              loadingSuccess={handleFlagModalEditProfile}
            ></TeacherModalEditProfile>
          </div>
        </>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100%" }}
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
  );
};

export default LecturerDetail;
