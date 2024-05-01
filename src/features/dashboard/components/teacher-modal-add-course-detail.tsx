import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { AddCourseDetailSchema } from "../../../model/course/course-list";
import TeacherModalAddCourseDetailChapter from "./teacher-modal-add-course-detail-chapter";
import "./teacher-modal-add-course.css";
import "./teacher-modal-add-discussion.css";

const ADD_DISCUSSION = "/api/discussion/add";

function TeacherModalAddCourseDetail(props: any) {
  console.log(props, "props di add course detail");

  const [addCourseDetail, setAddCourseDetail] = useState<AddCourseDetailSchema>(
    {
      thumbnail: "",
      video: "",
      title: "",
      pdf: "",
    }
  );
  const [chapter, setChapter] = useState(0);
  const navigate = useNavigate();
  const [showModalAddCourseChapter, setShowModalAddCourseChapter] =
    useState(false);
  const [page, setPage] = useState(1);
  const [image, setImage] = useState<File>();
  const [submitChapter, setSubmitChapter] = useState(0);

  const handleCloseModalAddCourseChapter = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setShowModalAddCourseChapter(false);
    setSubmitChapter(submitChapter + 1);
    console.log(submitChapter);
  };

  // const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const file = event.currentTarget.files;
  //   console.log(file);
  //   if (file) {
  //     setImage(file[0]);
  //   }
  // };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   let formData = new FormData();
  //   let file;

  //   formData.append("user_id", "1");
  //   if (image) {
  //     formData.append("file", image);
  //   }

  // };

  const renderListAddCourse = () => {
    console.log("props detail", props);
    console.log("submitchap", submitChapter);
    const listCourses = [];
    for (
      let index = 0;
      index < parseInt(props.course.course_chapter);
      index++
    ) {
      listCourses.push(
        <button
          className="add-course-content-btn"
          key={index + 1}
          onClick={(e) => {
            e.preventDefault();
            setChapter(index + 1);
            setShowModalAddCourseChapter(true);
          }}
        >
          Add Chapter {index + 1} Detail
        </button>
      );
    }
    return listCourses;
  };

  useEffect(() => {
    setPage(1);
  }, [props.onHide]);

  return (
    <>
      <Modal
        {...props}
        size="xl"
        backdrop="static"
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
              <span>Fill Course Detail</span>
            </div>
            <div></div>
          </div>
        </Modal.Header>
        <Modal.Body className="add-course-list-container w-100">
          <div className="list-container">{renderListAddCourse()}</div>
        </Modal.Body>
        <Modal.Footer className="d-flex w-100">
          {submitChapter === parseInt(props.course.course_chapter) ? (
            <div
              className="modal-footer-center"
              style={{
                fontSize: "20px",
                width: "100%",
                height: "4rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button onClick={props.onHide} className="finish-btn fw-bold">
                Finish
              </button>
            </div>
          ) : (
            <div style={{ height: "4rem" }}></div>
          )}
        </Modal.Footer>
      </Modal>
      <TeacherModalAddCourseDetailChapter
        show={showModalAddCourseChapter}
        onHide={handleCloseModalAddCourseChapter}
        course={props.course}
        chapter={chapter}
      ></TeacherModalAddCourseDetailChapter>
    </>
  );
}

export default TeacherModalAddCourseDetail;
