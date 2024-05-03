import dayjs from "dayjs";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useRef, useState } from "react";
import {
  BiSolidChevronLeftSquare,
  BiSolidChevronRightSquare,
} from "react-icons/bi";
import Swal from 'sweetalert2'
import { IoSearch } from "react-icons/io5";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { StudentCourse, StudentDisc } from "../../model/Account";
import { getMonth } from "../../model/calendar/calendar-detail";
import { ClassList, CourseList } from "../../model/course/course-list";
import axios from "../../api/axios";
import Carousel from 'react-bootstrap/Carousel';
// import ExampleCarouselImage from 'components/ExampleCarouselImage';
import { Sidebar } from "../../shared";
import "./Calendar.css";
import { GrPrevious, GrNext } from "react-icons/gr";
import { BsChevronLeft } from "react-icons/bs";

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

const Calendar = () => {
  const { state } = useLocation();
  console.log(state);

  const userRole = sessionStorage.getItem("role");
  const isLogged = sessionStorage.getItem("jwt");

  const formatDate = "YYYY-MM-DD";
  const navigate = useNavigate();

  
  const [searchText, setSearchText] = useState("");
  const [currMonthIdx, setCurrMonthIdx] = useState(
    state.discDate ? dayjs(state.discDate).month() : dayjs().month()
  );
  const [currMonthCalendar, setCurrMonthCalendar] = useState(getMonth());
  const [selectedDate, setSelectedDate] = useState(
    state.discDate
      ? dayjs(state.discDate).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChangeAccount, setIsLoadingChangeAccount] = useState(false);

  const account =
    state.discDate || state.teacher
      ? state.account
      : state.account
      ? state.account
      : state;
  const [accountDisc,setAccountDisc] =  useState<StudentDisc[]>(account.studentdisc_list);
  const [accountCourse, setAccountCourse] = useState(account.studentcourse_list);
  // const accountCourse: StudentCourse[] = account.studentcourse_list;
  const accountCourseTemp: StudentCourse[] = account.studentcourse_list;

  let CANCEL_URL = "/api/discussion/cancelDisc?account=" + account.id + "&disc=";
  // Teacher
  const teacher = state.teacher ? state.teacher : null;
  const teacherDisc: ClassList[] = teacher ? teacher.discussion : null;
  const [teacherCourse, setTeacherCourse] = useState(teacher ? teacher.courses : null);
  // const teacherCourse: CourseList[] = teacher ? teacher.courses : null;
  const teacherCourseTemp: CourseList[] = teacher ? teacher.courses : null;

  console.log(accountCourse,accountDisc,userRole,account);
  console.log(teacher, teacherDisc, teacherCourse);

  //draggable
  const itemsRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Get Disc Data by Selected Date
  const getDiscData = (date: any) => {
    console.log(date, "aaaaaa");
    const discData = accountDisc
      .filter(
        (x) =>
          dayjs(x.discussion.disc_date.toString()).format(formatDate) === date
      )
      .sort((x, y) =>
        x.discussion.disc_starttime
          .toString()
          .localeCompare(y.discussion.disc_starttime.toString())
      );

    console.log(discData, "dapet broh");
    if (discData) {
      return discData;
    }
    return null;
  };

  const getTeacherDiscData = (date: any) => {
    // console.log(
    //   "masuk sini",
    //   teacherDisc,
    //   date,
    //   dayjs(teacherDisc[0].date.toString()).format(formatDate)
    // );
    const discData = teacherDisc
      .filter((x) => dayjs(x.date.toString()).format(formatDate) === date)
      .sort((x, y) =>
        x.starttime.toString().localeCompare(y.endtime.toString())
      );

    console.log(discData);
    if (discData) {
      return discData;
    }
    return null;
  };

  const [disc, setDisc] = useState(
    getDiscData(
      state.discDate
        ? dayjs(state.discDate).format(formatDate)
        : dayjs().format(formatDate)
    )
  );

  console.log(
    "tshoot",
    teacher,
    state.discDate,
    dayjs(state.discDate).format(formatDate),
    dayjs().format(formatDate)
  );

  const [currTeacherDisc, setCurrTeacherDisc] = useState(
    teacher
      ? getTeacherDiscData(
          state.discDate
            ? dayjs(state.discDate).format(formatDate)
            : dayjs().format(formatDate)
        )
      : null
  );

  useEffect(() => {
    setCurrMonthCalendar(getMonth(currMonthIdx));
  }, [currMonthIdx]);

  useEffect(() => {
    setIsLoading(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const setMonth = (x: number) => {
    setCurrMonthIdx(currMonthIdx + x);
  };

  // yang bukan bulan ini
  const currDateMonth = (day: any) => {
    const currDayMonth = day.month();

    if (currMonthIdx % 12 !== currDayMonth) {
      return "text-body-tertiary";
    }
    return "";
  };

  const findDateonDisc = (date: any) => {
    if (teacher)
      return teacherDisc.some((x) => dayjs(x.date).format(formatDate) === date);

    return accountDisc.some(
      (x) => dayjs(x.discussion.disc_date).format(formatDate) === date
    );
  };

  const changeSelectedDate = (day: any) => {
    console.log(day);
    setSelectedDate(day);
    if (teacher) {
      setCurrTeacherDisc(getTeacherDiscData(day));
    } else {
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

  const cancelDisc = (id:number) => {
    Swal.fire({
      title: "Do you want to cancel joining the discussion?",
      icon: "warning",
      background: "#11235a",
      color: "#fff",
      confirmButtonText: "<span style='color:#000'> <b>Delete</b> </span>",
      confirmButtonColor: "#f6e976",
      cancelButtonColor: "#fff",
      cancelButtonText: "<span style='color:#000'> No </span>",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        CANCEL_URL = CANCEL_URL + id;
        console.log(CANCEL_URL);
        try {
          const response = await axios.get(
            CANCEL_URL,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + isLogged,
              },
              withCredentials: true,
            }
          );
            console.log(response);
            navigate("/");
            // if(disc){
              // setDisc(disc?.filter((x) => x.discussion.disc_id != id));
              // setAccountDisc(accountDisc.filter((x) => x.discussion.disc_id != id));
            // }
        } catch (error) {}
      }
    });
  }

  // for draggable
  const handleMouseDown = (e: any) => {
    setIsMouseDown(true);
    if (itemsRef.current !== null) {
      setStartX(e.pageX - itemsRef.current.offsetLeft);
      setScrollLeft(itemsRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = (e: any) => {
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

  const handleMouseUp = (e: any) => {
    setIsMouseDown(false);
  };

  const handleSearch = () => {
    
    if(userRole === "Teacher") {
      const findCourse = teacherCourseTemp.filter((u) => u.title.toLowerCase().includes(searchText));
      setTeacherCourse(findCourse); 
    } else {
      const findCourse = accountCourseTemp.filter((u) => u.course.course_title.toLowerCase().includes(searchText));
      setAccountCourse(findCourse);
    }
  }

  const handleLoadingTrue = () => setIsLoadingChangeAccount(true);
  const handleLoadingFalse = () => setIsLoadingChangeAccount(false);

  console.log(accountDisc.at(0)?.discussion.disc_date.toString() + " " + accountDisc.at(0)?.discussion.disc_starttime.toString());
  console.log(currTeacherDisc,dayjs(accountDisc.at(0)?.discussion.disc_date), dayjs(accountDisc.at(0)?.discussion.disc_date.toString() + " " + accountDisc.at(0)?.discussion.disc_starttime.toString()));
  
  console.log(accountDisc.at(6));
  console.log(dayjs(accountDisc.at(6)?.discussion.disc_date.toString().substring(0,10) + " " + accountDisc.at(6)?.discussion.disc_endtime.toString()).add(1,'day').diff(dayjs(), 'minutes'),
  dayjs(accountDisc.at(6)?.discussion.disc_date.toString().substring(0,10) + " " + accountDisc.at(6)?.discussion.disc_endtime.toString()).add(1, 'day').diff(dayjs(), 'minutes')
  )
  console.log( dayjs(accountDisc.at(6)?.discussion.disc_date.toString().substring(0,10) + " " + accountDisc.at(6)?.discussion.disc_endtime.toString()).add(1, 'day').diff(dayjs(), 'minutes') < 0 && dayjs(accountDisc.at(6)?.discussion.disc_date.toString().substring(0,10) + " " + accountDisc.at(6)?.discussion.disc_endtime.toString()).add(1, 'day').diff(dayjs(), 'minutes') >= -5)

  return (
    <div>
      {!isLoadingChangeAccount ? (
        <div className="all-page-calendar">
          <div className="sidebar-content-calendar">
            {userRole === "Teacher" ? (
              <Sidebar
                teacheracc={teacher}
                account={account}
                onLoadingTrue={handleLoadingTrue}
                onLoadingFalse={handleLoadingFalse}
              ></Sidebar>
            ) : (
              <Sidebar
                account={account}
                onLoadingTrue={handleLoadingTrue}
                onLoadingFalse={handleLoadingFalse}
              ></Sidebar>
            )}
          </div>

          <div className="disc-course-content">
            {!isLoading ? (
              <>
                <h1
                  style={{
                    margin: "2rem 0rem 2rem 2rem",
                    fontWeight: "600",
                    fontSize: "48px",
                  }}
                >
                  My Calendar
                </h1>

                <div className="disc-calendar">
                  <div
                    className="col-5 h-100 border-end bg-white text-dark align-items-center"
                    style={{ padding: "4rem" }}
                  >
                    <header className="d-flex justify-content-between">
                      <p
                        className="text-gray-500"
                        style={{ fontWeight: "600", fontSize: "32px" }}
                      >
                        {dayjs(new Date(dayjs().year(), currMonthIdx)).format(
                          "MMMM YYYY"
                        )}
                      </p>
                      <div className="button-container">
                        <button
                          onClick={() => setMonth(-1)}
                          className="calendar-prevbutton"
                        >
                          <BiSolidChevronLeftSquare
                            style={{ fontSize: "24px" }}
                          />
                        </button>
                        <button
                          onClick={() => setMonth(1)}
                          className="calendar-nextbutton"
                        >
                          <BiSolidChevronRightSquare
                            style={{ fontSize: "24px" }}
                          />
                        </button>
                      </div>
                    </header>

                    <div className="calendar-container bg-dange">
                      <div className="row mb-4">
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
                            <button key={idx} className="col date-column">
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
                  <div
                    className="col-7 h-100 bg-white text-dark"
                    style={{ marginLeft: 0 }}
                  >
                    {!!teacher ? (
                      !currTeacherDisc?.length ? (
                        <div
                          className="h-100 d-flex justify-content-center align-items-center fw-bold"
                          style={{ letterSpacing: "1.5px" }}
                        >
                          <p>There's No Discussion on the Selected Date</p>
                        </div>
                      ) : (
                        <>
                          <div
                            className=" d-flex m-0 fw-bold justify-content-center"
                            style={{ padding: "1.5rem 0rem 0rem 0rem" }}
                          >
                            <p style={{ fontSize: "32px" }}>
                              Upcoming Discussion
                            </p>
                          </div>
                          <div className="disc-container d-flex">
                            {currTeacherDisc.map((data, idx) => (
                              <div
                                className="card disc-item"
                                key={idx}
                                style={{ width: "65%", padding: 0 }}
                              >
                                <img
                                  className="disc-image"
                                  src={
                                    data.image
                                      ? `assets/${data.image}`
                                      : "assets/private.png"
                                  }
                                  alt=""
                                />
                                <div className="participant-total">
                                  {data.participant} / {data.maxPeople}
                                </div>

                                <div className="disc-body">
                                  <div className="updisc-container w-100 mx-2">
                                    <h5 className="card-text d-flex justify-content-between">
                                      <div className="text-center border-end border-white justify-content-center align-items-center d-flex row">
                                        <h4
                                          style={{
                                            margin: 0,
                                            fontSize: "32px",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {dayjs(data.date).format("DD")}
                                        </h4>
                                        <h5
                                          style={{
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {dayjs(data.date).format("MMM")}
                                        </h5>
                                      </div>

                                      <div className="my-auto d-flex row">
                                        <h6
                                          style={{
                                            margin: 0,
                                            fontSize: "14px",
                                          }}
                                        >
                                          {data.title} <br />
                                          by {teacher.account.fullName}
                                        </h6>
                                      </div>
                                      <div className="justify-content-center px-2 border-start border-white">
                                        <h6
                                          className="d-flex align-items-center justify-content-center pe-2"
                                          style={{
                                            height: "100%",
                                            fontSize: "12px",
                                          }}
                                        >
                                          {data.starttime
                                            .toString()
                                            .slice(0, 5)}{" "}
                                          -{" "}
                                          {data.endtime.toString().slice(0, 5)}
                                        </h6>
                                      </div>
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )
                    ) : !disc?.length ? (
                      <div
                        className="h-100 d-flex justify-content-center align-items-center fw-bold"
                        style={{ letterSpacing: "1.5px" }}
                      >
                        <p>There's No Discussion on the Selected Date</p>
                      </div>
                    ) : (
                      <>
                        <div
                          className=" d-flex m-0 fw-bold justify-content-center"
                          style={{ padding: "1.5rem 0rem 0rem 0rem" }}
                        >
                          <p style={{ fontSize: "32px" }}>
                            Upcoming Discussion
                          </p>
                        </div>
                        <div className="disc-container d-flex">
                          {/* {disc.length > 1 ? ( */}
                            <Carousel indicators={false} wrap={false} style={{ width: "65%", padding: 0 }} 
                              prevIcon={<GrPrevious style={{ fontSize:"36px",stroke:"#11235A",fill:"white",strokeWidth:"5px",fontWeight:"bold" }}/>}
                              nextIcon={<GrNext style={{ fontSize:"36px",stroke:"#11235A",fill:"white",strokeWidth:"5px",fontWeight:"bold" }}/>}>
                              {disc.map((data, idx) => (
                                <Carousel.Item>
                                  <div
                                    className="card disc-item"
                                    key={idx}
                                    style={{ width: "100%", padding: 0 }}
                                  >
                                    <img
                                      className=" disc-image"
                                      src={
                                        data.discussion.disc_image
                                          ? `assets/${data.discussion.disc_image}`
                                          : "assets/private.png"
                                      }
                                      alt=""
                                    />
                                    <div className="participant-total">
                                      {data.discussion.joinedParticipant} /{" "}
                                      {data.discussion.disc_participant}
                                    </div>

                                    <div className="disc-body">
                                      <div className="updisc-container w-100 mx-2">
                                        <h5 className="card-text d-flex justify-content-between">
                                          <div className="text-center border-end border-white justify-content-center align-items-center d-flex row">
                                            <h4
                                              style={{
                                                margin: 0,
                                                fontSize: "32px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {dayjs(
                                                data.discussion.disc_date
                                              ).format("DD")}
                                            </h4>
                                            <h5
                                              style={{
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {dayjs(
                                                data.discussion.disc_date
                                              ).format("MMM")}
                                            </h5>
                                          </div>

                                          <div className="my-auto d-flex row">
                                            <h6
                                              style={{ margin: 0, fontSize: "14px" }}
                                            >
                                              {data.discussion.disc_title}
                                              <br />
                                            </h6>
                                            <h6
                                              style={{
                                                margin: 0,
                                                fontSize: "10px",
                                                color: "var(--yelo)",
                                              }}
                                            >
                                              by {data.discussion.teacher.user.firstName}
                                            </h6>
                                          </div>

                                          <div className="justify-content-center px-2 border-start border-white">
                                            <h6
                                              className="d-flex align-items-center justify-content-center pe-2"
                                              style={{
                                                height: "100%",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {data.discussion.disc_starttime
                                                .toString()
                                                .slice(0, 5)}{" "}
                                              -{" "}
                                              {data.discussion.disc_endtime
                                                .toString()
                                                .slice(0, 5)}
                                            </h6>
                                          </div>
                                        </h5>
                                      </div>
                                    </div>
                                  </div>
                                    <div className="d-flex button-disc justify-content-around">
                                      {dayjs().format("YYYY-MM-DD").localeCompare(dayjs(data.discussion.disc_date.toString()).format("YYYY-MM-DD")) === 0?
                                        (
                                          //di hari ini tapi masih belum selisih 15 menit
                                          dayjs(data.discussion.disc_date.toString().substring(0,10) + " " + data.discussion.disc_starttime.toString()).add(1, 'day').diff(dayjs(), 'minutes') > 15?
                                            <>
                                              <button className="badge px-5 py-2" style={{ backgroundColor:"#11235A",color:"white" }} disabled={true}>Join Disabled didalem</button>
                                              <button className="badge px-5 py-2" style={{ backgroundColor:"white",color:"#11235A" }} onClick={() => cancelDisc(data.discussion.disc_id)}>Cancel</button>
                                            </>
                                          :
                                          //di hari ini dan selisih uda 15 menit
                                          dayjs(data.discussion.disc_date.toString().substring(0,10) + " " + data.discussion.disc_starttime.toString()).add(1, 'day').diff(dayjs(), 'minutes') <= 15 && dayjs(data.discussion.disc_date.toString().substring(0,10) + " " + data.discussion.disc_endtime.toString()).add(1, 'day').diff(dayjs(), 'minutes') > 0 ?
                                          (
                                            <>
                                              <button className="badge px-5 py-2" style={{ backgroundColor:"#11235A",color:"white" }}>Join DDekat</button>
                                              <button className="badge px-5 py-2" style={{ backgroundColor:"white",color:"#11235A" }} onClick={() => cancelDisc(data.discussion.disc_id)}>Cancel</button>
                                            </>
                                          )
                                          :
                                          (
                                            dayjs(data.discussion.disc_date.toString().substring(0,10) + " " + data.discussion.disc_endtime.toString()).add(1, 'day').diff(dayjs(), 'minutes') <= 0 && dayjs(data.discussion.disc_date.toString().substring(0,10) + " " + data.discussion.disc_endtime.toString()).add(1, 'day').diff(dayjs(), 'minutes') >= -5 && userRole !== "Teacher" ?
                                            //5 menit buat mark as complete
                                            <>
                                              <button className="badge px-5 py-2" style={{ backgroundColor:"#11235A",color:"white" }}>Mark as Complete</button>
                                            </>
                                            :
                                            //5 menit habis, jadi dia completed sndiri tapi status ga keset complete
                                            <>
                                              <button className="badge px-5 py-2" style={{ backgroundColor:"#11235A",color:"white" }} disabled={true}>Completed asd</button> 
                                            </>
                                          )
                                        ) 
                                        :
                                        (
                                          //kurang dari hari discnya jalan
                                          dayjs().format("YYYY-MM-DD") < data.discussion.disc_date.toString()?
                                          <>
                                            <button className="badge px-5 py-2" style={{ backgroundColor:"#11235A",color:"white" }} disabled={true}>Join Disabled</button>
                                            <button className="badge px-5 py-2" style={{ backgroundColor:"white",color:"#11235A" }} onClick={() => cancelDisc(data.discussion.disc_id)}>Cancel</button>
                                          </>
                                          :
                                          //lebih dari, otomatis close
                                          <>
                                            <button className="badge px-5 py-2" style={{ backgroundColor:"#11235A",color:"white" }} disabled={true}>Completed</button>
                                          </>
                                        )
                                    }
                                    </div>
                                </Carousel.Item>
                              ))}

                            </Carousel>
                          {/* )
                          :
                          (
                              disc.map((data, idx) => (
                                  <div
                                    className="card disc-item"
                                    key={idx}
                                    style={{ width: "65%", padding: 0 }}
                                  >
                                    <img
                                      className=" disc-image"
                                      src={
                                        data.discussion.disc_image
                                          ? `assets/${data.discussion.disc_image}`
                                          : "assets/private.png"
                                      }
                                      alt=""
                                    />
                                    <div className="participant-total">
                                      {data.discussion.joinedParticipant} /{" "}
                                      {data.discussion.disc_participant}
                                    </div>

                                    <div className="disc-body">
                                      <div className="updisc-container w-100 mx-2">
                                        <h5 className="card-text d-flex justify-content-between">
                                          <div className="text-center border-end border-white justify-content-center align-items-center d-flex row">
                                            <h4
                                              style={{
                                                margin: 0,
                                                fontSize: "32px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {dayjs(
                                                data.discussion.disc_date
                                              ).format("DD")}
                                            </h4>
                                            <h5
                                              style={{
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {dayjs(
                                                data.discussion.disc_date
                                              ).format("MMM")}
                                            </h5>
                                          </div>

                                          <div className="my-auto d-flex row">
                                            <h6
                                              style={{ margin: 0, fontSize: "14px" }}
                                            >
                                              {data.discussion.disc_title}
                                              <br />
                                            </h6>
                                            <h6
                                              style={{
                                                margin: 0,
                                                fontSize: "10px",
                                                color: "var(--yelo)",
                                              }}
                                            >
                                              by {data.discussion.teacher.user.firstName}
                                            </h6>
                                          </div>

                                          <div className="justify-content-center px-2 border-start border-white">
                                            <h6
                                              className="d-flex align-items-center justify-content-center pe-2"
                                              style={{
                                                height: "100%",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {data.discussion.disc_starttime
                                                .toString()
                                                .slice(0, 5)}{" "}
                                              -{" "}
                                              {data.discussion.disc_endtime
                                                .toString()
                                                .slice(0, 5)}
                                            </h6>
                                          </div>
                                        </h5>
                                      </div>
                                    </div>
                                 </div>
                              ))
                          )
                        } */}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <h1
                  style={{
                    margin: "4rem 0rem 2rem 2rem",
                    fontWeight: "600",
                    fontSize: "48px",
                  }}
                >
                  My Course
                </h1>

                <div className="my-course">
                  {/* <div className="search-course-calendar d-flex">
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
                  <IoSearch color="#6E6E6E" fontSize={"24"} />
                </button>
              </div>
            </div> */}

                  <div className="search-wrapper">
                    <div className="search-container">
                      <div className="search-left">
                        <input
                          type="search"
                          name=""
                          id="search-input"
                          placeholder="Search"
                          className="search-left-bar"
                          onChange={(e) => {
                            setSearchText(e.target.value)
                          }}
                        />
                      </div>
                      <div className="search-right">
                        <button className="search-button" id="search"
                        onClick={() => handleSearch()}>
                          <IoSearch color="#6E6E6E" fontSize={"24"} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    className="account-course-content"
                    ref={itemsRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                  >
                    {teacher
                      ? teacherCourse.map((data: { image: any; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; level: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; category: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, idx:any) => (
                          
                          <div
                            key={idx}
                            className="d-flex bg-warning"
                            style={{ width: "20rem" }}
                          >
                            <div
                              className="card"
                              style={{ border: "none", width: "20rem" }}
                            >
                              {/* <Link
                                to={"/home"}
                                key={idx}
                                // state={{
                                //   data: data,
                                //   acc: account,
                                //   teacher: data.course.teacher,
                                // }}
                                style={{ textDecoration: "none" }}
                              > */}
                                <div className="container-class-header">
                                  <div className="class-thumbnail">
                                    <img
                                      src={`assets/${data.image}`}
                                      className="img-fluid card-img-top"
                                      alt=""
                                      style={{ objectFit: "fill" }}
                                    />
                                  </div>
                                </div>

                                <div className="card-body p-2">
                                  <div className="d-flex row w-100 h-100 justify-content-between m-0">
                                    <div
                                      className="p-0"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: "fit-content",
                                      }}
                                    >
                                      <img
                                        src={
                                          teacher.account.urlImage ||
                                          `assets/default_picture.png`
                                        }
                                        alt=""
                                        className="me-2"
                                        style={{
                                          width: "3vh",
                                          height: "3vh",
                                          borderRadius: "0.25rem",
                                        }}
                                      />
                                      <span
                                        style={{
                                          color: "#000",
                                          alignItems: "center",
                                          fontSize: "10px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {teacher.account.firstName}{" "}
                                        {teacher.account.lastName}
                                      </span>
                                    </div>
                                    <div className="title-class m-0 p-0 ">
                                      <h3
                                        style={{
                                          color: "#000",
                                          fontSize: "18px",
                                          marginTop: "0.5rem",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {data.title}
                                      </h3>
                                    </div>
                                    <div
                                      className="d-flex p-0 align-content-end align-items-end"
                                      style={{ gap: "0.5rem" }}
                                    >
                                      <div className="chip">
                                        {data.category}
                                      </div>
                                      <div className="chip">{data.level}</div>
                                    </div>
                                  </div>
                                </div>
                              {/* </Link> */}
                            </div>
                          </div>
                        ))
                        : accountCourse.map((data: { course: { course_title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined; teacher: { user: { profile_pic: string; firstName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; lastName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }; }; course_image: any; course_level: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; category: { category_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> |  null | undefined; }; }; }, idx: Key | null | undefined) => (
                          
                            <div className="card" style={{ border: "none",width:"20rem" }}>
                              <Link
                                to={"/course/" + data.course.course_title}
                                key={idx}
                                state={{
                                  data: data,
                                  acc: account,
                                  teacher: data.course.teacher,
                                  link: "/calendar"
                                }}
                                style={{ textDecoration: "none" }}
                              >
                                <div className="container-class-header">
                                  <div className="class-thumbnail">
                                    <img
                                      src={`assets/${data.course.course_image}`}
                                      className="img-fluid card-img-top"
                                      alt=""
                                      style={{ objectFit: "fill" }}
                                    />
                                  </div>
                                </div>

                                <div className="card-body p-2">
                                  <div className="d-flex row w-100 h-100 justify-content-between m-0">
                                    <div
                                      className="p-0"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: "fit-content",
                                      }}
                                    >
                                      <img
                                        src={
                                          "/assets/" +
                                          data.course.teacher.user.profile_pic
                                        }
                                        alt=""
                                        className="me-2"
                                        style={{
                                          width: "3vh",
                                          height: "3vh",
                                          borderRadius: "0.25rem",
                                        }}
                                      />
                                      <span
                                        style={{
                                          color: "#000",
                                          alignItems: "center",
                                          fontSize: "10px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {data.course.teacher.user.firstName}{" "}
                                        {data.course.teacher.user.lastName}
                                      </span>
                                    </div>
                                    <div className="title-class m-0 p-0 ">
                                      <h3
                                        style={{
                                          color: "#000",
                                          fontSize: "18px",
                                          marginTop: "0.5rem",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {data.course.course_title}
                                      </h3>
                                    </div>
                                    <div
                                      className="d-flex p-0 align-content-end align-items-end"
                                      style={{ gap: "0.5rem" }}
                                    >
                                      <div className="chip">
                                        {data.course.category.category_name}
                                      </div>
                                      <div className="chip">
                                        {data.course.course_level}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          
                        ))}
                  </div>
                </div>
              </>
            ) : (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100%" }}
              >
                <svg
                  width="80"
                  height="80"
                  stroke="#fff"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <circle
                      cx="12"
                      cy="12"
                      r="9.5"
                      fill="none"
                      stroke-width="3"
                      stroke-linecap="round"
                    >
                      <animate
                        attributeName="stroke-dasharray"
                        dur="1.5s"
                        calcMode="spline"
                        values="0 150;42 150;42 150;42 150"
                        keyTimes="0;0.475;0.95;1"
                        keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-dashoffset"
                        dur="1.5s"
                        calcMode="spline"
                        values="0;-16;-59;-59"
                        keyTimes="0;0.475;0.95;1"
                        keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      dur="2s"
                      values="0 12 12;360 12 12"
                      repeatCount="indefinite"
                    />
                  </g>
                </svg>
              </div>
            )}
          </div>
        </div>


        
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <svg
            width="80"
            height="80"
            stroke="#fff"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <circle
                cx="12"
                cy="12"
                r="9.5"
                fill="none"
                stroke-width="3"
                stroke-linecap="round"
              >
                <animate
                  attributeName="stroke-dasharray"
                  dur="1.5s"
                  calcMode="spline"
                  values="0 150;42 150;42 150;42 150"
                  keyTimes="0;0.475;0.95;1"
                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-dashoffset"
                  dur="1.5s"
                  calcMode="spline"
                  values="0;-16;-59;-59"
                  keyTimes="0;0.475;0.95;1"
                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                  repeatCount="indefinite"
                />
              </circle>
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="2s"
                values="0 12 12;360 12 12"
                repeatCount="indefinite"
              />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};

export default Calendar;
