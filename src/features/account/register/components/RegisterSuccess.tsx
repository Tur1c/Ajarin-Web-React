import { Link, NavLink } from "react-router-dom";
import "./RegisterSuccess.css";

const RegSuccess = () => {
  return (
    <>
      <div
        className="register-success justify-content-center align-items-center d-flex"
        style={{ height: "100vh" }}
      >
        <div className="logo text-center">
          <div className="logo_name mb-5">
            <h1 className="fw-bold" style={{ color: "#fff", fontSize: "32px" }}>
              ajar
              <span style={{ color: "#F6ECA9" }}>in</span>
            </h1>
          </div>
          <div className="text-white">
            <h1 className="fw-bold">Congratulations !</h1>
            <p>Your account has been created! Enjoy Your Learning Journey</p>
            <div className="button mt-5">
              <button style={{ backgroundColor: "#F6ECA9" }} >
                <NavLink to={"/login"} style={{ color: "#000" }}>
                  Start
                </NavLink>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegSuccess;
