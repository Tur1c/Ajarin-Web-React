import { FaStar } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { StudentCourse } from "../../model/Account";

import "./lecturerRating.css";

const LecturerRating = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const course_list: StudentCourse[] = state.state.data.course_list;
  console.log(course_list);
  return (
    <div className="bg-profile">
      <div className="rating-container">
        <div className=" d-flex justify-content-center">
          <div
            className="d-flex border-bottom align-items-center"
            style={{ marginBottom: "2rem", width: "90%" }}
          >
            <button
              className="close"
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "50px",
                marginRight: "2rem",
              }}
            >
              <IoCloseCircleOutline onClick={() => navigate(-1)} />
            </button>
            <h3
              className="m-0 fw-bold p-0 text-white"
              style={{ fontSize: "32px" }}
            >
              Ratings ( {state.state.data.course_list.length} )
            </h3>
          </div>
        </div>
        <div className="d-flex row justify-content-center" style={{cursor:"default"}}>
          {course_list.map((data, idx) => (
            <div
              className=""
              key={idx}
              style={{
                color: "white",
                backgroundColor: "rgba(255,255,255,0.2)",
                width: "90%",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                padding: "1rem 2rem",
                minHeight: "12rem",
              }}
            >
              <div className="user-profile d-flex">
                <img
                  src={"/assets/" + data.account?.profile_pic}
                  alt=""
                  style={{
                    width: "4rem",
                    height: "4rem",
                    objectFit: "cover",
                  }}
                  className=" img-fluid"
                />
                <span style={{ fontSize: "21px", fontWeight: "bold" }}>
                  {data.account?.firstName} {data.account?.lastName}
                </span>
              </div>
              {/* <p style={{ color:"white" }}>{data.comment}</p> */}
              <div className="comment-rating">
                <div className="" style={{ margin: "1rem 0rem" }}>
                  {data.comment.toString()}
                </div>
                <div
                  className="d-flex justify-content-center"
                  style={{
                    width: "8rem",
                    backgroundColor: "var(--lightblue)",
                    padding: "0.25rem 0rem",
                    borderRadius: "1rem",
                  }}
                >
                  <FaStar
                    style={{
                      color: "yellow",
                      fontSize: "24px",
                      marginRight: "4px",
                    }}
                  />{" "}
                  <p className="p-0 m-0 fw-bold">{data.rating}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LecturerRating;
