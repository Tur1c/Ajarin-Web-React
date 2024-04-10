import React, { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CompleteChapter, CourseDetailOutput } from '../../model/course/course-list';
import axios from '../../api/axios';
import { AxiosError } from 'axios';
import { AccountOutput } from '../../model/Account';

const CourseChapter = () => {
    const state = useLocation();
    const navigate = useNavigate();
    console.log(state);
    // status + completed chap
    const [completed,setCompleted] = useState(state.state.studentCourse.completed_chap === null? "" : state.state.studentCourse.completed_chap);
    const params = useParams();
    const completed_chapters = completed?.split("|");

    const currChapFinished = completed_chapters.includes(params.course_chapter? params.course_chapter : "0");

    // console.log(params.course_chapter);
    
    
    console.log(completed_chapters, completed, currChapFinished, completed_chapters.includes(params.course_chapter? params.course_chapter : "0"));
    

    const chapterDetail:CourseDetailOutput[] = state.state.studentCourse.course.course_detail;
    const account: AccountOutput = state.state.account;
    let userid:number;
    if(account.id !== undefined){
        userid = parseInt(account.id);
    }
    console.log(chapterDetail);
    
    const currDetail:CourseDetailOutput = chapterDetail.find( (course) => course.course_detail_chapter === parseInt(params.course_chapter!))!;
    console.log(currDetail);

    const COMPLETE_URL = "/api/course/complete";


    const handleComplete = async () => {
        let string;
        if(completed === ""){
           string = currDetail.course_detail_chapter.toString();
        }
        else{
            string = completed + "|" + currDetail.course_detail_chapter.toString();
        }


        try {
            let schema: CompleteChapter = {
                userid: userid,
                courseid:state.state.studentCourse.course.id,
                completed:string,
                total_chap: parseInt(state.state.studentCourse.course.chapter)
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
            if(response.data.errorSchema.message === "Course Completed"){
                navigate("/course/" + params.course_title, {
                    state: {
                        acc: account,
                        course: state.state.studentCourse
                    }
                });
            }

        } catch (error){
            if (error instanceof AxiosError) {
                console.log(error?.response?.data.errorSchema);
              };
        }
    }

  return (
    <div>
        courseChapter
        <video controls src={`/video/${currDetail.chapter_video}`}></video>

{/* back */}
        {
            currDetail.course_detail_chapter !== 1 ? 
            (
                <Link to={"/course/" + params.course_title + "/" + (currDetail.course_detail_chapter - 1)} style={{ textDecoration:"none" }} state={{account:account, studentCourse:state.state.studentCourse}}>
                <button>back</button>
                </Link>
            )
            :
            null
        }
{/* next */}
        {
            currDetail.course_detail_chapter !== parseInt(state.state.studentCourse.course.chapter) ?
            (
                <Link to={"/course/" + params.course_title + "/" + (currDetail.course_detail_chapter + 1)} style={{ textDecoration:"none" }} state={{account:account, studentCourse:state.state.studentCourse}}>
                    <button>next</button>
                </Link>
            )
            :
            null
        }

{/* mark as completed */}
        {
            currChapFinished === true ?
            (<p>completed</p>)
            :
            (
                <button onClick={() => handleComplete()}>mark as completed</button>
            )

        }
    </div>
  )
}

export default CourseChapter