import { Link } from "react-router-dom";

const SidebarLoginRegister = () => {
    return (
        <>
            <div className="button">
              <button style={{ backgroundColor: "#F6ECA9" }}>
                <Link to={"/login"} style={{ color: "#000" }}>
                  Login
                </Link>
              </button>
              <button>
                <Link to={"/register"} style={{ color: "#fff" }}>
                  Signin
                </Link>
              </button>
            </div>
            <i id="logout"></i>
        </>
    )
}

export default SidebarLoginRegister;