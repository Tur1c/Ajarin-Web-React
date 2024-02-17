import { ReactNode } from "react";
import { GoHome } from "react-icons/go";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { PiEyeglassesLight } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import "./Sidebar.css";
import SidebarLoginRegister from "./SidebarLoginRegister";
import { Link } from "react-router-dom";
import { AccountOutput } from "../../model/Account";

interface Props {
  children?: ReactNode;
  account: AccountOutput;
}

const addElement = () => {
  let sidebar = document.querySelector(".sidebar");
  sidebar?.classList.toggle("active");
};

const Sidebar = ({ children, account }: Props) => {
  const isLogged = localStorage.getItem("jwt");
  console.log(isLogged);
  return (
    <>
      <div className="sidebar">
        <div className="logo_content">
          <div className="logo">
            <div className="logo_name">
              <h1
                className="fw-bold"
                style={{ color: "#fff", fontSize: "22px" }}
              >
                ajar
                <span style={{ color: "#F6ECA9" }}>in</span>
              </h1>
            </div>
          </div>
        </div>
        <ul className="">
          <li>
            <a href="#">
              <i>
                <GoHome />
              </i>
              {/* <span className="links_name">Dashboard</span> */}
            </a>
            <span className="tooltip">Dashboard</span>
          </li>
          <li>
            <a href="#">
              <i>
                <HiOutlineBookOpen />
              </i>
              {/* <span className="links_name">Discussion</span> */}
            </a>
            <span className="tooltip">Discussion</span>
          </li>
          <li>
            <a href="#">
              <i>
                <PiEyeglassesLight />
              </i>
              {/* <span className="links_name">Lecturer</span> */}
            </a>
            <span className="tooltip">Lecturer</span>
          </li>
          <li>
            <a href="#">
              <i>
                <IoChatboxEllipsesOutline />
              </i>
              {/* <span className="links_name">Forum</span> */}
            </a>
            <span className="tooltip">Forum</span>
          </li>
        </ul>
        <div className="profile_content">
          <div className="profile">
            {isLogged ? (
              <div className="profile_details">
                <Link to={"/profile"} state={account}>
                  <i>
                    <CgProfile />
                  </i>
                </Link>
                {/* <img src="profile.jpg" alt="profile" /> */}
              </div>
            ) : (
              <SidebarLoginRegister account={account} />
            )}
          </div>
        </div>
      </div>
      <div className="home-content">{children}</div>
    </>
  );
};

export default Sidebar;
