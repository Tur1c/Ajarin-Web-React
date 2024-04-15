import { ChangeEvent, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { AddCourseDetailSchema } from "../../../model/course/course-list";
import TeacherModalAddCourseDetailChapter from "./teacher-modal-add-course-detail-chapter";
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

  const handleCloseModalAddCourseChapter = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowModalAddCourseChapter(false);
    setSubmitChapter(submitChapter + 1);
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
    const listCourses = [];
    for (
      let index = 0;
      index < parseInt(props.course.course_chapter);
      index++
    ) {
      listCourses.push(
        <button
          className="mt-3"
          key={index+1}
          onClick={(e) => {
            e.preventDefault();
            setChapter(index + 1);
            setShowModalAddCourseChapter(true);
          }}
        >
          Add Course Chapter {index + 1}
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
              <span>Add Course Detail</span>
            </div>
            <div></div>
          </div>
        </Modal.Header>
        <Modal.Body className="p-5">
          <div className="modal-body-container d-flex flex-column">
            {renderListAddCourse()}
          </div>
        </Modal.Body>
        <Modal.Footer className="p-0">
          {submitChapter == parseInt(props.course.course_chapter) ? (
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
              <button onClick={props.onHide} className="text-white">
                Finish add course detail
              </button>
            </div>
          ) : (
            ""
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
