import { useWindowWidth } from "@wojtekmaj/react-hooks";
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

  const editProfile = () => {};

  const handleLogout = () => {
    // setAccount({ ...account, id: account.id });
    logout();
  };

  console.log(state, "lecturer detail");

  return (
    <div
      className="lecturer-detail-page"
      style={{ height: "100vh", padding: "2rem 4rem" }}
    >
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
            <IoCloseCircleOutline onClick={() => navigate(-1)} />
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
                  className="img-fluid bg-black"
                  src={state.data.account.urlImage || `assets/coin.png`}
                  alt=""
                  style={{ width: "25vh", height: "25vh" }}
                />
              </div>

              <div className="d-block w-100" style={{ margin: "0rem 1rem" }}>
                <h3>
                  <b>{state.data.account.fullName}</b>
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
                {state.data.account.city}, {state.data.account.country}
              </p>
            </div>

            <div className="d-flex" style={{ gap: "1rem" }}>
              <button
                className="subs-edit-btn"
                type="button"
                onClick={
                  userRole === "Teacher"
                    ? () => editProfile()
                    : () => hanldeSubscribe()
                }
              >
                <b>{userRole === "Teacher" ? "Edit Detail" : "Subscribe"}</b>
              </button>
              <button
                className="logout-btn"
                type="button"
                onClick={handleLogout}
              >
                <b>Logout</b>
              </button>
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

                <div className="align-items-start card-body h-100">
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
                  <p className=" w-100">
                    {state.data.achievement}
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                  </p>
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
                  width: "135rem",
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
                              style={{ padding: "0rem 2rem", opacity: "0.8" }}
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
                  <div className="w-100 justify-content-center d-flex" style={{marginTop:"2rem"}}>
                    <button className="see-all-btn">See All</button>
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
