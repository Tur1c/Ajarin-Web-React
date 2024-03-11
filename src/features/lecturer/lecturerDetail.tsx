import { useWindowWidth } from "@wojtekmaj/react-hooks";
import { FaStar } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "./lecturerDetail.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const SUBSCRIBE_LECTURER = "/api/account/subscribe?teacher-id=";

const LecturerDetail = () => {
  const isLogged = sessionStorage.getItem("jwt");
  const emailUser = sessionStorage.getItem("user");
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
                  className="img-fluid rounded-circle mb-4"
                  src={state.data.account.urlImage || `assets/coin.png`}
                  alt=""
                  style={{ height: "10rem" }}
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
                onClick={() => hanldeSubscribe()}
              >
                Subscribe
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
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDetail;
