import { Link } from "react-router-dom";
import { AccountOutput } from "../../model/Account";
import { CourseList } from "../../model/course/course-list";
import { TeacherOutput } from "../../model/teacher/teacher-model";
import "./lecturerCourse.css";

interface ModalType {
  isOpen: boolean;
  toggle: () => void;
  data: CourseList[] | undefined;
  acc: AccountOutput | undefined;
  teacher: TeacherOutput | undefined;
}

const LecturerCourse = (props: ModalType) => {
  console.log(props.data);
  return (
    <>
      {props.isOpen && (
        <div className="course-private-modal-overlay" onClick={props.toggle}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="course-private-modal-box text-white d-flex row"
            style={{ overflowY: "scroll" }}
          >
            <p
              className="text-center fw-bold"
              style={{ fontSize: "28px", margin: "2rem 0rem" }}
            >
              Lecturer's Course List
            </p>
            <div
              className="d-flex row justify-content-center flex-wrap"
              style={{ marginLeft: "0rem" }}
            >
              {props.data
                ? props.data.map((course, idx) => (
                    //     <li
                    //     className="card"
                    //     key={idx}
                    //     style={{ width: "20rem", height: "28rem" }}
                    // >
                    //     <div className="text-center thumbnail container-class-header">
                    //     <img
                    //         className="img-fluid"
                    //         src={`/assets/${course.image}`}
                    //         alt=""
                    //         style={{width: "20rem"}}
                    //     />
                    //     </div>
                    //     <div className="card-body h-50 mt-5">
                    //     <div className="card-title">
                    //         {course.title}
                    //     </div>
                    //     <div
                    //         className="card-text"
                    //         style={{ height: "3rem" }}
                    //     >
                    //         {course.sold} Purchased
                    //     </div>
                    //     </div>
                    // </li>
                    <div
                      className="card me-3 mt-4 "
                      key={idx}
                      style={{
                        width: "20rem",
                        height: "30rem",
                        padding: 0,
                        border: "none",
                      }}
                    >
                      <img
                        src={"/assets/" + course.image}
                        className="card-img-to w-100 bg-dark"
                        alt="..."
                        style={{ height: "20rem", objectFit: "fill" }}
                      />
                      <div className="card-bodyy d-flex flex-wrap">
                        <Link
                          to={"/course/" + course.title}
                          state={{
                            data: course,
                            acc: props.acc,
                            teacher: props.teacher,
                          }}
                          style={{ textDecoration: "none" }}
                        >
                          <div className="d-block p-2">
                            <div className="title-class mt-2 mb-2">
                              <h3
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "bold",
                                }}
                              >
                                {course.title}
                              </h3>
                            </div>
                            <div className="gap-2 d-flex">
                                <span className="pill ">{course.category}</span>
                            <span className="pill ">{course.level}</span>
                            </div>
                            
                          </div>
                        </Link>
                      </div>
                    </div>
                    //     <div className="card" style={{ border: "none" }}>
                    //     <Link to={"/course/" + course.title} state={{ course }}>
                    //       <div className="container-class-header">
                    //         <div className="class-thumbnail">
                    //           <img
                    //             className="class-image img-fluid"
                    //             src={`assets/${course.image}`}
                    //             alt=""
                    //           />
                    //         </div>

                    //         <div className="top-left">
                    //           <img
                    //             className="img-fluid"
                    //             src={`assets/coin.png`}
                    //             alt=""
                    //             style={{ height: "14px" }}
                    //           />
                    //           <span style={{ marginLeft: "5px" }}>
                    //             {course.price}
                    //           </span>
                    //         </div>
                    //         <div className="top-right">{course.chapter} chapter</div>
                    //       </div>

                    //     <div className="card-body p-2">
                    //       <div className="card-text">
                    //         <div className="class-content">
                    //           <div className="class">
                    //             <div className="d-block">
                    //               <div
                    //                 className=""
                    //                 style={{
                    //                   display: "flex",
                    //                   alignItems: "center",
                    //                 }}
                    //               >
                    //                 <img
                    //                   src={ !course.teacher?.account.urlImage? "assets/default_picture.png" : "assets/"+course.teacher.account.urlImage}
                    //                   alt="abc"
                    //                   className="me-2"
                    //                   width={"50px"}
                    //                 />
                    //                 <span
                    //                   style={{
                    //                     color: "#000",
                    //                     alignItems: "center",
                    //                   }}
                    //                 >
                    //                   {course.teacher?.account.fullName}
                    //                 </span>
                    //               </div>
                    //               <div className="d-block p-1">
                    //                 <div className="title-class mb-2">
                    //                   <h3 style={{ color: "#000" }}>
                    //                     {course.title}
                    //                   </h3>
                    //                 </div>
                    //                 <span
                    //                   className="badge badge-outlined me-2"
                    //                   style={{
                    //                     borderColor: "#000",
                    //                     backgroundColor: "#fff",
                    //                     color: "#000",
                    //                     borderRadius: "15px",
                    //                   }}
                    //                 >
                    //                   {course.category}
                    //                 </span>
                    //                 <span
                    //                   className="badge badge-outlined me-2"
                    //                   style={{
                    //                     borderColor: "#000",
                    //                     backgroundColor: "#fff",
                    //                     color: "#000",
                    //                     borderRadius: "15px",
                    //                   }}
                    //                 >
                    //                   {course.level}
                    //                 </span>
                    //               </div>
                    //             </div>
                    //           </div>
                    //         </div>
                    //       </div>
                    //     </div>
                    //     </Link>
                    //   </div>
                  ))
                : ""}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LecturerCourse;
