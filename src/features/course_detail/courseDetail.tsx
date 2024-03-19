import { AxiosError } from "axios";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router";
import axios from "../../api/axios";
import { AccountOutput } from "../../model/Account";
import {
  CourseList,
  JoinDiscussionSchema,
} from "../../model/course/course-list";
import "./courseDetail.css";

const CourseDetail = () => {
  const { state } = useLocation();
  console.log(state, "course detail");

  const navigate = useNavigate();

  const course: CourseList = state.data;
  const account: AccountOutput = state.acc;
  console.log(account);

  const JOIN_URL = "/api/account/joincourse";

  const joinCourse = async (courseId: number) => {
    // !account ? navigate("/login")
    // :
    if (!account) {
      navigate("/login");
    } else {
      try {
        let schema: JoinDiscussionSchema = {
          email: account?.email,
          id: courseId,
        };
        console.log(schema, "schema");

        const response = await axios.post(JOIN_URL, JSON.stringify(schema), {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        });
        console.log(response, "sukses join course");
        navigate("/");
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error?.response?.data.errorSchema);
        }
      }
    }
  };

  return (
    <div className="container-fluid p-5" style={{ height: "100vh", marginTop: "5%" }}>
      {/* {course.title} */}

      <div className="row">
        <div className="col-4">
          <div className="left-container d-block">
            <div className="mb-5">
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "30px",
                }}
              >
                <IoCloseCircleOutline onClick={() => navigate(-1)} />
              </button>
            </div>
            <h2 className="fw-bold">{course.title}</h2>
            <h6>
              {course.category} - {course.level}
            </h6>
            <h6>{course.description}</h6>
            <button
              className="badge rounded-pill text-bg-danger px-5 py-2"
              onClick={() => joinCourse(course.id)}
            >
              {course.price}
            </button>
          </div>
        </div>
        <div className="col-8">
          <div className="logo_content" style={{ marginBottom: "45px" }}>
            <div className="logo">
              <div className="logo_name">
                <h1
                  className="fw-bold"
                  style={{ color: "#fff", fontSize: "35px", marginLeft: "1rem" }}
                >
                  ajar
                  <span style={{ color: "#F6ECA9" }}>in</span>
                </h1>
              </div>
            </div>
          </div>
          <div className="container-card-scroll">
            <ul className="cards">
              {course.course_detail.map((data, index) => (
                <li className="card" key={index}>
                  <div>
                    <div className="" style={{ height: "30rem" }}>
                      <div className="text-center">
                        <img
                          className="img-fluid h-100 "
                          src={data.chapter_thumbnail}
                          alt=""
                        />
                      </div>
                      <div className="card-body h-50">
                        <div className="card-title">
                          Chapter {data.course_detail_chapter}
                        </div>
                        <div className="card-text" style={{ height: "3rem" }}>
                          {data.chapter_title}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
