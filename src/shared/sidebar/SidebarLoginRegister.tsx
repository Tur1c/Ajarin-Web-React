import { Link } from "react-router-dom";
import { AccountOutput } from "../../model/Account";
import "./Sidebar.css";

const SidebarLoginRegister = () => {
    return (
        <>
            <div className="button">
              <button className="login-btn">
                <Link to={"/login"} style={{ color: "var(--blue)", fontWeight: "600" }}>
                  Log In
                </Link>
              </button>
              <button className="signup-btn">
                <Link to={"/register"} style={{ color: "var(--white)", fontWeight: "600" }}>
                  Sign Up
                </Link>
              </button>
            </div>
            {/* <i id="logout"></i> */}
        </>
    )
}

export default SidebarLoginRegister;