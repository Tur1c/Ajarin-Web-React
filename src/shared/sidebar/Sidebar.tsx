import { jwtDecode } from "jwt-decode";
import { ReactNode } from "react";
import { GiSpellBook } from "react-icons/gi";
import { GoHome } from "react-icons/go";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiEyeglassesLight } from "react-icons/pi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useSessionStorage } from "../../context/useLocalStorage";
import { AccountLoginSchema, AccountOutput } from "../../model/Account";
import { ApiResponse } from "../../model/schema/base_schema";
import { TeacherOutput } from "../../model/teacher/teacher-model";
import { transfromToServiceLoginAccountOutput } from "../../service/Account/account.service";
import "./Sidebar.css";
import SidebarLoginRegister from "./SidebarLoginRegister";

interface Props {
  children?: ReactNode;
  account: AccountOutput;
  teacheracc?: TeacherOutput | null | undefined;
  onLoadingTrue?: any;
  onLoadingFalse?: any;
}

interface JwtPayload {
  roles: string;
}

const STATUS_REGISTERED_TEACHER = "/api/account/inquiry/teacher/";
const CHANGE_ACCOUNT = "/api/account/change-role?email=";

const Sidebar = ({
  children,
  account,
  teacheracc,
  onLoadingTrue,
  onLoadingFalse,
}: Props) => {
  const isLogged = sessionStorage.getItem("jwt");
  const userRole = sessionStorage.getItem("role");
  const navigate = useNavigate();
  console.log(teacheracc);

  let isAlreadyTeacher = false;
  console.log(account);

  const [token, setToken] = useSessionStorage("jwt", "");
  const [user, setUser] = useSessionStorage("user", "");
  const [role, setRole] = useSessionStorage("role", "");

  const isAlreadyRegisterTeacher = async (email: string) => {
    try {
      const response = await axios.get(STATUS_REGISTERED_TEACHER + email, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
        withCredentials: true,
      });
      if (response.data.outputSchema != null) {
        isAlreadyTeacher = true;
      }
      console.log(response.data);
    } catch {}
  };

  const changeAccount = async (email: string) => {
    // onLoadingTrue();
    try {
      const response = await axios.get<ApiResponse<AccountLoginSchema>>(
        CHANGE_ACCOUNT + email,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      console.log(response.data, "change account");

      const output = transfromToServiceLoginAccountOutput(response.data);
      const token = output.token;

      setUser(email);
      setToken(token);
      const decoded = jwtDecode<JwtPayload>(token);
      console.log(decoded.roles, "role di login");
      setRole(decoded.roles.substring(5, decoded.roles.length));

      navigate("/");
      onLoadingFalse();
    } catch {}
  };

  const handleAlreadyRegisteredAsTeacher = (account: AccountOutput) => {
    isAlreadyRegisterTeacher(account.email);
    setTimeout(() => {
      console.log(isAlreadyTeacher);

      if (!isAlreadyTeacher) {
        navigate("/register/teacher", {
          state: { account },
        });
        isAlreadyTeacher = false;
      } else {
        changeAccount(account.email);
      }
    }, 1500);
  };

  return (
    <div className="sidebar">
      <div className="logo-content" style={{ cursor: "default" }}>
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
            <NavLink
              to={"/calendar"}
              state={
                userRole === "Teacher"
                  ? { account: account, teacher: teacheracc }
                  : account
              }
            >
              <i>
                <HiOutlineBookOpen />
              </i>
            </NavLink>
            {/* <span className="links_name">Discussion</span> */}
            <span className="tooltip-text">MySpace</span>
          </div>
          <div className="menu">
            <NavLink
              to={"/lecturer"}
              state={
                userRole === "Teacher"
                  ? { account: account, teacher: teacheracc }
                  : account
              }
            >
              <i>
                <PiEyeglassesLight />
              </i>
              {/* <span className="links_name">Lecturer</span> */}
            </NavLink>
            <span className="tooltip-text">MyLecturer</span>
          </div>
          <div className="menu">
            <NavLink
              to={"/forum"}
              state={
                userRole === "Teacher"
                  ? { account: account, teacher: teacheracc }
                  : account
              }
            >
              <i>
                <IoChatboxEllipsesOutline />
              </i>
              {/* <span className="links_name">Forum</span> */}
            </NavLink>
            <span className="tooltip-text">Forum</span>
          </div>
        </div>
        <div className="profile-content">
          <div className="profile">
            {isLogged ? (
              <div
                className="d-flex col profile-details"
                onClick={onLoadingTrue}
              >
                {userRole === "Teacher" ? (
                  <div className="">
                    <div className="">
                      <button
                        className="rounded-circle change-role-btn"
                        type="button"
                        style={{
                          height: "5vw",
                          width: "5vw",
                          border: "3px solid var(--yelo)",
                          color: "var(--yelo)",
                        }}
                        onClick={() => {
                          handleAlreadyRegisteredAsTeacher(account);
                        }}
                      >
                        <b className="text-center">
                          <GiSpellBook style={{ fontSize: "48px" }} />
                          <span className="tooltip-role-btn">
                            Become Student
                          </span>
                        </b>
                      </button>
                    </div>
                    <div className="to-profile">
                      <Link
                        to={"/lecturer/" + teacheracc?.account.fullName}
                        state={{ data: teacheracc }}
                      >
                        <img
                          className="img-fluid rounded-circle bg-light"
                          src={
                            !account?.urlImage
                              ? "/assets/default_picture.png"
                              : "/" + account.urlImage
                          }
                          alt=""
                          style={{
                            height: "5vw",
                            width: "5vw",
                            marginTop: "1rem",
                          }}
                        />
                        <span className="tooltip-profile-btn">Lecturer Profile</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <div className="">
                      <button
                        className="rounded-circle change-role-btn"
                        type="button"
                        style={{
                          height: "5vw",
                          width: "5vw",
                          border: "3px solid var(--yelo)",
                          color: "var(--yelo)",
                        }}
                        onClick={() => {
                          handleAlreadyRegisteredAsTeacher(account);
                        }}
                      >
                        <b className="text-center">
                          <LiaChalkboardTeacherSolid
                            style={{ fontSize: "48px" }}
                          />
                          <span className="tooltip-role-btn">
                            Become Teacher
                          </span>
                        </b>
                      </button>
                    </div>
                    <div className="to-profile">
                      <Link to={"/profile"} state={account}>
                        <img
                          className="img-fluid rounded-circle bg-light"
                          src={
                            "/" + account?.urlImage ||
                            "/assets/default_picture.png"
                          }
                          alt=""
                          style={{
                            height: "5vw",
                            width: "5vw",
                            marginTop: "1rem",
                          }}
                        />
                        <span className="tooltip-profile-btn">Profile</span>

                        {account.notification.filter((x) => !x.isRead).length >
                        0 ? (
                          <span
                            className="position-absolute translate-middle badge rounded-pill bg-danger"
                            style={{
                              top: "88%",
                              left: "77%",
                              fontSize: "18px",
                            }}
                          >
                            {account.notification.filter((x) => !x.isRead).length}
                          </span>
                        ) : (
                          ""
                        )}
                      </Link>
                    </div>
                  </div>
                )}

                {/* <img src="profile.jpg" alt="profile" /> */}
              </div>
            ) : (
              <SidebarLoginRegister />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
