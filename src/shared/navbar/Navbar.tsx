import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

interface Props {
    children?: ReactNode;
}

const Navbar = ({ children }: Props) => {
  return (
    <div className="navbar">
      <div
        className="container-login-regis navbar p-5 d-block"
        style={{ alignItems: "start" }}
      >
        <div className="d-flex mx-5" style={{cursor:"default"}}>
          <h1 className="fw-bold" style={{ color: "#fff", fontSize: "48px" }}>
            ajar
            <span style={{ color: "#F6ECA9" }}>in</span>
          </h1>
          <ul className="text-muted align-items-center">
            <Link className="mx-5 text-redirect" to={"/"}>
              Home
            </Link>
            <Link className="mx-5 text-redirect" to={"/login"}>
              Log In
            </Link>
            <Link className="mx-5 text-redirect" to={"/register"}>
              Sign Up
            </Link>
          </ul>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Navbar;
