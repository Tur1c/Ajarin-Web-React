import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { StudentCourse } from '../../model/Account';

const LecturerRating = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const course_list:StudentCourse[] = state.state.data.course_list;
    console.log(course_list);
  return (
    <div className='container-fluid m-5' style={{ width:"95%" }}>
        <div className="mb-5 d-flex border-bottom">
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "50px",
                  marginLeft: "5rem"
                }}
              >
                <IoCloseCircleOutline onClick={() => navigate(-1)} />
              </button>
              <h3 className='mt-4 ms-5 text-white align-middle text-center'>Rating ( {state.state.data.course_list.length} )</h3>
        </div>

        {course_list.map((data,idx) => (
            <div className='py-4 px-5' key={idx} style={{ color:"white",backgroundColor:"rgba(255,255,255,0.5)",margin:"0 6rem 0 6rem",borderRadius:"2rem" }}>
                <div className="user-profile d-flex">
                    <img src={"/assets/" + data.account?.profile_pic} alt="" style={{ width:"1.5cm",height:"1.5cm", objectFit:"cover" }} className='rounded img-fluid'/>
                    <span>{data.account?.firstName} {data.account?.lastName}</span>

                </div>
                {/* <p style={{ color:"white" }}>{data.comment}</p> */}
                <div className="comment-rating mt-4">
                    <span className='mt-4'>{data.comment.toString()}</span>
                    <div className="rounded-pill border border-light p-2 mt-2" style={{ width:"3cm", backgroundColor:"#596FB7" }}>
                        <FaStar
                        style={{
                            color: "green",
                            fontSize: "25px",
                            marginRight: "5px",
                        }}
                        />{" "}
                        {data.rating}
                    </div>

                </div>
            </div>
        ))}
        <div>lecturerRating</div>
    </div>
  )
}

export default LecturerRating;