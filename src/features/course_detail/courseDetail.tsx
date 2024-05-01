import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import Swal from "sweetalert2";
import axios from "../../api/axios";
import {
  AccountOutput,
  StudentCourse,
  StudentCourseS,
} from "../../model/Account";
import {
  CourseList,
  JoinDiscussionSchema,
  RateCourse,
  transformToCourseOutput,
  transformToStudentCourseOutput,
} from "../../model/course/course-list";
import { ApiResponse } from "../../model/schema/base_schema";
import "./courseDetail.css";

const CourseDetail = () => {
  const { state } = useLocation();
  console.log(state, "course detail");

  const navigate = useNavigate();
  const params = useParams();

  const [studentCourse, setStudentCourse] = useState<StudentCourseS>({
    course: undefined,
    completed_chap: "",
    status: "",
    rating: 0,
  });
  const [isOpen, setisOpen] = useState(true);

  console.log(state.course?.course ? true : false);
  const account: AccountOutput = state.acc.firstName !== "" ? state.acc : null;
  const course: CourseList = state.course?.course
    ? state.course.course
    : state.data.course?.course_id
    ? transformToCourseOutput(state.data.course)
    : state.data;
  console.log(course, account);

  const JOIN_URL = "/api/account/joincourse";
  const STUDENT_COURSE_URL =
    "/api/account/course?account=" + account?.id + "&course=" + course.id;
  const RATE_URL = "/api/course/ratecourse";
  console.log(STUDENT_COURSE_URL);

  const joinCourse = async (courseId: number | undefined) => {
    console.log(account);

    if (!account) {
      navigate("/login");
    } else {
      try {
        let schema: JoinDiscussionSchema = {
          email: account?.email,
          id: courseId,
        };

        const response = await axios.post(JOIN_URL, JSON.stringify(schema), {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        });
        console.log(response, "sukses join course");
        Swal.fire({
          icon: "success",
          title: "Success Buy the Course",
          background: "#11235a",
          color: "#fff",
          confirmButtonColor: "#f6e976",
          confirmButtonText: "<span style='color:#000'> <b>OK</b> </span>",
        }).then(function () {
          navigate("/");
        });
        // navigate("/");
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error?.response?.data.errorSchema);
        }
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Cannot Buy Your Created Course",
          background: "#11235a",
          color: "#fff",
          confirmButtonColor: "#f6e976",
          confirmButtonText: "<span style='color:#000'> <b>OK</b> </span>",
        }).then(function () {
          navigate("/");
        });
      }
    }
  };

  const getStudentCourseData = async () => {
    console.log("masuk sini aaa");
    try {
      const response = await axios.get<ApiResponse<StudentCourse>>(
        STUDENT_COURSE_URL,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      console.log(response);
      setStudentCourse(
        transformToStudentCourseOutput(response.data.outputSchema)
      );
      // setCourseList(transfromToCourseListOutput(response.data.outputSchema));
      if (!studentCourse.rating === false) {
        setisOpen(false);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (
      !!account?.studentcourse_list?.find(
        (course) => course.course.course_title === params.course_title
      )
    ) {
      getStudentCourseData();
    }
  }, []);

  console.log(studentCourse);

  //draggable
  const itemsRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // for draggable
  const handleMouseDown = (e: any) => {
    setIsMouseDown(true);
    if (itemsRef.current !== null) {
      setStartX(e.pageX - itemsRef.current.offsetLeft);
      setScrollLeft(itemsRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: any) => {
    if (!isMouseDown) return;
    e.preventDefault();
    if (itemsRef.current !== null) {
      const x = e.pageX - itemsRef.current.offsetLeft;
      const walk = (x - startX) * 1;
      itemsRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };
  // end of draggable

  //Star Rating
  const [rating, setRating] = useState(0);

  const handleRating = (rate: number) => {
    console.log("masuk sini");
    setRating(rate);
    console.log(rating);
  };

  // modal
  const [comment, setComment] = useState("");

  const submitRating = async () => {
    try {
      let schema: RateCourse = {
        userid: account?.id,
        courseid: studentCourse.course?.id,
        rating: rating,
        comment: comment,
      };

      const response = await axios.post(RATE_URL, JSON.stringify(schema), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
        withCredentials: true,
      });
      console.log(response, "sukses rate course");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error?.response?.data.errorSchema);
      }
    }
    setisOpen(false);
  };

  console.log(!studentCourse.rating);
  return (
    <div
      className="container-fluid"
      style={{
        height: "100vh",
        padding: "2rem 4rem",
        backgroundImage: `url(/assets/background.png)`,
        backgroundSize: "cover",
      }}
    >
      {isOpen &&
        studentCourse.status === "Completed" &&
        !studentCourse.rating && (
          <div className="modal-overlay" onClick={() => setisOpen(false)}>
            <div
              onClick={(e) => e.stopPropagation()}
              className="modal-box text-white"
            >
              <p
                className="fw-bold d-flex justify-content-center"
                style={{ fontSize: "24px", margin: "1rem 0rem" }}
              >
                Rate & Comment
              </p>
              <p className="fw-bold" style={{ marginTop: "3rem" }}>
                Rate Your Experience
              </p>
              <Rating
                onClick={handleRating}
                allowFraction={true}
                transition={true}
                // onPointerEnter={onPointerEnter}
                // onPointerLeave={onPointerLeave}
                // onPointerMove={onPointerMove}
                /* Available Props */
              />
              <p className="fw-bold" style={{ marginTop: "3rem" }}>
                Any comment?
              </p>
              <textarea
                style={{ padding: "1rem" }}
                placeholder="How about your Experience ?"
                required
                name="comment-area"
                id="comment-area"
                cols={30}
                rows={10}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <div className="d-flex justify-content-center">
                <button
                  className="submit-btn fw-bold"
                  disabled={rating === 0 || !comment ? true : false}
                  onClick={() => submitRating()}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

      {
        // !studentCourse.course ?
        // (
        //   <div className="row">
        //     <div className="col-4">
        //       <div className="left-container d-block">
        //         <div className="mb-5">
        //           <button
        //             style={{
        //               background: "none",
        //               border: "none",
        //               color: "white",
        //               fontSize: "30px",
        //             }}
        //           >
        //             <IoCloseCircleOutline onClick={() => navigate(-1)} />
        //           </button>
        //         </div>
        //         <h2 className="fw-bold">{course.title}</h2>
        //         <h6>
        //           {course.category} - {course.level}
        //         </h6>
        //         <h6>{course.description}</h6>

        //           <button
        //             className="badge rounded-pill text-bg-danger px-5 py-2"
        //             onClick={() => joinCourse(course.id)}
        //           >
        //             {course.price}
        //           </button>
        //       </div>
        //     </div>
        //     <div className="col-8">
        //       <div className="logo_content" style={{ marginBottom: "45px" }}>
        //         <div className="logo">
        //           <div className="logo_name">
        //             <h1
        //               className="fw-bold"
        //               style={{ color: "#fff", fontSize: "35px", marginLeft: "1rem" }}
        //             >
        //               ajar
        //               <span style={{ color: "#F6ECA9" }}>in</span>
        //             </h1>
        //           </div>
        //         </div>
        //       </div>

        //       <div className="container-card-scroll p-3" ref={itemsRef}
        //         onMouseDown={handleMouseDown}
        //         onMouseLeave={handleMouseLeave}
        //         onMouseUp={handleMouseUp}
        //         onMouseMove={handleMouseMove}
        //       >
        //         <ul className="cards">
        //           {course.course_detail.map((data, index) => (
        //             <Link to={"/course/" + studentCourse.course?.title + "/" + data.course_detail_chapter} key={index} style={{ textDecoration:"none" }}
        //             state={{account:account, studentCourse:studentCourse}}
        //             >
        //               <li className="card">
        //                 <div>
        //                   <div className="" style={{ height: "30rem" }}>
        //                     <div className="text-center">
        //                       <img
        //                         className="img-fluid h-100 "
        //                         src={data.chapter_thumbnail}
        //                         alt=""
        //                       />
        //                     </div>
        //                     <div className="card-body h-50">
        //                       <div className="card-title">
        //                         Chapter {data.course_detail_chapter}
        //                       </div>
        //                       <div className="card-text" style={{ height: "3rem" }}>
        //                         {data.chapter_title}
        //                       </div>
        //                     </div>
        //                   </div>
        //                 </div>
        //               </li>
        //             </Link>
        //           ))}
        //         </ul>
        //       </div>
        //     </div>
        //   </div>
        // )
        // :

        <div className="h-100 row d-flex align-content-between">
          <div style={{ height: "8vh" }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="close-btn">
                <button
                  style={{
                    position: "relative",
                    background: "none",
                    border: "none",
                    color: "white",
                    fontSize: "50px",
                  }}
                >
                  <IoCloseCircleOutline
                    onClick={() => {
                      if (state.link !== "/") {
                        navigate(state.link, { state: state.acc });
                      } else {
                        navigate(state.link);
                      }
                    }}
                  />
                </button>
              </div>
              <div className="logo_content" style={{ cursor: "default" }}>
                <div className="logo">
                  <div className="logo_name">
                    <h1
                      className="fw-bold"
                      style={{
                        color: "#fff",
                        fontSize: "36px",
                      }}
                    >
                      ajar
                      <span style={{ color: "#F6ECA9" }}>in</span>
                    </h1>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
          <div className="row d-flex p-0 m-0 justify-content-center align-items-center">
            <div className="course-item-content col-5 text-white d-flex row">
              <h2
                className="fw-bold"
                style={{ fontSize: "48px", marginBottom: "1rem" }}
              >
                {!studentCourse.course
                  ? course.title
                  : studentCourse.course?.title}
              </h2>
              <h6 style={{ fontSize: "18px", opacity: "0.7" }}>
                {!studentCourse.course
                  ? course.category
                  : studentCourse.course?.category}{" "}
                -{" "}
                {!studentCourse.course
                  ? course.level
                  : studentCourse.course?.level}
              </h6>
              <h6 style={{ fontSize: "18px", marginTop: "1rem" }}>
                {!studentCourse.course
                  ? course.description
                  : studentCourse.course?.description}
              </h6>
              <div className="w-auto">
                {!studentCourse.status ? (
                  <button
                    className="course-detail-btn"
                    style={{
                      backgroundColor: "var(--red)",
                    }}
                    onClick={() =>
                      joinCourse(
                        !studentCourse.course
                          ? course.id
                          : studentCourse.course?.id
                      )
                    }
                  >
                    <img
                      className="img-fluid"
                      style={{
                        width: "2vw",
                        height: "2vw",
                        marginRight: "0.25rem",
                      }}
                      src={`/assets/coin.png`}
                      alt=""
                    />
                    {!studentCourse.course
                      ? course.price
                      : studentCourse.course?.price}
                  </button>
                ) : (
                  <>
                    {studentCourse.status === "Ongoing" ? (
                      <div
                        className="course-status-btn"
                        style={{
                          backgroundColor: "var(--lightblue2)",
                        }}
                      >
                        <p className="p-0 m-0 d-flex">{studentCourse.status}</p>
                      </div>
                    ) : (
                      <div
                        className="course-status-btn"
                        style={{
                          backgroundColor: "var(--yelo)",
                          color: "var(--blue)",
                        }}
                      >
                        <p className="p-0 m-0 d-flex">{studentCourse.status}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="col-7">
              <div
                className="container-card-scroll"
                ref={itemsRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              >
                <ul className="cards">
                  {!studentCourse.course
                    ? course.course_detail.map((data, index) => (
                        <
                          // to={"/login"}
                        >
                          <div className="chapter-container bg-warnin">
                            <div className="text-center chapter-pict">
                              <img
                                className="img-fluid h-100"
                                src={"/assets/" + data.chapter_thumbnail}
                                alt=""
                                style={{ borderRadius: "0.5rem" }}
                              />
                            </div>
                            <div
                              className="w-100 mt-2"
                              // style={{ height: "5rem" }}
                            >
                              <div className="chapter-index">
                                Chapter {data.course_detail_chapter}
                              </div>
                              <div
                                className="chapter-title"
                                style={{ height: "3rem" }}
                              >
                                {data.chapter_title}
                              </div>
                            </div>
                          </div>
                        </>
                      ))
                    : studentCourse.course?.course_detail.map((data, index) => (
                        <Link
                          to={
                            "/course/" +
                            studentCourse.course?.title +
                            "/" +
                            data.course_detail_chapter
                          }
                          key={index}
                          style={{ textDecoration: "none" }}
                          state={{
                            account: account,
                            studentCourse: studentCourse,
                            courseDetail: state,
                          }}
                        >
                          <div className="chapter-container bg-warnin">
                            <div className="text-center chapter-pict">
                              <img
                                className="img-fluid h-100"
                                src={"/assets/" + data.chapter_thumbnail}
                                alt=""
                                style={{ borderRadius: "0.5rem" }}
                              />
                            </div>
                            <div
                              className="w-100 mt-2"
                              // style={{ height: "5rem" }}
                            >
                              <div className="chapter-index">
                                Chapter {data.course_detail_chapter}
                              </div>
                              <div
                                className="chapter-title"
                                style={{ height: "3rem" }}
                              >
                                {data.chapter_title}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="d-flex" style={{ height: "10vh" }}>
            <div
              className="w-100 d-flex justify-content-center align-items-center"
              onClick={() =>
                navigate(
                  "/lecturer/" +
                    (state.teacher.user.fullName
                      ? state.teacher.user.fullName
                      : state.teacher.user.firstName +
                        " " +
                        state.teacher.user.lastName),
                  {
                    state: { data: state.teacher, account: account },
                  }
                )
              }
            >
              <div className="h-100">
                <div
                  className="lecturer-redirect-container d-flex align-items-center h-100"
                  style={{ width: "15vw", borderRadius: "1rem" }}
                >
                  <img
                    src={
                      // state.teacher.user?.urlImage
                      //   ? "/assets/" + state.teacher.user.urlImage
                      //   : state.acc.urlImage
                      "/assets/" + course.teacher?.user.urlImage
                    }
                    alt="abc"
                    style={{
                      width: "3vw",
                      height: "3vw",
                      margin: "0.75rem",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <p className="d-flex p-0 m-0 fw-bold">
                    {state.teacher.user.fullName
                      ? state.teacher.user.fullName
                      : state.teacher.user.firstName +
                        " " +
                        state.teacher.user.lastName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default CourseDetail;
