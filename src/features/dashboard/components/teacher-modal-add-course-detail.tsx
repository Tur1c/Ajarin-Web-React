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
    }
  );
  const [chapter, setChapter] = useState(0);
  const navigate = useNavigate();
  const [showModalAddCourseChapter, setShowModalAddCourseChapter] =
    useState(false);
  const [page, setPage] = useState(1);
  const [image, setImage] = useState<File>();

  const handleCloseModalAddCourseChapter = () =>
    setShowModalAddCourseChapter(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files;
    console.log(file);
    if (file) {
      setImage(file[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formData = new FormData();
    let file;

    // console.log(toISOLocal(addCourseDetail.start_date));

    // formData.append("title", addCourseDetail.title);
    // formData.append("category", addCourseDetail.category);
    // formData.append("education_level", addCourseDetail.education_level);
    // formData.append("description", addCourseDetail.description);
    // formData.append("start_date", toISOLocal(addCourseDetail.start_date));
    // formData.append("end_date", toISOLocal(addCourseDetail.end_date));
    // formData.append("max_participant", addCourseDetail.max_participant);
    // formData.append("price", addCourseDetail.price);
    // formData.append("link", addCourseDetail.link);
    formData.append("user_id", "1");
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

    // try {
    //   const response = await axios.post<ApiResponse<AccountSchema>>(
    //     ADD_DISCUSSION,
    //     formData,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //         Authorization: "Bearer " + sessionStorage.getItem("jwt"),
    //       },
    //       withCredentials: true,
    //     }
    //   );
    //   setPage(1);
    //   setSelectedStartDate(null);
    //   setSelectedEndDate(null);
    //   navigate("/");
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const renderListAddCourse = () => {
    const listCourses = [];
    for (
      let index = 0;
      index < parseInt(props.course.course_chapter);
      index++
    ) {
      listCourses.push(
        <button className="mt-3"
          onClick={(e) => {
            setChapter(index+1);
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
          <div className="modal-body-container d-flex flex-column">{renderListAddCourse()}</div>
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
