import { ReactNode } from "react";
import { GoHome } from "react-icons/go";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { PiEyeglassesLight } from "react-icons/pi";
import { Link, NavLink } from "react-router-dom";
import { AccountOutput, StudentDiscOutput } from "../../model/Account";
import "./Sidebar.css";
import SidebarLoginRegister from "./SidebarLoginRegister";

interface Props {
  children?: ReactNode;
  account: AccountOutput;
}

// const addElement = () => {
//   let sidebar = document.querySelector(".sidebar");
//   sidebar?.classList.toggle("active");
// };

const Sidebar = ({ children, account }: Props) => {
  const isLogged = sessionStorage.getItem("jwt");
  console.log(account);

  return (
    <div className="sidebar">
      <div className="logo-content">
        <h1 className="fw-bold" style={{ color: "#fff", fontSize: "32px" }}>
          ajar<span style={{ color: "#F6ECA9" }}>in</span>
        </h1>
      </div>
      <div className="mid-bottom">
        <div className="list-menu">
          <div className="menu">
            <NavLink to={"/"}>
              <i>
                <GoHome />
              </i>
              {/* <span className="links_name">Dashboard</span> */}
            </NavLink>
            <span className="tooltip-text">Home</span>
          </div>
          <div className="menu">
            <NavLink to={"/calendar"} state={account}>
              <i>
                <HiOutlineBookOpen />
              </i>
            </NavLink>
              {/* <span className="links_name">Discussion</span> */}
            <span className="tooltip-text">MySpace</span>
          </div>
          <div className="menu">
            <NavLink to={"/lecturer"} state={account}>
              <i>
                <PiEyeglassesLight />
              </i>
              {/* <span className="links_name">Lecturer</span> */}
            </NavLink>
            <span className="tooltip-text">MyLecturer</span>
          </div>
          <div className="menu">
            <NavLink to={"/forum"} state={account}>
              <i>
                <IoChatboxEllipsesOutline />
              </i>
              {/* <span className="links_name">Forum</span> */}
            </NavLink>
            <span className="tooltip-text">Forum</span>
          </div>
        </div>
        <div className="profile_content">
          <div className="profile">
            {isLogged ? (
              <div className="profile_details" style={{display: "block"}}>
                <Link to={"/profile"} state={account}>
                  {/* <i> */}
                  <img
                    className="img-fluid"
                    src={account?.urlImage || `assets/coin.png`}
                    alt=""
                    style={{ height: "100%", width: "100%" }}
                  />
                  {/* </i> */}
                </Link>
                {/* <img src="profile.jpg" alt="profile" /> */}
              </div>
            ) : (
              <SidebarLoginRegister/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
