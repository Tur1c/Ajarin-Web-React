import { ChangeEvent, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import { AddCourseSchema, Course } from "../../../model/course/course-list";
import { ApiResponse } from "../../../model/schema/base_schema";
import TeacherModalAddCourseDetail from "./teacher-modal-add-course-detail";

const ADD_COURSE = "/api/course/add";

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
      rating: "",
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
        pic_name: "",
        pic_type: "",
        pic_url: "",
      },
      private_disc: [],
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
  const navigate = useNavigate();
  const [showModalAddCourse, setShowModalAddCourse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [image, setImage] = useState<File>();

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
    await handleUploadImageToCloud(e);
    e.preventDefault();
    let formData = new FormData();
    let file;

    // console.log(toISOLocal(addCourse.start_date));

    formData.append("title", addCourse.title);
    formData.append("category", addCourse.category);
    formData.append("education_level", addCourse.education_level);
    formData.append("description", addCourse.description);
    formData.append("chapter", addCourse.chapter);
    formData.append("price", addCourse.price);
    formData.append("image_link", image_link);
    formData.append("user_id", "1");
    if (image) {
      formData.append("file", image);
    }

    try {
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
      setPage(1);
      // navigate("/");
      setIsLoading(false);
      setCourse(response.data.outputSchema);
      setShowModalAddCourse(true);
      props.onHide();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setPage(1);
    setIsLoading(false);
  }, [props.onHide]);

  return (
    <>
      <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
      >
        {!isLoading ? (
          <>
            <Modal.Header className="p-0 d-block">
              <div
                className="container-class-header d-flex justify-content-around mt-3"
                style={{ height: "2rem" }}
              >
                <div>
                  <IoIosCloseCircleOutline
                    style={{ color: "#fff", fontSize: "54px" }}
                    onClick={props.onHide}
                  />
                </div>
                <div style={{ fontSize: "30px" }}>
                  <span>Create Course</span>
                </div>
                <div></div>
              </div>
            </Modal.Header>
            <Modal.Body className="p-5">
              <div className="modal-body-container">
                <form onSubmit={handleSubmit}>
                  {page === 1 ? (
                    <div className="inputs" style={{ width: "100%" }}>
                      <div className="">
                        <div
                          className="input-box"
                          style={{ marginBottom: "0.5rem" }}
                        >
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
                          <label>Discussion Title</label>
                        </div>
                        <div
                          className="input-box"
                          style={{ marginBottom: "0.5rem" }}
                        >
                          <input
                            type="text"
                            required
                            style={{ width: "100%" }}
                            id="subject"
                            onChange={(e) =>
                              setAddCourse({
                                ...addCourse,
                                category: e.target.value,
                              })
                            }
                          />
                          <label>Subject</label>
                        </div>

                        <div
                          className="input-box"
                          style={{ marginBottom: "0.5rem" }}
                        >
                          <input
                            type="text"
                            required
                            style={{ width: "100%" }}
                            id="education-level"
                            onChange={(e) =>
                              setAddCourse({
                                ...addCourse,
                                education_level: e.target.value,
                              })
                            }
                          />
                          <label>Education Level</label>
                        </div>

                        <div className="input-box">
                          <textarea
                            className=""
                            required
                            style={{ width: "100%" }}
                            id="description"
                            onChange={(e) =>
                              setAddCourse({
                                ...addCourse,
                                description: e.target.value,
                              })
                            }
                          />
                          <label>Description</label>
                        </div>
                        <div className="input-box">
                          <input
                            type="text"
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
                        <div className="input-box">
                          <input
                            type="text"
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
                                width: "36px",
                                height: "36px",
                              }}
                              src={`assets/coin.png`}
                              alt=""
                            />
                            Coin Price
                          </label>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <button
                          className="fw-bold"
                          onClick={() => handleAddCourseFile()}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="inputs" style={{ width: "100%" }}>
                      <div className="">
                        {image ? (
                          <div className="text-center">
                            <img
                              className="img-fluid mb-4"
                              src={URL.createObjectURL(image)}
                              alt=""
                              style={{ height: "20rem" }}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              height: "20rem",
                              background: "rgba(0, 0, 0, 0.2)",
                            }}
                          ></div>
                        )}
                      </div>
                      <label className="btn btn-default">
                        <input
                          type="file"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </label>
                      <div className="d-flex justify-content-between align-items-center mt-5">
                        <button
                          type="submit"
                          className="fw-bold"
                          onClick={() => {
                            setPage(1);
                          }}
                        >
                          Back
                        </button>
                        <button type="submit" className="fw-bold">
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </Modal.Body>
            <Modal.Footer className="p-0">
              <div
                className="modal-footer-center"
                style={{
                  backgroundColor: "#11235a",
                  fontSize: "20px",
                  width: "100%",
                  height: "75px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p onClick={props.onHide} className="text-white"></p>
              </div>
            </Modal.Footer>
          </>
        ) : (
          <div className="loader-wrapper">
            <span className="loader">
              <span className="loader-inner"></span>
            </span>
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
