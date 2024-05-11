import { ChangeEvent, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import { AddCourseSchema, Course } from "../../../model/course/course-list";
import { ApiResponse } from "../../../model/schema/base_schema";
import TeacherModalAddCourseDetail from "./teacher-modal-add-course-detail";

import {
  CategoryListOutput,
  CategorySchema,
  transfromToCategoryListOutput,
} from "../../../model/category/category-model";
import "./teacher-modal-add-course.css";
import Swal from "sweetalert2";

const ADD_COURSE = "/api/course/add";
const CATEGORY_URL = "/api/category";

function TeacherModalAddCourse(props: any) {
  let image_link = "";
  const [course, setCourse] = useState<Course>({
    category: {
      category_id: "",
      category_name: "",
    },
    course_chapter: "",
    course_description: "",
    course_details: [],
    course_id: 0,
    course_image: "",
    course_level: "",
    course_price: 0,
    course_title: "",
    teacher: {
      achievement: "",
      courses: [],
      cv_data: "",
      discussion: [],
      education: "",
      experience: "",
      id: 0,
      profile_description: "",
      points: 0,
      user: {
        age: 0,
        city: "",
        coin: 0,
        country: "",
        education: "",
        email: "",
        firstName: "",
        gender: "",
        id: "",
        lastName: "",
        password: "",
        phoneNumber: "",
        school: "",
        profile_pic: ""
      },
      private_disc: [],
      teacher_rating: 0,
      course_list: []
    },
    total_sold_course: 0,
  });
  const [addCourse, setAddCourse] = useState<AddCourseSchema>({
    category: "",
    description: "",
    education_level: "",
    chapter: "",
    price: "",
    title: "",
    image_link: "",
    user_id: 0,
  });
  interface eduOption {
    eduLevel: string;
    label: string;
  }

  const navigate = useNavigate();
  const [showModalAddCourse, setShowModalAddCourse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [image, setImage] = useState<File>();
  const [selectedEdu, setSelectedEdu] = useState<string>("");
  const [categories, setCategories] = useState<CategoryListOutput>({
    categories: [],
  });

  const handleChangeSubject = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEdu(event.target.value);
    setAddCourse({ ...addCourse, category: event.target.value });
  };

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

  const eduOptions: eduOption[] = [
    { eduLevel: "General", label: "General" },
    { eduLevel: "Highschool", label: "Highschool" },
    { eduLevel: "University", label: "University" },
  ];

  const handleChangeEdu = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEdu(event.target.value);
    setAddCourse({ ...addCourse, education_level: event.target.value });
  };

  const handleAddCourseFile = () => {
    setPage(2);
  };

  const handleCloseModalAddCourse = () => setShowModalAddCourse(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files;
    console.log(file);
    if (file) {
      setImage(file[0]);
    }
  };

  const handleUploadImageToCloud = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      let imageURL;
      const imageFormData = new FormData();
      if (image) imageFormData.append("file", image);
      imageFormData.append("cloud_name", "de3swhffe");
      imageFormData.append("upload_preset", "ez9c4ucn");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/de3swhffe/image/upload",
        {
          method: "post",
          body: imageFormData,
        }
      );
      const imgData = await response.json();
      image_link = imgData.url.toString();
      await setAddCourse({ ...addCourse, image_link: imgData.url.toString() });
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // await handleUploadImageToCloud(e);
    e.preventDefault();
    let formData = new FormData();

    console.log("addcoursenya", addCourse.title);
    console.log("propsnya", props);

    // let file;

    // console.log(props.teacher);

    // // console.log(toISOLocal(addCourse.start_date));

    formData.append("title", addCourse.title);
    formData.append("category", addCourse.category);
    formData.append("education_level", addCourse.education_level);
    formData.append("description", addCourse.description);
    formData.append("chapter", addCourse.chapter);
    formData.append("price", addCourse.price);
    formData.append("image_link", image_link);
    formData.append("teacher_id", props.teacher);
    if (image) {
      formData.append("file", image);
    }
    console.log("ini form data after append", formData);

    try {
      e.preventDefault();
      const response = await axios.post<ApiResponse<Course>>(
        ADD_COURSE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      Swal.fire({
        icon: "success",
        title: "Success Add Course",
        background: "#11235a",
        color: "#fff",
        confirmButtonColor: "#f6e976",
        confirmButtonText: "<span style='color:#000'> <b>OK</b> </span>",
      }).then(function () {
        setPage(1);
        setCourse(response.data.outputSchema);
        setIsLoading(false);
        setShowModalAddCourse(true);
        props.onHide();
      });
      //   // navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setPage(1);
    setIsLoading(false);
  }, [props.onHide]);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  return (
    <>
      <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        className="h-100"
      >
        {!isLoading ? (
          <>
            <Modal.Header className="d-flex w-100" style={{ border: "none" }}>
              <div className="add-course-header container-class-header d-flex col justify-content-between mt-3">
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
                  <span>Create Course</span>
                </div>
                <div></div>
              </div>
            </Modal.Header>
            <Modal.Body
              className="add-course-body h-100"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div className="modal-body-container w-100 h-100">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                >
                  {page === 1 ? (
                    <div className="add-course-inputs ">
                      <div className="">
                        <div className="input-boxx">
                          <input
                            type="text"
                            required
                            style={{ width: "100%" }}
                            id="discussion-title"
                            onChange={(e) =>
                              setAddCourse({
                                ...addCourse,
                                title: e.target.value,
                              })
                            }
                          />
                          <label>Course Title</label>
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
                                <option
                                  key={option.eduLevel}
                                  value={option.eduLevel}
                                >
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
                            placeholder="Description"
                            style={{ width: "100%", height: "35vh" }}
                            id="description"
                            onChange={(e) =>
                              setAddCourse({
                                ...addCourse,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="d-flex col" style={{ gap: "1rem" }}>
                          <div className="input-boxx">
                            <input
                              type="number"
                              required
                              id="chapter"
                              onChange={(e) =>
                                setAddCourse({
                                  ...addCourse,
                                  chapter: e.target.value,
                                })
                              }
                            />
                            <label>Chapter</label>
                          </div>
                          <div className="input-boxx">
                            <input
                              type="number"
                              required
                              id="price"
                              onChange={(e) =>
                                setAddCourse({
                                  ...addCourse,
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
                      </div>

                      <div className="next-btn d-flex justify-content-center align-items-center">
                        <button
                          className="fw-bold"
                          onClick={() => handleAddCourseFile()}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="inputs d-flex row justify-content-center align-items-center">
                      <div className="d-flex justify-content-center">
                        {image ? (
                          <div className="text-center">
                            <img
                              className="img-fluid"
                              src={URL.createObjectURL(image)}
                              alt=""
                              style={{
                                height: "22.5vw",
                                width: "20vw",
                                objectFit: "fill",
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              height: "22.5vw",
                              width: "20vw",
                              background: "rgba(0, 0, 0, 0.2)",
                            }}
                          ></div>
                        )}
                      </div>
                      <label
                        className="mt-4 btn btn-default text-light d-flex justify-content-center w-50"
                        style={{ backgroundColor: "var(--lightblue2" }}
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
                        <button type="submit" className="submit-btn fw-bold">
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </Modal.Body>
          </>
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "60vh" }}
          >
            <svg
              width="80"
              height="80"
              stroke="#fff"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <circle
                  cx="12"
                  cy="12"
                  r="9.5"
                  fill="none"
                  stroke-width="3"
                  stroke-linecap="round"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    dur="1.5s"
                    calcMode="spline"
                    values="0 150;42 150;42 150;42 150"
                    keyTimes="0;0.475;0.95;1"
                    keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-dashoffset"
                    dur="1.5s"
                    calcMode="spline"
                    values="0;-16;-59;-59"
                    keyTimes="0;0.475;0.95;1"
                    keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                    repeatCount="indefinite"
                  />
                </circle>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  dur="2s"
                  values="0 12 12;360 12 12"
                  repeatCount="indefinite"
                />
              </g>
            </svg>
          </div>
        )}
      </Modal>
      <TeacherModalAddCourseDetail
        show={showModalAddCourse}
        onHide={handleCloseModalAddCourse}
        course={course}
      ></TeacherModalAddCourseDetail>
    </>
  );
}

export default TeacherModalAddCourse;
