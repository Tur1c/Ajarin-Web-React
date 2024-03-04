import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
    BiSolidChevronLeftSquare,
    BiSolidChevronRightSquare,
} from "react-icons/bi";
import { useLocation } from "react-router-dom";
import { StudentDiscOutput } from "../../model/Account";
import { getMonth } from "../../model/calendar/calendar-detail";
import "./Calendar.css";

const Calendar = () => {
  const { state } = useLocation();
  console.log(state);

  // console.log(getMonth(3));
  // const [currMonthIdx, setCurrMonthIdx] = useState(dayjs().month());
  const [currMonthIdx, setCurrMonthIdx] = useState(dayjs().month());
  const [currMonthCalendar, setCurrMonthCalendar] = useState(getMonth());

  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));

  const accountDisc: StudentDiscOutput = state.accountDisc;
    console.log(accountDisc, "png");
  const image:string|undefined = accountDisc.studentdisc_list.at(0)?.disc.disc_image;
  //   console.log(image);
  
  const getDiscData = (date:any) => {

    const discData = accountDisc.studentdisc_list.filter(
        (x) => x.disc.disc_date.toString() === date
        ).sort((x,y) => (x.disc.disc_starttime.toString().localeCompare(y.disc.disc_starttime.toString())));

        console.log(discData, "ada data ga");
        if(discData){
            return discData;
        }
        return null;
    }
        
const [disc, setDisc] = useState(getDiscData(dayjs().format("YYYY-MM-DD")));
  var testDate = dayjs(new Date(2024, 10, 30)).format("YYYY-MM-DD");
//   console.log(
//     testDate,
//     accountDisc.studentdisc_list.at(0)?.disc.disc_date.toString(),
//     "aaaaa"
//   );
//   var testing = accountDisc.studentdisc_list.some(
//     (i) => i.disc.disc_date.toString() === testDate
//   );

  var testagain = accountDisc.studentdisc_list.filter(
    (x) => x.disc.disc_date.toString() !== testDate
  )
  console.log(accountDisc,testagain, "ehe");

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
    return accountDisc.studentdisc_list.some(
        (x) => x.disc.disc_date === date
    )
  };

  const changeSelectedDate = (day: any) => {
    setSelectedDate(day);
    setDisc(getDiscData(day));
  };

  const studentDiscDate = (day: any) => {
    const date = day.format("YYYY-MM-DD");
    let findDate = findDateonDisc(date);
    if (findDate) {
      return "bg-dark text-white rounded-3";
    }
    return "";
  };

  console.log(disc,"ini disc ehe");

  return (
    <>
      {/* <Sidebar account={undefined}/> */}
      <div className="container-fluid ms-5" style={{ height: "100vh" }}>
        <div className="row align-items-center h-100">
          <div className="mt-5 col-4 h-50 border-end">
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
                          (day.format("YYYY-MM-DD") === selectedDate
                            ? " bg-primary-subtle text-white rounded-3 "
                            : " ") +
                          currDateMonth(day) +
                          studentDiscDate(day)
                        }
                        onClick={() =>
                          changeSelectedDate(day.format("YYYY-MM-DD"))
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

          <div className="container mt-3 col-8 h-50">
            { !disc?.length ? 
                ( <p>No Discussion</p> )
                :
                (
                    <>
                    {/* Carousel sliider */}
                    {/* <div id="carouselExample" className="carousel slide">
                        <div className="carousel-inner disc-container">
                            {disc.map( (data, idx) => (
                            <div className={"card carousel-item mt-5 ms-5 " + (idx === 0 ? "active" : "")} key={idx} style={{width: "45%",height:"23rem",padding:0}}>
                                <img className="card-image-top w-100 h-75 disc-image" src={`assets/${data.disc.disc_image}`} alt=""/>
                                <div className="participant-total">12/{data.disc.disc_participant}</div>
    
                                <div className="card-body disc-body rounded">
                                    <h5 className="card-text d-flex h-100">
                                        <div className="disc-date col-3 text-center my-auto border-end border-white" >
                                            <h2 style={{ margin:0 }}>{dayjs(data.disc.disc_date).format("DD")}</h2>
                                            <h5>{dayjs(data.disc.disc_date).format("MMM")}</h5>
                                        </div>
                                        <div className="disc-title my-auto col-6 d-flex justify-content-center">
                                            <h6 className=""style={{ margin:0 }}>{data.disc.disc_title} <br />by Godwin</h6>
                                        </div>
                                        <div className="disc-time col-3 text-center my-auto border-start border-white " style={{ height:"70px" }}>
                                            <h6 className="d-flex align-items-center justify-content-center" style={{ height:"100%" }}>
                                                {data.disc.disc_starttime.toString()}-{data.disc.disc_endtime.toString()}
                                                </h6>
                                        </div>
                                    </h5>
                                </div>
                            </div>
                            ))
                        }
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div> */}
                    <div className="disc-container d-flex">
                        {disc.map( (data, idx) => (
                            <div className="card mt-5 ms-5" key={idx} style={{width: "45%",height:"23rem",padding:0}}>
                                <img className="card-image-top w-100 h-75 disc-image" src={`assets/${data.disc.disc_image}`} alt=""/>
                                <div className="participant-total">12/{data.disc.disc_participant}</div>
    
                                <div className="card-body disc-body rounded">
                                    <h5 className="card-text d-flex h-100">
                                        <div className="disc-date col-3 text-center my-auto border-end border-white" >
                                            <h2 style={{ margin:0 }}>{dayjs(data.disc.disc_date).format("DD")}</h2>
                                            <h5>{dayjs(data.disc.disc_date).format("MMM")}</h5>
                                        </div>
                                        <div className="disc-title my-auto col-6 d-flex justify-content-center">
                                            <h6 className=""style={{ margin:0 }}>{data.disc.disc_title} <br />by Godwin</h6>
                                        </div>
                                        <div className="disc-time col-3 text-center my-auto border-start border-white " style={{ height:"70px" }}>
                                            <h6 className="d-flex align-items-center justify-content-center" style={{ height:"100%" }}>
                                                {data.disc.disc_starttime.toString()}-{data.disc.disc_endtime.toString()}
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
            }   
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
