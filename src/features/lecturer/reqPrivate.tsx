import { ReactNode, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from "../../api/axios";
import { PrivateDiscInput, PrivateDiscOut } from "../../model/Account";
import {
  CategoryListOutput,
  CategorySchema,
  transfromToCategoryListOutput,
} from "../../model/category/category-model";
import { ApiResponse } from "../../model/schema/base_schema";
import "./reqPrivate.css";

interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
  account: string | undefined;
  teacher: number;
  currPrivate: PrivateDiscOut;
  role: string;
}

const ReqPrivate = (props: ModalType) => {
  const [privateDisc, setPrivateDisc] = useState<PrivateDiscInput>({
    title: "",
    subject: "",
    education: "",
    difficulty: "",
    date: "",
    start_time: "",
    end_time: "",
    coin: 0,
    user: undefined,
    teacher: undefined,
  });

  const CATEGORY_URL = "/api/category";
  const PRIVATE_URL =
    "api/account/private?account=" +
    props.account +
    "&teacher=" +
    props.teacher;

  // Subject Category
  const [categories, setCategories] = useState<CategoryListOutput>({
    categories: [],
  });

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get<ApiResponse<CategorySchema>>(
        CATEGORY_URL,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setCategories(transfromToCategoryListOutput(response.data.outputSchema));
    } catch (error) {}
  };

  //   Education Level

  const [selectedEdu, setSelectedEdu] = useState<string>("");
  interface eduOption {
    eduLevel: string;
    label: string;
  }

  const eduOptions: eduOption[] = [
    { eduLevel: "General", label: "General" },
    { eduLevel: "Highschool", label: "Highschool" },
    { eduLevel: "University", label: "University" },
  ];
  const SubmitPrivate = async (e: any) => {
    e.preventDefault();
    console.log(privateDisc);

    try {
      const response = await axios.post<ApiResponse<PrivateDiscInput>>(
        PRIVATE_URL,
        JSON.stringify(privateDisc),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      //   console.log(response);
      //   Swal.fire({
      //     title: "Success Request Private",
      //     icon: "success"
      //   });
      if (response.data.errorSchema.message === "Success") {
        Swal.fire({
          icon: "success",
          title: "Success Request Private",
          background: "#11235a",
          color: "#fff",
          confirmButtonColor: "#f6e976",
          confirmButtonText: "<span style='color:#000'> <b>OK</b> </span>",
        }).then(function () {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error Created Private Discussion",
          background: "#11235a",
          color: "#fff",
          confirmButtonColor: "#f6e976",
          confirmButtonText: "<span style='color:#000'> <b>OK</b> </span>",
        }).then(function () {
          window.location.reload();
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrivateReq = async (status: string, e: any) => {
    e.preventDefault();
    console.log(status);
    let UPDATE_PRIVATE_URL =
      "api/account/private/request?status=" +
      status +
      "&id=" +
      props.currPrivate.id;
    console.log(UPDATE_PRIVATE_URL);

    try {
      const response = await axios.post<ApiResponse<PrivateDiscInput>>(
        UPDATE_PRIVATE_URL,
        props.currPrivate.title,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      Swal.fire({
        icon: "success",
        title: "Success " + status + " private request",
        background: "#11235a",
        color: "#fff",
        confirmButtonColor: "#f6e976",
        confirmButtonText: "<span style='color:#000'> <b>OK</b> </span>",
      }).then(function () {
        window.location.reload();
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  console.log("props", props);

  return (
    <>
      {props.role === "Student"
        ? props.isOpen && (
            <div className="private-modal-overlay" onClick={props.toggle}>
              <div
                onClick={(e) => e.stopPropagation()}
                className="private-modal-box text-white"
              >
                <div className="d-flex col justify-content-between mt-3">
                  <div className="close-btn">
                    <IoIosCloseCircleOutline
                      style={{ color: "#fff", fontSize: "54px" }}
                      onClick={props.toggle}
                    />
                  </div>
                  <div
                    className="d-flex pe-4"
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      cursor: "default",
                    }}
                  >
                    <span>Request Private</span>
                  </div>
                  <div></div>
                </div>
                <p
                  style={{
                    fontSize: "21px",
                    fontWeight: "bold",
                    margin: "2rem 0rem",
                  }}
                >
                  Fill the Form First
                </p>
                <form
                  onSubmit={(e) => {
                    SubmitPrivate(e);
                    props.toggle();
                  }}
                >
                  <div className="input-boxx">
                    <input
                      type="text"
                      className="form-control"
                      required
                      style={{ width: "100%" }}
                      id="floatingTitle"
                      onChange={(e) =>
                        setPrivateDisc({
                          ...privateDisc,
                          title: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="floatingTitle">
                      What Topic do you want to Request?
                    </label>
                  </div>

                  {/* <div className="second-row d-flex col">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingSubject"
                        placeholder=""
                        required
                        onChange={(e) =>
                          setPrivateDisc({
                            ...privateDisc,
                            subject: e.target.value,
                          })
                        }
                      />
                      <label htmlFor="floatingSubject">Subject</label>
                    </div>
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingEducation"
                        placeholder=""
                        required
                        onChange={(e) =>
                          setPrivateDisc({
                            ...privateDisc,
                            education: e.target.value,
                          })
                        }
                      />
                      <label htmlFor="floatingEducation">Education Level</label>
                    </div>
                  </div> */}

                  <div className="d-flex col" style={{ gap: "1rem" }}>
                    <div className="input-boxx">
                      <select
                        className="form-control"
                        id="floatingSubject"
                        required
                        onChange={(e) =>
                          setPrivateDisc({
                            ...privateDisc,
                            subject: e.target.value,
                          })
                        }
                      >
                        <option value="Subject">Subject</option>
                        {categories.categories.map((data) => {
                          return (
                            <>
                              <option value={data.categoryName}>
                                {data.categoryName}
                              </option>
                            </>
                          );
                        })}
                      </select>
                    </div>

                    <div className="input-boxx">
                      <select
                        required
                        className="form-control"
                        id="floatingEducation"
                        onChange={(e) =>
                          setPrivateDisc({
                            ...privateDisc,
                            education: e.target.value,
                          })
                        }
                      >
                        <option value="eduLevel">Education Level</option>
                        {eduOptions.map((option) => (
                          <option key={option.eduLevel} value={option.eduLevel}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* <div className="form-floating">
                    <textarea
                      required
                      className="form-control"
                      id="floatingDifficulty"
                      placeholder=""
                      style={{ height: "12rem" }}
                      onChange={(e) =>
                        setPrivateDisc({
                          ...privateDisc,
                          difficulty: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="floatingDifficulty">
                      Can you explain your difficulty in understanding the
                      Subject?
                    </label>
                  </div> */}

                  <div className="input-boxx">
                    <textarea
                      className=""
                      required
                      placeholder="Can you explain your difficulty in understanding the Topic?"
                      style={{ width: "100%", height: "25vh" }}
                      id="description"
                      onChange={(e) =>
                        setPrivateDisc({
                          ...privateDisc,
                          difficulty: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="d-flex col" style={{ gap: "1rem" }}>
                    {/* <div className="form-floating">
                      <input
                        type="date"
                        className="form-control"
                        id="floatingDate"
                        placeholder="YYYY-MM-DD"
                        required
                        onChange={(e) =>
                          setPrivateDisc({
                            ...privateDisc,
                            date: e.target.value,
                          })
                        }
                      />
                      <label htmlFor="floatingDate">Date</label>
                    </div> */}

                    <div className="input-box-top">
                      <input
                        type="date"
                        className="form-control"
                        required
                        style={{ width: "100%" }}
                        id="floatingDate"
                        onChange={(e) =>
                          setPrivateDisc({
                            ...privateDisc,
                            date: e.target.value,
                          })
                        }
                      />
                      <label htmlFor="floatingDate">Date</label>
                    </div>

                    {/* <div className="form-floating">
                      <input
                        type="time"
                        className="form-control"
                        id="floatingStartTime"
                        placeholder=""
                        required
                        onChange={(e) =>
                          setPrivateDisc({
                            ...privateDisc,
                            start_time: e.target.value,
                          })
                        }
                      />
                      <label htmlFor="floatingStartTime">StartTime</label>
                    </div> */}

                    <div className="input-box-top">
                      <input
                        type="time"
                        className="form-control"
                        required
                        style={{ width: "100%" }}
                        id="floatingStartTime"
                        onChange={(e) =>
                          setPrivateDisc({
                            ...privateDisc,
                            start_time: e.target.value,
                          })
                        }
                      />
                      <label htmlFor="floatingStartTime">Start Time</label>
                    </div>

                    {/* <div className="form-floating">
                      <input
                        type="time"
                        className="form-control"
                        id="floatingEndTime"
                        placeholder=""
                        required
                        onChange={(e) =>
                          setPrivateDisc({
                            ...privateDisc,
                            end_time: e.target.value,
                          })
                        }
                      />
                      <label htmlFor="floatingEndTime">EndTime</label>
                    </div> */}

                    <div className="input-box-top">
                      <input
                        type="time"
                        className="form-control"
                        required
                        style={{ width: "100%" }}
                        id="floatingEndTime"
                        onChange={(e) =>
                          setPrivateDisc({
                            ...privateDisc,
                            end_time: e.target.value,
                          })
                        }
                      />
                      <label htmlFor="floatingEndTime">End Time</label>
                    </div>
                  </div>

                  {/* <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      id="floatingCoin"
                      placeholder=""
                      required
                      onChange={(e) =>
                        setPrivateDisc({
                          ...privateDisc,
                          coin: parseInt(e.target.value),
                        })
                      }
                    />
                    <label htmlFor="floatingCoin">Coin that you offer</label>
                  </div> */}

                  <div className="input-boxx">
                    <input
                      type="number"
                      className="form-control"
                      required
                      style={{ width: "100%" }}
                      id="floatingCoin"
                      onChange={(e) =>
                        setPrivateDisc({
                          ...privateDisc,
                          coin: parseInt(e.target.value),
                        })
                      }
                    />
                    <label htmlFor="floatingCoin">Coin that you offer</label>
                  </div>
                  <div className="submit-btn d-flex justify-content-center align-items-center">
                    <button type="submit">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          )
        : props.isOpen && (
            <div className="private-modal-overlay" onClick={props.toggle}>
              <div
                onClick={(e) => e.stopPropagation()}
                className="private-modal-box text-white"
              >
                <div className="d-flex col justify-content-between mt-3">
                  <div className="close-btn">
                    <IoIosCloseCircleOutline
                      style={{ color: "#fff", fontSize: "54px" }}
                      onClick={props.toggle}
                    />
                  </div>
                  <div
                    className="d-flex pe-4"
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      cursor: "default",
                    }}
                  >
                    <span>Request Private</span>
                  </div>
                  <div></div>
                </div>
                <div
                  style={{
                    fontSize: "21px",
                    margin: "1.5rem 0rem",
                  }}
                >
                  <img
                    className="img-fluid bg-light"
                    src={"/assets/" + props.currPrivate.user.profile_pic}
                    alt=""
                    style={{
                      height: "5vh",
                      width: "5vh",
                      borderRadius: "0.25rem",
                      marginRight: "0.5rem",
                    }}
                  />
                  {props.currPrivate.user.firstName}{" "}
                  {props.currPrivate.user.lastName}
                </div>
                <form>
                  <div className="input-box-top">
                    <input
                      disabled
                      type="text"
                      className="form-control"
                      style={{ width: "100%" }}
                      id="floatingTitle"
                      value={props.currPrivate.title}
                    />
                    <label htmlFor="floatingTitle">Topic Requested</label>
                  </div>
                  <div className="d-flex col" style={{ gap: "1rem" }}>
                    <div className="input-box-top">
                      <input
                        disabled
                        type="text"
                        className="form-control"
                        id="floatingSubject"
                        placeholder=""
                        value={props.currPrivate.subject}
                      />
                      <label htmlFor="floatingSubject">Subject</label>
                    </div>
                    <div className="input-box-top">
                      <input
                        disabled
                        type="text"
                        className="form-control"
                        id="floatingEducation"
                        placeholder=""
                        value={props.currPrivate.education}
                      />
                      <label htmlFor="floatingEducation">Education Level</label>
                    </div>
                  </div>

                  <div className="input-box-top-difficult">
                    <textarea
                      disabled
                      className="form-control"
                      id="floatingDifficulty"
                      placeholder=""
                      style={{ width: "100%", height: "25vh" }}
                      value={props.currPrivate.difficulty}
                    ></textarea>
                    <label htmlFor="floatingDifficulty">
                      Difficulty of the Topic
                    </label>
                  </div>

                  <div className="d-flex col" style={{ gap: "1rem" }}>
                    <div className="input-box-top">
                      <input
                        type="text"
                        disabled
                        className="form-control"
                        id="floatingDate"
                        placeholder="YYYY-MM-DD"
                        value={props.currPrivate.date}
                      />
                      <label htmlFor="floatingDate">Date</label>
                    </div>
                    <div className="input-box-top">
                      <input
                        type="text"
                        disabled
                        className="form-control"
                        id="floatingStartTime"
                        placeholder=""
                        value={
                          props.currPrivate.start_time +
                          " - " +
                          props.currPrivate.end_time
                        }
                      />
                      <label htmlFor="floatingStartTime">Time</label>
                    </div>
                  </div>
                  <div className="input-box-top">
                    <input
                      type="number"
                      disabled
                      className="form-control"
                      id="floatingCoin"
                      placeholder=""
                      value={props.currPrivate.coin}
                    />
                    <label htmlFor="floatingCoin">Coin Offered</label>
                  </div>
                  <div className="buttons">
                    <button
                      className="decline-btn"
                      onClick={(e) => {
                        handlePrivateReq("Rejected", e);
                        props.toggle();
                      }}
                    >
                      Decline
                    </button>
                    <button
                      className="accept-btn"
                      onClick={(e) => {
                        handlePrivateReq("Accepted", e);
                        props.toggle();
                      }}
                    >
                      Accept
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
    </>
  );
};

export default ReqPrivate;
