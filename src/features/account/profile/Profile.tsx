import { useContext, useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import { useAuth } from "../../../context/AuthProvider";
import {
  AccountOutput,
  AccountRegisterSchema,
  transfromToAccountOutput,
} from "../../../model/Account";
import { ApiResponse } from "../../../model/schema/base_schema";
import "./profile.css";

const HOME_URL = "/api/account?email=" + sessionStorage.getItem("user");
const UPDATE_URL = "/api/account/";

const Profile = (props: any) => {
  const { logout }: any = useAuth();
  const { state } = useLocation();
  console.log(state,"di state nih");

  const [account, setAccount] = useState<AccountOutput>(state.account);
  const [editAccount, setEditAccount] = useState<AccountOutput>(state.account);

  const navigate = useNavigate();

  const [key, setKey] = useState("profile");
  const [editProfile, setEditProfile] = useState(false);

  // const fetchDataAccount = async () => {
  //   try {
  //     const response = await axios.get<ApiResponse<AccountRegisterSchema>>(
  //       HOME_URL,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + sessionStorage.getItem("jwt"),
  //         },
  //         withCredentials: true,
  //       }
  //     );
  //     if (!state) {
  //       setAccount(transfromToAccountOutput(response.data.outputSchema));
  //       setEditAccount(transfromToAccountOutput(response.data.outputSchema));
  //     }
  //   } catch (error) {}
  // };

  const editProfileAccount = async () => {
    try {
      const response = await axios.put<ApiResponse<AccountRegisterSchema>>(
        UPDATE_URL + account.id,
        JSON.stringify(editAccount),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      setAccount(transfromToAccountOutput(response.data.outputSchema));
    } catch {}
  };

  console.log(!state);
  console.log(account,"di profile");
  console.log(editAccount,"hadeh");
  const handleLogout = () => {
    setAccount({ ...account, id: account.id });
    logout();
  };

  const handleEditProfile = () => {
    // console.log(account);
    editProfileAccount();
    setEditProfile(false);
  };

  // useEffect(() => {
  //   if (!state) {
  //     fetchDataAccount();
  //   } else {
  //     if (state.account.fullName.length !== 0) {
  //       setAccount((account) => ({
  //         ...state,
  //       }));
  //       setEditAccount((account) => ({
  //         ...state,
  //       }));
  //     } else {
  //       fetchDataAccount();
  //     }
  //   }
  // }, []);

  return (
    // <>  </>
    <div className="container-profile">
      <div className="container p-5" style={{ height: "100vh" }}>
        <div className="row">
          <div className="col-5">
            <div className="left-container d-block">
              <div className="mb-3">
                <IoIosCloseCircleOutline
                  style={{ color: "#fff", fontSize: "54px" }}
                  onClick={() => navigate(-1)}
                />
              </div>
              <div className="card" style={{ height: "600px" }}>
                <div className="card-body">
                  <div className="card-title text-center mb-5">
                    <img
                      className="img-fluid rounded-circle mb-4"
                      src={`assets/coin.png`}
                      alt=""
                      style={{ height: "20rem" }}
                    />
                    <p className="mb-1">{account.fullName}</p>
                    <p>{account.school}</p>
                  </div>
                  <div className="card-text">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Courses Completed</span>
                        <span>kast item</span>
                      </li>
                      <li className="list-group-item  d-flex justify-content-between">
                        <span>Courses Ongoing</span>
                        <span>kast item</span>
                      </li>
                      <li className="list-group-item  d-flex justify-content-between">
                        <span>Discussion Completed</span>
                        <span>kast item</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-7">
            <div className="logo_content" style={{ marginBottom: "45px" }}>
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
            <div
              className="container-profile-detail bg-white"
              style={{ height: "600px" }}
            >
              <Tabs
                variant="underline"
                id="home-tab"
                activeKey={key}
                onSelect={(k) => setKey(k || "discussion")}
                className="mb-3"
                justify
                style={{}}
              >
                <Tab eventKey="profile" title="Profile">
                  <div className="row">
                    <div className="col-md-12 border-right text-dark">
                      <div className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h4 className="text-right">Profile Settings</h4>
                        </div>
                        <div className="row mt-2">
                          <div className="col-md-6">
                            <label className="labels">First Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="First Name"
                              value={editAccount.firstName}
                              onChange={(e) =>
                                setEditAccount({
                                  ...editAccount,
                                  firstName: e.target.value,
                                })
                              }
                              disabled={!editProfile}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="labels">Last Name</label>
                            <input
                              type="text"
                              placeholder="Last Name"
                              className="form-control"
                              value={editAccount.lastName}
                              onChange={(e) =>
                                setEditAccount({
                                  ...editAccount,
                                  lastName: e.target.value,
                                })
                              }
                              disabled={!editProfile}
                            />
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-md-6">
                            <label className="labels">Age</label>
                            <input
                              type="number"
                              placeholder="Age"
                              className="form-control"
                              value={editAccount.age}
                              onChange={(e) =>
                                setEditAccount({
                                  ...editAccount,
                                  age: e.target.valueAsNumber,
                                })
                              }
                              disabled={!editProfile}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="labels">Gender</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editAccount.gender}
                              onChange={(e) =>
                                setEditAccount({
                                  ...editAccount,
                                  gender: e.target.value,
                                })
                              }
                              placeholder="Gender"
                              disabled={!editProfile}
                            />
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-md-6">
                            <label className="labels">Phone Number</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Phone Number"
                              value={editAccount.phoneNumber}
                              onChange={(e) =>
                                setEditAccount({
                                  ...editAccount,
                                  phoneNumber: e.target.value,
                                })
                              }
                              disabled={!editProfile}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="labels">Email Address</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editAccount.email}
                              onChange={(e) =>
                                setEditAccount({
                                  ...editAccount,
                                  email: e.target.value,
                                })
                              }
                              placeholder="Email Address"
                              disabled={!editProfile}
                            />
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-md-6">
                            <label className="labels">Education Level</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Education"
                              value={editAccount.education}
                              onChange={(e) =>
                                setEditAccount({
                                  ...editAccount,
                                  education: e.target.value,
                                })
                              }
                              disabled={!editProfile}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="labels">School / Works at</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editAccount.school}
                              onChange={(e) =>
                                setEditAccount({
                                  ...editAccount,
                                  school: e.target.value,
                                })
                              }
                              placeholder="School / Works at"
                              disabled={!editProfile}
                            />
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-md-6">
                            <label className="labels">City</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="City"
                              value={editAccount.city}
                              onChange={(e) =>
                                setEditAccount({
                                  ...editAccount,
                                  city: e.target.value,
                                })
                              }
                              disabled={!editProfile}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="labels">Country</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editAccount.country}
                              onChange={(e) =>
                                setEditAccount({
                                  ...editAccount,
                                  country: e.target.value,
                                })
                              }
                              placeholder="Country"
                              disabled={!editProfile}
                            />
                          </div>
                        </div>
                        <div className="d-block text-center">
                          <div className="mt-4">
                            {editProfile ? (
                              <button
                                className="btn btn-primary profile-button"
                                type="button"
                                style={{
                                  width: "150px",
                                  borderRadius: "25px",
                                  border: "2px solid none",
                                  backgroundColor: "#11235A",
                                  color: "#fff",
                                }}
                                onClick={handleEditProfile}
                              >
                                Save Profile
                              </button>
                            ) : (
                              <button
                                className="btn btn-primary profile-button"
                                type="button"
                                style={{
                                  width: "150px",
                                  borderRadius: "25px",
                                  border: "2px solid none",
                                  backgroundColor: "#11235A",
                                  color: "#fff",
                                }}
                                onClick={() => setEditProfile(true)}
                              >
                                Edit Profile
                              </button>
                            )}
                          </div>
                          <div className="mt-3">
                            <button
                              className="btn profile-button"
                              type="button"
                              style={{
                                width: "150px",
                                borderRadius: "25px",
                                border: "2px solid #11235A",
                                backgroundColor: "#fff",
                                color: "#11235A",
                              }}
                              onClick={handleLogout}
                            >
                              <b>Logout</b>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="notification" title="Notification"></Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
