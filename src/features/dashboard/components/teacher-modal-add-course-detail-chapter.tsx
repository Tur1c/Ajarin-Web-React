import { ChangeEvent, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import { AccountSchema } from "../../../model/Account";
import { AddCourseDetailSchema } from "../../../model/course/course-list";
import { ApiResponse } from "../../../model/schema/base_schema";
import "./teacher-modal-add-discussion.css";

const ADD_COURSE = "/api/course/add/course/";

function TeacherModalAddCourseDetailChapter(props: any) {
console.log(props, "chapter detail");

  const [addCourseDetail, setAddCourseDetail] = useState<AddCourseDetailSchema>(
    {
      thumbnail: "",
      video: "",
      title: "",
    }
  );
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [image, setImage] = useState<File>();


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
      await setAddCourseDetail({ ...addCourseDetail, thumbnail: imgData.url.toString() });
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await handleUploadImageToCloud(e);
    e.preventDefault();
    let formData = new FormData();
    let file;

    formData.append("chapter", props.chapter);
    formData.append("title", addCourseDetail.title);
    formData.append("video", "godwin_meme.mp4");
    if (image) {
      formData.append("thumbnail", addCourseDetail.thumbnail);
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
        ADD_COURSE + props.course.course_id,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      props.onHide();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setImage(undefined);
  }, [props.onHide]);

  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
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
            <span>Set Discussion</span>
          </div>
          <div></div>
        </div>
      </Modal.Header>
      <Modal.Body className="p-5">
        <div className="modal-body-container">
          <form onSubmit={handleSubmit}>
            <div className="inputs" style={{ width: "100%" }}>
              <div className="">
                <div className="input-box" style={{ marginBottom: "0.5rem" }}>
                  <input
                    type="text"
                    required
                    style={{ width: "100%" }}
                    id="course-title"
                    onChange={(e) =>
                      setAddCourseDetail({
                        ...addCourseDetail,
                        title: e.target.value,
                      })
                    }
                  />
                  <label>Course Title</label>
                </div>
              </div>

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
                    props.onHide();
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
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
    </Modal>
  );
}

export default TeacherModalAddCourseDetailChapter;
