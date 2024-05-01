import React, { useEffect, useState } from 'react'
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { BarChartData, PieChartData, createCurrMonthBar, createCurrMonthPie, getTotalCourse } from '../../../../model/statistic/statistic-model';
import { AccountOutput } from '../../../../model/Account';
import dayjs from 'dayjs';
import { BiSolidChevronLeftSquare, BiSolidChevronRightSquare } from 'react-icons/bi';

ChartJS.register(
    ArcElement,
    Tooltip,
    BarElement,
    CategoryScale,
    LinearScale
);

interface Props{
    account:AccountOutput;
}


const Statistic = ({account}:Props) => {

    // const [stats, setStats] = useState(false);
    const [currMonthIdx, setCurrMonthIdx] = useState(dayjs().month());

    // const fixedPieData = createCurrMonthPie(account);
    
    const [pieData, setPieData] = useState<PieChartData>({
        labels:[],
        datasets:[]
    });

    // console.log(pieData, fixedPieData);

    const [barData, setBarData] = useState<BarChartData>({
        labels:[],
        datasets:[]
    });

    const [totalCourse, setTotalCourse] = useState(0);

    const setMonth = (x: number) => {
        setCurrMonthIdx(currMonthIdx + x);   
    };


    useEffect(() => {
        if(account){
            setPieData(createCurrMonthPie(account,currMonthIdx));
            setBarData(createCurrMonthBar(account,currMonthIdx));
            setTotalCourse(getTotalCourse(account, currMonthIdx));
        }
    },[account,currMonthIdx]);

    console.log(pieData);
  return (
    <>
        <p>You have finished {totalCourse} courses in {currMonthIdx === dayjs().month() ? "this Month" : dayjs().month(currMonthIdx).format("MMMM")}! Keep it up!</p>
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
        <Bar data={barData}></Bar>
        <Pie
            data={pieData}
        ></Pie>
    </>
  )
}

export default Statistic