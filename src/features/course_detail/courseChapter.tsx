import { AxiosError } from "axios";
import { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import { AccountOutput } from "../../model/Account";
import {
  CompleteChapter,
  CourseDetailOutput,
} from "../../model/course/course-list";

import "./courseDetail.css";

const CourseChapter = () => {
  const state = useLocation();
  const navigate = useNavigate();
  console.log(state, "state detail");
  // status + completed chap
  const [completed, setCompleted] = useState(
    state.state.studentCourse.completed_chap === null
      ? ""
      : state.state.studentCourse.completed_chap
  );
  const params = useParams();
  const completed_chapters = completed?.split("|");

  const currChapFinished = completed_chapters.includes(
    params.course_chapter ? params.course_chapter : "0"
  );

  // console.log(params.course_chapter);

  console.log(
    completed_chapters,
    completed,
    currChapFinished,
    completed_chapters.includes(
      params.course_chapter ? params.course_chapter : "0"
    )
  );

  const chapterDetail: CourseDetailOutput[] =
    state.state.studentCourse.course.course_detail;
  const account: AccountOutput = state.state.account;
  let userid: number;
  if (account.id !== undefined) {
    userid = parseInt(account.id);
  }
  console.log(chapterDetail);

  const currDetail: CourseDetailOutput = chapterDetail.find(
    (course) =>
      course.course_detail_chapter === parseInt(params.course_chapter!)
  )!;
  console.log(currDetail);

  const COMPLETE_URL = "/api/course/complete";

  const handleComplete = async () => {
    let string;
    if (completed === "") {
      string = currDetail.course_detail_chapter.toString();
    } else {
      string = completed + "|" + currDetail.course_detail_chapter.toString();
    }

    try {
      let schema: CompleteChapter = {
        userid: userid,
        courseid: state.state.studentCourse.course.id,
        completed: string,
        total_chap: parseInt(state.state.studentCourse.course.chapter),
      };
      console.log(schema);
      const response = await axios.post(COMPLETE_URL, JSON.stringify(schema), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
        withCredentials: true,
      });
      setCompleted(string);
      console.log(response);
      if (response.data.errorSchema.message === "Course Completed") {
        navigate("/course/" + params.course_title, {
          state: {
            acc: account,
            course: state.state.studentCourse,
            teacher: state.state.studentCourse.course.teacher,
            link: "/calendar"
          },
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error?.response?.data.errorSchema);
      }
    }
  };

  return (
    <div
      className="container-fluid course-chapter-container"
      style={{
        height: "100vh",
        padding: "2rem 4rem",
        backgroundImage: `url(/assets/background.png)`,
        backgroundSize: "cover",
      }}
    >
      <div className="d-flex justify-content-between align-items-center text-white">
        <Link
          to={"/course/" + state.state.studentCourse.course.title}
          state={state.state.courseDetail}
        >
          <div className="close-btn">
            <button
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "50px",
              }}
            >
              <IoCloseCircleOutline />
            </button>
          </div>
        </Link>
        <div style={{ fontSize: "24px" }}>
          Chapter {currDetail.course_detail_chapter} :
          <b> {currDetail.chapter_title}</b>
        </div>

        <div></div>
      </div>
      <div className="justify-content-center d-flex" style={{ height: "75%" }}>
        <video
          controls
          controlsList="nodownload"
          src={`/video/${currDetail.chapter_video}`}
          style={{ borderRadius: "0.25rem" }}
        ></video>
      </div>
      <div className="d-flex row">
        {currDetail.chapter_pdf ? (
          <div className="pdf-download-container">
            <div className="download-box">
              <p>Additional Material</p>
              <a
                href={"/assets/" + currDetail.chapter_pdf}
                download="PDF"
                style={{ textDecoration: "none" }}
              >
                Download <b>[{currDetail.chapter_pdf}]</b>
              </a>
            </div>
          </div>
        ) : (
          ""
        )}

        <div>
          {/* mark as completed */}
          {currChapFinished === true ? (
            <div className="pdf-download-container">
              <div className="complete-btn">Completed</div>
            </div>
          ) : (
            <div className="pdf-download-container">
              <button
                className="mark-complete-btn"
                onClick={() => handleComplete()}
              >
                Mark as Completed
              </button>
            </div>
          )}

          <div className="w-100 d-flex justify-content-center">
            <div className="buttons">
              {/* back */}
              {currDetail.course_detail_chapter !== 1 ? (
                <Link
                  to={
                    "/course/" +
                    params.course_title +
                    "/" +
                    (currDetail.course_detail_chapter - 1)
                  }
                  style={{ textDecoration: "none" }}
                  state={{
                    account: account,
                    studentCourse: state.state.studentCourse,
                    courseDetail: state.state.courseDetail,
                  }}
                >
                  <button className="back-btn">Back</button>
                </Link>
              ) : null}
              {/* next */}
              {currDetail.course_detail_chapter !==
              parseInt(state.state.studentCourse.course.chapter) ? (
                <Link
                  to={
                    "/course/" +
                    params.course_title +
                    "/" +
                    (currDetail.course_detail_chapter + 1)
                  }
                  style={{ textDecoration: "none" }}
                  state={{
                    account: account,
                    studentCourse: state.state.studentCourse,
                    courseDetail: state.state.courseDetail,
                  }}
                >
                  <button className="next-btn">Next</button>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseChapter;
