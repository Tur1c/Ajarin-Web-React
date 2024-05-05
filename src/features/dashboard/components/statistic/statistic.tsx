import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from "chart.js";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  BiSolidChevronLeftSquare,
  BiSolidChevronRightSquare,
} from "react-icons/bi";
import { AccountOutput } from "../../../../model/Account";
import {
  BarChartData,
  PieChartData,
  createCurrMonthBar,
  createCurrMonthPie,
  getTotalCourse,
} from "../../../../model/statistic/statistic-model";

ChartJS.register(ArcElement, Tooltip, BarElement, CategoryScale, LinearScale);

interface Props {
  account: AccountOutput;
}

const Statistic = ({ account }: Props) => {
  // const [stats, setStats] = useState(false);
  const [currMonthIdx, setCurrMonthIdx] = useState(dayjs().month());

  // const fixedPieData = createCurrMonthPie(account);

  const [pieData, setPieData] = useState<PieChartData>({
    labels: [],
    datasets: [],
  });

  // console.log(pieData, fixedPieData);

  const [barData, setBarData] = useState<BarChartData>({
    labels: [],
    datasets: [],
  });

  const [totalCourse, setTotalCourse] = useState(0);

  const setMonth = (x: number) => {
    setCurrMonthIdx(currMonthIdx + x);
  };

  useEffect(() => {
    if (account) {
      setPieData(createCurrMonthPie(account, currMonthIdx));
      setBarData(createCurrMonthBar(account, currMonthIdx));
      setTotalCourse(getTotalCourse(account, currMonthIdx));
    }
  }, [account, currMonthIdx]);

  console.log(pieData);
  return (
    <>
      <div className="">
        <p style={{ fontSize: "10px", marginLeft: "1rem" }}>
          You have finished {totalCourse} courses in{" "}
          {currMonthIdx === dayjs().month()
            ? "this Month"
            : dayjs().month(currMonthIdx).format("MMMM")}
          . Keep it up!
        </p>
        <header
          className="d-flex justify-content-between"
          style={{ margin: "0rem 1rem" }}
        >
          <p className="text-gray-500 fw-bold" style={{ fontSize: "14px" }}>
            {dayjs(new Date(dayjs().year(), currMonthIdx)).format("MMMM YYYY")}
          </p>
          <div className="button-container">
            <button
              onClick={() => setMonth(-1)}
              className="calendar-prevbutton"
            >
              <BiSolidChevronLeftSquare
                style={{ fontSize: "24px", color: "white" }}
              />
            </button>
            <button onClick={() => setMonth(1)} className="calendar-nextbutton">
              <BiSolidChevronRightSquare
                style={{ fontSize: "24px", color: "white" }}
              />
            </button>
          </div>
        </header>
        <div className="w-100 d-flex justify-content-center">
          <div style={{ width: "95%", borderRadius:"0.25rem" }}>
            <Bar className="bar-chart" data={barData}></Bar>
          </div>
        </div>

        <p
          className="d-flex justify-content-center"
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            padding: "0",
            marginTop: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          Hours Spent
        </p>
        <div className="pie-chart h-75" style={{ margin: "0rem auto" }}>
          <Pie className="" data={pieData}></Pie>
        </div>
        <p
          className="d-flex justify-content-center"
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            padding: "0",
            marginTop: "0.5rem",
            marginBottom: "0rem",
          }}
        >
          Most Subject
        </p>
      </div>
    </>
  );
};

export default Statistic;
