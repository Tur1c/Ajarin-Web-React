import React from 'react'
import { useLocation, useNavigate } from 'react-router'
import { CourseList, CourseListOutput, JoinDiscussionSchema } from '../../model/course/course-list';
import { IoCloseCircleOutline } from "react-icons/io5";
import { AccountOutput } from '../../model/Account';
import axios from '../../api/axios';
import { AxiosError } from 'axios';

const CourseDetail = () => {

    const {state} = useLocation();
    console.log(state);

    const navigate = useNavigate();

    const course:CourseList = state.data;
    const account:AccountOutput = state.acc;
    console.log(account);

    const JOIN_URL = "/api/account/joincourse";

    const joinCourse = async (courseId:number) => {
      // !account ? navigate("/login")
      // :
      if(!account){
        navigate("/login")
      }
      else{
        try{
              let schema: JoinDiscussionSchema = {
                email: account?.email,
                id: courseId,
              };
              console.log(schema,"schema");
  
          const response = await axios.post(
            JOIN_URL, 
            JSON.stringify(schema), 
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("jwt"),
              },
            withCredentials: true,
            });
            console.log(response, "sukses join course"); 
          } catch (error) {
            if (error instanceof AxiosError) {
              console.log(error?.response?.data.errorSchema);
            }
          };
      }
    }

  return (
    <div className='container-fluid w-100'>
      {/* {course.title} */}

      <div className="d-flex flex-column">
          <div className="top-container d-flex justify-content-between">
              <button style={{ background:"none",border:"none",color:"white",fontSize:"30px" }}><IoCloseCircleOutline /></button>
              <h1 className="fw-bold" style={{ color: "#fff", fontSize: "32px" }}>
                  ajar<span style={{ color: "#F6ECA9" }}>in</span>
              </h1>
          </div>

          <div className="content-container d-flex">
            <div className="left-content col-3">
              <h2 className='fw-bold'>{course.title}</h2>
              <h6>{course.category} - {course.level}</h6>
              <h6>{course.description}</h6>
              <button className='badge rounded-pill text-bg-danger px-5 py-2' onClick={ () => joinCourse(course.id)}>{course.price}</button>
            </div>

            <div className="right-content col-9 d-flex">
                {course.course_detail.map( (data, idx) => (
                  <div className="card" key={idx} style={{ width:"18rem" }}>
                      <img className="card-image-top h-100" src={`/assets/${course.image}`} alt=""/>
                      <div className="card-body h-50">
                        <div className="card-title">Chapter {data.course_detail_chapter}</div>
                        <div className="card-text" style={{ height:"3rem" }}>{data.chapter_title}</div>
                      </div>
                  </div>
                ))}
            </div>

          </div>
      </div>
    </div>
  )
}

export default CourseDetail