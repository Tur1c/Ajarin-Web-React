import { ChangeEvent, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "../../../api/axios";
import { AccountSchema } from "../../../model/Account";
import {
  CategoryListOutput,
  CategorySchema,
  transfromToCategoryListOutput,
} from "../../../model/category/category-model";
import { AddDiscussionSchema } from "../../../model/course/course-list";
import { ApiResponse } from "../../../model/schema/base_schema";
import "./teacher-modal-add-discussion.css";

const ADD_DISCUSSION = "/api/discussion/add";
const CATEGORY_URL = "/api/category";

function TeacherModalAddDiscussion(props: any) {
  const [addDiscussion, setAddDiscussion] = useState<AddDiscussionSchema>({
    category: "",
    description: "",
    education_level: "",
    end_date: new Date(),
    link: "",
    max_participant: "",
    price: "",
    start_date: new Date(),
    title: "",
    teacher_id: 0,
  });
  const navigate = useNavigate();
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [image, setImage] = useState<File>();

  const [selectedEdu, setSelectedEdu] = useState<string>("");

  const handleChangeSubject = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEdu(event.target.value);
    setAddDiscussion({ ...addDiscussion, category: event.target.value });
  };

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

  interface eduOption {
    eduLevel: string;
    label: string;
  }

  const eduOptions: eduOption[] = [
    { eduLevel: "General", label: "General" },
    { eduLevel: "Highschool", label: "Highschool" },
    { eduLevel: "University", label: "University" },
  ];

  const handleChangeEdu = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEdu(event.target.value);
    setAddDiscussion({ ...addDiscussion, education_level: event.target.value });
  };

  const handleStartDateChange = (date: any) => {
    setSelectedStartDate(date);
    setAddDiscussion({
      ...addDiscussion,
      start_date: date,
    });
  };

  const handleEndDateChange = (date: any) => {
    setSelectedEndDate(date);
    setAddDiscussion({
      ...addDiscussion,
      end_date: date,
    });
  };

  const handleAddDiscussionFile = () => {
    setPage(2);
    addDiscussion.link = "";
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files;
    console.log(file);
    if (file) {
      setImage(file[0]);
    }
  };

  function toISOLocal(d: Date) {
    const Y = d.getFullYear();
    const m = d.getMonth() + 1;
    const D = d.getDate();
    const H = d.getHours();
    const M = d.getMinutes();

    const s = Y + "-" + m + "-" + D + "T" + H + ":" + M;
    return s;
  }

  const handleSubmit = async (e: any, teacher: any) => {
    e.preventDefault();
    let formData = new FormData();
    let file;
    console.log(teacher);

    console.log(toISOLocal(addDiscussion.start_date));

    formData.append("title", addDiscussion.title);
    formData.append("category", addDiscussion.category);
    formData.append("education_level", addDiscussion.education_level);
    formData.append("description", addDiscussion.description);
    formData.append("start_date", toISOLocal(addDiscussion.start_date));
    formData.append("end_date", toISOLocal(addDiscussion.end_date));
    formData.append("max_participant", addDiscussion.max_participant);
    formData.append("price", addDiscussion.price);
    formData.append("link", addDiscussion.link);
    formData.append("teacher_id", teacher);
    if (image) {
      formData.append("file", image);
    }

    // try {
    //   let imageURL;
    //   const imageFormData = new FormData();
    //   if(image) imageFormData.append("file", image);
    //   imageFormData.append("cloud_name", "de3swhffe");
    //   imageFormData.append("upload_preset", "ez9c4ucn");

    //   const response = await fetch(
    //     "https://api.cloudinary.com/v1_1/de3swhffe/image/upload",
    //     {
    //       method: "post",
    //       body: imageFormData
    //     }
    //   );
    //   const imgData = await response.json();
    //   alert(imgData.url.toString());
    // } catch {

    // }

    try {
      const response = await axios.post<ApiResponse<AccountSchema>>(
        ADD_DISCUSSION,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      if (response.data.errorSchema.message === "Success") {
        Swal.fire({
          icon: "success",
          title: "Success Set Discussion",
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
          title: "Error Created Discussion",
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

  useEffect(() => {
    fetchCategoryData();
  }, []);

  useEffect(() => {
    setPage(1);
    setImage(undefined);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  }, [props.onHide]);

  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="d-flex w-100" style={{ border: "none" }}>
        <div
          className="container-class-header d-flex col justify-content-between mt-3"
          style={{ height: "2rem" }}
        >
          <div className="close-btn">
            <IoIosCloseCircleOutline
              style={{ color: "#fff", fontSize: "54px" }}
              onClick={props.onHide}
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
            <span>Set Discussion</span>
          </div>
          <div></div>
        </div>
      </Modal.Header>
      <Modal.Body
        className="h-100"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginTop: "1rem",
        }}
      >
        <div className="modal-body-container w-100 h-100">
          <form onSubmit={(e) => handleSubmit(e, props.teacher)}>
            {page === 1 ? (
              <div className="inputs">
                <div className="input-boxx">
                  <input
                    type="text"
                    required
                    style={{ width: "100%" }}
                    id="discussion-title"
                    value={addDiscussion.title}
                    onChange={(e) =>
                      setAddDiscussion({
                        ...addDiscussion,
                        title: e.target.value,
                      })
                    }
                  />
                  <label>Discussion Title</label>
                </div>

                <div className="d-flex col" style={{ gap: "1rem" }}>
                  <div className="input-boxx">
                    <select required onChange={handleChangeSubject}>
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
                      value={selectedEdu}
                      onChange={handleChangeEdu}
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

                <div className="input-boxx">
                  <textarea
                    className=""
                    required
                    style={{ width: "100%", height: "25vh" }}
                    placeholder="Description"
                    id="description"
                    onChange={(e) =>
                      setAddDiscussion({
                        ...addDiscussion,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="d-flex col" style={{ gap: "1rem" }}>
                  <div className="input-boxx">
                    <DatePicker
                      selected={selectedStartDate}
                      placeholderText="Start Date"
                      onChange={handleStartDateChange}
                      showTimeSelect
                      dateFormat="yyyy-MM-dd hh:mm a"
                    ></DatePicker>
                  </div>
                  <div className="input-boxx">
                    {/* <input type="text" required id="end-date" /> */}
                    <DatePicker
                      selected={selectedEndDate}
                      placeholderText="End Date"
                      onChange={handleEndDateChange}
                      showTimeSelect
                      dateFormat="yyyy-MM-dd hh:mm a"
                    ></DatePicker>
                  </div>
                </div>

                <div className="d-flex col" style={{ gap: "1rem" }}>
                  <div className="input-boxx">
                    <input
                      type="number"
                      required
                      id="max-participant"
                      onChange={(e) =>
                        setAddDiscussion({
                          ...addDiscussion,
                          max_participant: e.target.value,
                        })
                      }
                    />
                    <label>Max Participant</label>
                  </div>
                  <div className="input-boxx">
                    <input
                      type="number"
                      required
                      id="price"
                      onChange={(e) =>
                        setAddDiscussion({
                          ...addDiscussion,
                          price: e.target.value,
                        })
                      }
                    />
                    <label>
                      <img
                        className="img-fluid"
                        style={{
                          width: "24px",
                          height: "24px",
                          marginRight: "0.25rem",
                        }}
                        src={`assets/coin.png`}
                        alt=""
                      />
                      Coin Price
                    </label>
                  </div>
                </div>

                <div className="next-btn d-flex justify-content-center align-items-center">
                  <button
                    className="fw-bold"
                    onClick={() => handleAddDiscussionFile()}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="inputs d-flex row justify-content-center align-items-center">
                <div className="input-boxx" style={{ marginBottom: "1rem" }}>
                  <input
                    type="text"
                    required
                    style={{ width: "100%" }}
                    id="url"
                    value={addDiscussion.link}
                    onChange={(e) =>
                      setAddDiscussion({
                        ...addDiscussion,
                        link: e.target.value,
                      })
                    }
                  />
                  <label>Discussion Meeting Link</label>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  {image ? (
                    <div className="text-center">
                      <img
                        className="img-fluid"
                        src={URL.createObjectURL(image)}
                        alt=""
                        style={{
                          height: "20rem",
                          aspectRatio: "16 / 9",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: "20rem",
                        background: "rgba(0, 0, 0, 0.2)",
                        aspectRatio: "16 / 9",
                      }}
                    ></div>
                  )}
                </div>
                <label
                  className="btn btn-default text-light d-flex justify-content-center w-50 fw-bold"
                  style={{
                    backgroundColor: "var(--lightblue2)",
                    marginTop: "1rem",
                  }}
                >
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="inputfile"
                  />
                  Upload Thumbnail
                </label>

                <div className="buttons">
                  <button
                    type="submit"
                    className="back-btn fw-bold"
                    onClick={() => {
                      setPage(1);
                    }}
                  >
                    Back
                  </button>
                  <button type="submit" className="submit-btn fw-bold mt-0">
                    Set
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default TeacherModalAddDiscussion;
