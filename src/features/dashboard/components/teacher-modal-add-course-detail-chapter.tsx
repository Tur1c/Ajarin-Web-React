import { ChangeEvent, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "../../../api/axios";
import { AccountSchema } from "../../../model/Account";
import { AddCourseDetailSchema } from "../../../model/course/course-list";
import { ApiResponse } from "../../../model/schema/base_schema";
import "./teacher-modal-add-course.css";
import "./teacher-modal-add-discussion.css";

const ADD_COURSE = "/api/course/add/course/";

function TeacherModalAddCourseDetailChapter(props: any) {
  console.log(props, "chapter detail");

  const [addCourseDetail, setAddCourseDetail] = useState<AddCourseDetailSchema>(
    {
      thumbnail: "",
      video: "",
      title: "",
      pdf: "",
    }
  );
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [image, setImage] = useState<File>();
  const [video, setVideo] = useState<File>();
  const [pdf, setPdf] = useState<File>();

  let imageUrl = "";
  let pdfUrl = "";
  let videoUrl = "";

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files;
    console.log(file);
    if (file) {
      setImage(file[0]);
    }
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files;
    console.log(file);
    if (file) {
      setVideo(file[0]);
    }
  };

  const handlePdfChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files;
    console.log(file);
    if (file) {
      setPdf(file[0]);
    }
  };

  // const handleUploadImageToCloud = async (
  //   e: React.FormEvent<HTMLFormElement>
  // ) => {
  //   e.preventDefault();
  //   try {
  //     const imageFormData = new FormData();
  //     if (image) imageFormData.append("file", image);
  //     imageFormData.append("cloud_name", "de3swhffe");
  //     imageFormData.append("upload_preset", "ez9c4ucn");

  //     const response = await fetch(
  //       "https://api.cloudinary.com/v1_1/de3swhffe/image/upload",
  //       {
  //         method: "post",
  //         body: imageFormData,
  //       }
  //     );
  //     const imgData = await response.json();
  //     imageUrl = imgData.url.toString();
  //     await setAddCourseDetail({
  //       ...addCourseDetail,
  //       thumbnail: imgData.url.toString(),
  //     });
  //   } catch {}
  // };

  // const handleUploadPdfToCloud = async (
  //   e: React.FormEvent<HTMLFormElement>
  // ) => {
  //   e.preventDefault();
  //   try {
  //     let imageURL;
  //     const pdfData = new FormData();
  //     if (pdf) pdfData.append("file", pdf);
  //     pdfData.append("cloud_name", "de3swhffe");
  //     pdfData.append("upload_preset", "ez9c4ucn");

  //     const response = await fetch(
  //       "https://api.cloudinary.com/v1_1/de3swhffe/auto/upload",
  //       {
  //         method: "post",
  //         body: pdfData,
  //       }
  //     );
  //     const data = await response.json();
  //     pdfUrl = data.url.toString();
  //     await setAddCourseDetail({
  //       ...addCourseDetail,
  //       pdf: data.url.toString(),
  //     });
  //   } catch {}
  // };

  // const handleUploadVideoToCloud = async (
  //   e: React.FormEvent<HTMLFormElement>
  // ) => {
  //   e.preventDefault();
  //   try {
  //     const videoData = new FormData();
  //     if (video) videoData.append("file", video);
  //     videoData.append("cloud_name", "de3swhffe");
  //     videoData.append("upload_preset", "ez9c4ucn");

  //     const response = await fetch(
  //       "https://api.cloudinary.com/v1_1/de3swhffe/video/upload",
  //       {
  //         method: "post",
  //         body: videoData,
  //       }
  //     );
  //     const data = await response.json();
  //     videoUrl = data.url.toString();
  //     await setAddCourseDetail({
  //       ...addCourseDetail,
  //       video: data.url.toString(),
  //     });
  //   } catch {}
  // };

  const submitCourseDetail = async (e: React.FormEvent<HTMLFormElement>) => {
    // await handleUploadImageToCloud(e);
    // await handleUploadPdfToCloud(e);
    // await handleUploadVideoToCloud(e);
    e.preventDefault();
    console.log("haciu");
    let formData = new FormData();

    // console.log(image,video,pdf);

    formData.append("chapter", props.chapter);
    formData.append("title", addCourseDetail.title);
    if (image) {
      formData.append("thumbnail", image);
      formData.append("thumbnail", image);
    }
    if (video) {
      formData.append("video", video);
    }
    if (pdf) {
      formData.append("pdf", pdf);
    }

    console.log(formData);

    try {
      e.preventDefault();
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

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success add chapter " + props.chapter,
          background: "#11235a",
          color: "#fff",
          confirmButtonColor: "#f6e976",
          confirmButtonText: "<span style='color:#000'> <b>OK</b> </span>",
        }).then(function () {
          props.onHide(e);
        });
      }
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
      key={props.chapter}
    >
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
            <span>Chapter Detail</span>
          </div>
          <div></div>
        </div>
      </Modal.Header>
      <Modal.Body
        className="w-100 chapter-detail-container"
        key={props.chapter}
      >
        <div className="modal-body-container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitCourseDetail(e);
            }}
          >
            <div className="" style={{ width: "100%" }}>
              <div className="input-boxx" style={{ marginBottom: "1rem" }}>
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

              <div
                className="d-flex justify-content-between"
                style={{ gap: "1rem" }}
              >
                <div
                  className="d-flex row  justify-content-center"
                  style={{ width: "50%" }}
                >
                  {image ? (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(image)}
                        alt=""
                        style={{ height: "25rem", width: "22.5rem" }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: "25rem",
                        width: "22.5rem",
                        background: "rgba(0, 0, 0, 0.2)",
                        objectFit: "fill",
                        borderRadius: "0.25rem",
                      }}
                    ></div>
                  )}
                  <label className="btn btn-default text-light d-flex justify-content-center w-50 fw-bold upload-thumbnail-chapter">
                    <input
                      className="inputfile"
                      required
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    Upload Chapter Thumbnail
                  </label>
                </div>

                <div className="pdf-and-video" style={{ width: "50%" }}>
                  <div
                    className="upload-chapter-btn"
                    style={{ marginBottom: "1rem" }}
                  >
                    <input
                      type="file"
                      required
                      id="cv"
                      onChange={handleVideoChange}
                      accept="video/*"
                    />
                    <label>Upload Course Video ( * )</label>
                  </div>

                  <div className="upload-chapter-btn">
                    <input
                      type="file"
                      id="cv"
                      onChange={handlePdfChange}
                      accept="application/pdf"
                    />
                    <label>Upload Course Material (PDF)</label>
                  </div>
                </div>
              </div>

              <div
                className="d-flex justify-content-center"
                style={{ marginTop: "4rem" }}
              >
                <button type="submit" className="fw-bold submit-btn">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TeacherModalAddCourseDetailChapter;
