import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import {
    BiSolidChevronLeftSquare,
    BiSolidChevronRightSquare,
} from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { StudentCourse, StudentDisc } from "../../model/Account";
import { getMonth } from "../../model/calendar/calendar-detail";
import "./Calendar.css";
import { Sidebar } from "../../shared";
import { IoSearch } from "react-icons/io5";
import { ClassList, CourseList } from "../../model/course/course-list";

const Calendar = () => {
  const { state } = useLocation();
  console.log(state);

  const userRole = sessionStorage.getItem("role");

  const formatDate = "YYYY-MM-DD";

  const [currMonthIdx, setCurrMonthIdx] = useState(state.discDate ? dayjs(state.discDate).month() : dayjs().month());
  const [currMonthCalendar, setCurrMonthCalendar] = useState(getMonth());
  const [selectedDate, setSelectedDate] = useState( state.discDate ? dayjs(state.discDate).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"));

  const account = state.discDate || state.teacher ? state.account : state;
  const accountDisc: StudentDisc[] =  account.studentdisc_list;
  const accountCourse: StudentCourse[] = account.studentcourse_list;
  
  // Teacher
  const teacher = state.teacher? state.teacher : null;
  const teacherDisc: ClassList[] = teacher? teacher.discussion : null;
  const teacherCourse: CourseList[] = teacher? teacher.courses : null;

  console.log(accountCourse,accountDisc,userRole);
  console.log(teacher, teacherDisc, teacherCourse);

  //draggable
  const itemsRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Get Disc Data by Selected Date
  const getDiscData = (date:any) => {
    console.log(date, "aaaaaa");
    const discData = accountDisc.filter(
        (x) => dayjs(x.discussion.disc_date.toString()).format(formatDate) === date
        )
        .sort((x,y) => (x.discussion.disc_starttime.toString().localeCompare(y.discussion.disc_starttime.toString())));

        console.log(discData, "dapet broh");
        if(discData){
            return discData;
        }
        return null;
    }

    const getTeacherDiscData = (date:any) => {
      console.log("masuk sini",teacherDisc,date, dayjs(teacherDisc[0].date.toString()).format(formatDate));
      const discData = teacherDisc.filter (
        (x) => dayjs(x.date.toString()).format(formatDate) === date
          )
          .sort((x,y) => (x.starttime.toString().localeCompare(y.endtime.toString())));

          console.log(discData);
          if(discData){
            return discData;
        }
        return null;
    }
  
const [disc, setDisc] = useState(getDiscData( state.discDate ? dayjs(state.discDate).format(formatDate) : dayjs().format(formatDate)));
const [currTeacherDisc, setCurrTeacherDisc] = useState(teacher? getTeacherDiscData( state.discDate ? dayjs(state.discDate).format(formatDate) : dayjs().format(formatDate)) : null);

  useEffect(() => {
    setCurrMonthCalendar(getMonth(currMonthIdx));
  }, [currMonthIdx]);

  const setMonth = (x: number) => {
      setCurrMonthIdx(currMonthIdx + x);
  };

  // yang bukan bulan ini
  const currDateMonth = (day: any) => {
    const currDayMonth = day.month();

    if (currMonthIdx%12 !== currDayMonth) {
      return "text-body-tertiary";
    }
    return "";
  };

  const findDateonDisc = (date:any) => {
    if(teacher)
    return teacherDisc.some(
      (x) => dayjs(x.date).format(formatDate) === date
    );

    return accountDisc.some(
        (x) => dayjs(x.discussion.disc_date).format(formatDate) === date
    )
  };

  const changeSelectedDate = (day: any) => {
    console.log(day);
    setSelectedDate(day);
    if(teacher){
      setCurrTeacherDisc(getTeacherDiscData(day));
    }
    else{
      setDisc(getDiscData(day));
    }
  };

  const studentDiscDate = (day: any) => {
    const date = day.format(formatDate);
    let findDate = findDateonDisc(date);
    if (findDate) {
      return "bg-dark text-white rounded-3";
    }
    return "";
  };

  // for draggable
  const handleMouseDown = (e:any) => {
    setIsMouseDown(true);
    if(itemsRef.current !== null) {
      setStartX(e.pageX - itemsRef.current.offsetLeft);
      setScrollLeft(itemsRef.current.scrollLeft);
    }
  }

  const handleMouseLeave = (e:any) => {
    setIsMouseDown(false);
  }

  const handleMouseMove = (e:any) => {
    if(!isMouseDown) return;
    e.preventDefault();
    if(itemsRef.current !== null){
      const x = e.pageX - itemsRef.current.offsetLeft;
      const walk = (x-startX)*1;
      itemsRef.current.scrollLeft = scrollLeft - walk;
    }
  }

  const handleMouseUp = (e:any) => {
    setIsMouseDown(false);
  }


  return (
    <>
      <div className="container-fluid ms-5" style={{ height: "100vh" }}>
        <div className="row align-items-center h-100">
        <div className="sidebar-content">
        {userRole === "Teacher" ? 
          <Sidebar teacheracc={teacher} account={account}></Sidebar>
          :
          <Sidebar account={account}></Sidebar>
        }
        </div>
        <div className="disc-course-content col-10">
          <div className="disc-calendar d-flex ">
            <div className="mt-3 col-4 h-75 border-end bg-white text-dark rounded align-items-center">
              <header className="d-flex justify-content-between">
                <p className="text-gray-500 font-bold">
                  {dayjs(new Date(dayjs().year(), currMonthIdx)).format(
                    "MMMM YYYY"
                  )}
                </p>
                <div className="button-container">
                  <button
                    onClick={() => setMonth(-1)}
                    className="calendar-prevbutton"
                  >
                    <BiSolidChevronLeftSquare style={{ fontSize: "24px" }} />
                  </button>
                  <button
                    onClick={() => setMonth(1)}
                    className="calendar-nextbutton"
                  >
                    <BiSolidChevronRightSquare style={{ fontSize: "24px" }} />
                  </button>
                </div>
              </header>
              <div className="calendar-container">
                <div className="row mb-3">
                  {currMonthCalendar[0].map((day, idx) => (
                    <div className="col text-center" key={idx}>
                      <span className="text-sm py-1 text-center">
                        {day.format("ddd")}
                      </span>
                    </div>
                  ))}
                </div>
                {currMonthCalendar.map((row, idx) => (
                  <div key={idx} className="row mb-3">
                    {row.map((day, idx) => (
                      <button
                        key={idx}
                        className="col date-column"
                      >
                        {/* <span className={`text-sm p-2 ${getCurrDate(day)} ${currDateMonth(day)}`}>{day.format("D")}</span> */}
                        <span
                          className={
                            "date-span text-sm p-2 w-100" +
                            (day.format(formatDate) === selectedDate
                              ? " bg-primary-subtle text-white rounded-3 "
                              : " ") +
                            currDateMonth(day) +
                            studentDiscDate(day)
                          }
                          onClick={() =>
                            changeSelectedDate(day.format(formatDate))
                          }
                        >
                          {day.format("D")}
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* !disc?.length ?  */}
            <div className="container mt-3 col-6 h-75 bg-white text-dark rounded" style={{ marginLeft:0 }}>
              {!!teacher? !currTeacherDisc?.length ? 
                  ( <p>No Discussion</p> )
                  :
                  (
                      <>
                      
                      <div className="disc-container d-flex">
                          {currTeacherDisc.map( (data, idx) => (
                              <div className="card mt-5 ms-5" key={idx} style={{width: "45%",height:"23rem",padding:0}}>
                                  <img className="card-image-top w-100 h-75 disc-image" src={ data.image? `assets/${data.image}` : "assets/private.png"} alt=""/>
                                  <div className="participant-total">{data.participant}/{data.maxPeople}</div>
      
                                  <div className="card-body disc-body rounded">
                                      <h5 className="card-text d-flex h-100">
                                          <div className="disc-date col-3 text-center my-auto border-end border-white" >
                                              <h2 style={{ margin:0 }}>{dayjs(data.date).format("DD")}</h2>
                                              <h5>{dayjs(data.date).format("MMM")}</h5>
                                          </div>
                                          <div className="disc-title my-auto col-6 d-flex justify-content-center">
                                              <h6 className=""style={{ margin:0 }}>{data.title} <br />by Godwin</h6>
                                          </div>
                                          <div className="disc-time col-3 text-center my-auto border-start border-white " style={{ height:"70px" }}>
                                              <h6 className="d-flex align-items-center justify-content-center" style={{ height:"100%" }}>
                                                  {data.starttime.toString()}-{data.endtime.toString()}
                                              </h6>
                                          </div>
                                      </h5>
                                  </div>
                              </div>
                              ))
                          }

                      </div>
                      
                      
                      </>
                  )
                  :
                  !disc?.length ?
                  (( <p>No Discussion</p> ))
                  :
                  (
                    <div className="disc-container d-flex">
                          {disc.map( (data, idx) => (
                              <div className="card mt-5 ms-5" key={idx} style={{width: "45%",height:"23rem",padding:0}}>
                                  <img className="card-image-top w-100 h-75 disc-image" src={ data.discussion.disc_image? `assets/${data.discussion.disc_image}` : "assets/private.png"} alt=""/>
                                  <div className="participant-total">{data.discussion.joinedParticipant}/{data.discussion.disc_participant}</div>
      
                                  <div className="card-body disc-body rounded">
                                      <h5 className="card-text d-flex h-100">
                                          <div className="disc-date col-3 text-center my-auto border-end border-white" >
                                              <h2 style={{ margin:0 }}>{dayjs(data.discussion.disc_date).format("DD")}</h2>
                                              <h5>{dayjs(data.discussion.disc_date).format("MMM")}</h5>
                                          </div>
                                          <div className="disc-title my-auto col-6 d-flex justify-content-center">
                                              <h6 className=""style={{ margin:0 }}>{data.discussion.disc_title} <br />by Godwin</h6>
                                          </div>
                                          <div className="disc-time col-3 text-center my-auto border-start border-white " style={{ height:"70px" }}>
                                              <h6 className="d-flex align-items-center justify-content-center" style={{ height:"100%" }}>
                                                  {data.discussion.disc_starttime.toString()}-{data.discussion.disc_endtime.toString()}
                                              </h6>
                                          </div>
                                      </h5>
                                  </div>
                              </div>
                              ))
                          }
                      </div>
                  )
                      
              }   
            </div>
          </div>
            
            <div className="my-course">
              <h3>My Course</h3>
              <div className="search-course-calendar d-flex">
                  <div className="search-left ms-3">
                              <input
                                type="search"
                                name=""
                                id="search-input"
                                placeholder="Search"
                                style={{ width: "100%" }}
                              />
                  </div>
                  <div className="search-right p-3">
                    <button className="search-button" id="search">
                      <IoSearch
                        color="#6E6E6E"
                        fontSize={"24"}
                      />
                    </button>
                  </div>
              </div>

              <div className="account-course-content p-5" ref={itemsRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              >
                  {teacher?
                    (
                      teacherCourse.map( (data,idx) => (
                          <div className="account-course-card card text-decoration-none"  style={{width: "18rem", height:"20rem"}}>
                          <img src={`assets/${data.image}`} className="card-img-top w-100 h-75" alt="" />
                          <div className="card-body">
                            <div className="accountcourse-lecturer d-flex">
                              <img src={teacher.account.urlImage || `assets/default_picture.png`} alt="" style={{ width:"40px" }}/>
                              <p>{teacher.firstName} {teacher.lastName}</p>
                            </div>
                            <p className="card-text">{data.title}</p>
    
                            <div className="accountcourse-category d-flex">
                              <span className="badge rounded-pill border border-black text-dark p-2">{data.level}</span>
                              <span className="badge rounded-pill border border-black text-dark p-2">{data.category}</span>
                            </div>
                          </div>
                          </div>
                      )
                      )
                    )
                  :
                  accountCourse.map( (data,idx) => (
                    <Link to={"/course/" + data.course.course_title} key={idx} state={{data:data, acc:account}} style={{ textDecoration:"none" }}>
                      <div className="account-course-card card text-decoration-none"  style={{width: "18rem", height:"20rem"}}>
                      <img src={`assets/${data.course.course_image}`} className="card-img-top w-100 h-75" alt="" />
                      <div className="card-body">
                        <div className="accountcourse-lecturer d-flex">
                          <img src={data.course.teacher.user.pic_url} alt="" style={{ width:"40px" }}/>
                          <p>{data.course.teacher.user.firstName} {data.course.teacher.user.lastName}</p>
                        </div>
                        <p className="card-text">{data.course.course_title}</p>

                        <div className="accountcourse-category d-flex">
                          <span className="badge rounded-pill border border-black text-dark p-2">{data.course.course_level}</span>
                          <span className="badge rounded-pill border border-black text-dark p-2">{data.course.category.category_name}</span>
                        </div>
                      </div>
                      </div>

                    </Link>
                  ))}
              </div>
            </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
