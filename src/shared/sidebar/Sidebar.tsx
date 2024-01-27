import { ReactNode } from "react";
import { MdMenu } from "react-icons/md";
import { GoHome } from "react-icons/go";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { PiEyeglassesLight } from "react-icons/pi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import "./Sidebar.css";

interface Props {
  children?: ReactNode;
}

const addElement = () => {
  let sidebar = document.querySelector(".sidebar");
  sidebar?.classList.toggle("active");
};

const Sidebar = ({ children }: Props) => {
  return (
    <>
      <div className="sidebar">
        <div className="logo_content">
          <div className="logo">
            <div className="logo_name">Ajarin</div>
          </div>
          <i id="btn" onClick={addElement}>
            <MdMenu />
          </i>
        </div>
        <ul className="">
          <li>
            <a href="#">
              <i><GoHome /></i>
              <span className="links_name">Dashboard</span>
            </a>
            <span className="tooltip">Dashboard</span>
          </li>
          <li>
            <a href="#">
              <i><HiOutlineBookOpen /></i>
              <span className="links_name">Discussion</span>
            </a>
            <span className="tooltip">Discussion</span>
          </li>
          <li>
            <a href="#">
              <i><PiEyeglassesLight /></i>
              <span className="links_name">Lecturer</span>
            </a>
            <span className="tooltip">Lecturer</span>
          </li>
          <li>
            <a href="#">
              <i><IoChatboxEllipsesOutline /></i>
              <span className="links_name">Forum</span>
            </a>
            <span className="tooltip">Forum</span>
          </li>
        </ul>
        <div className="profile_content">
          <div className="profile">
            <div className="profile_details">
              {/* <img src="profile.jpg" alt="profile" /> */}
            </div>
            <i id="logout"></i>
          </div>
        </div>
      </div>
      <div className="home-content">
        {children}
        aa
      </div>
    </>
  );
};

export default Sidebar;
