import dayjs from "dayjs";
import { AccountOutput, StudentCourse, StudentDisc } from "../Account";
import moment from "moment";
import { getISOWeek } from "date-fns";
import { isNull } from "lodash";

var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);

export const pieChartData = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
        {
            label: "test Dataset",
            data: [300,50,100],
            backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
            ],
            hoverOffset: 4,
        },
    ],
};


export interface PieChartData{
    labels: String[],
    datasets: PieDatasets[]
}

export interface PieDatasets{
    label: string,
    data: number[],
    backgroundColor: string[],
    hoverOffset: number
}

function getCategoryData(studentDisc:StudentDisc[], studentCourse:StudentCourse[],currMonth:any){
    let discData = studentDisc
                    .filter( (x) => x.discussion.category.category_id != '99' && dayjs(x.joined_date).month() === currMonth)
                    .map( (x) => x.discussion.category.category_name)
                    .filter( (value, idx, currValue) => currValue.indexOf(value) === idx);

    let courseData = studentCourse
                    .filter( (x) => dayjs(x.joined_date).month() === currMonth)
                    .map( (x) => x.course.category.category_name)
                    .filter( (value, idx, currValue) => currValue.indexOf(value) === idx);


    return discData.concat(courseData);
}


function countSubject(category: string, studentDisc:StudentDisc[], studentCourse: StudentCourse[], currMonth:any){
    console.log(studentDisc, studentCourse, "uddah sampai sini");

    // console.log(studentDisc.filter( (x) => dayjs(x.joined_date).month() === currMonth), studentCourse.filter( (x) => dayjs(x.joined_date).month() === currMonth));
    let total = studentDisc.filter( (x) => dayjs(x.joined_date).month() === currMonth && x.discussion.category.category_name === category).length;
    total = total + studentCourse.filter( (x) => dayjs(x.joined_date).month() === currMonth && x.course.category.category_name === category).length;
    // console.log(total, category);
    return total;
}

function countSubjectsTotal(studentDisc:StudentDisc[], studentCourse: StudentCourse[], label:string[], currMonth:any){
    // const counts = {} as IndexString;
    // label.forEach( function (x) {
    //     counts[x] = countSubject(x, studentDisc, studentCourse, currMonth);
    // });

    let idx:number = 0;
    const count:number[] = [];
    label.forEach( (x) => {
        count[idx] = countSubject(x,studentDisc,studentCourse, currMonth); 
        idx++;
    });

    // console.log(counts, count);
    return count;
}


export function createCurrMonthPie(acc:AccountOutput, currMonth:any):PieChartData{
    console.log(currMonth, "bulan berapa");
    const label = getCategoryData(acc.studentdisc_list,acc.studentcourse_list, currMonth);
    // console.log(label);
    const subjectCount = countSubjectsTotal(acc.studentdisc_list, acc.studentcourse_list,label,currMonth);

    const result:PieChartData = {
        labels: label,
        datasets: [
            {
                label:"Most Subjects",
                data:subjectCount,
                backgroundColor: [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)"
                ],
                hoverOffset: 4,
            }
        ]
    }

    console.log(result, pieChartData);
    return result;
}

//Bar

export interface BarChartData{
    labels: String[],
    datasets: BarDatasets[]
}

export interface BarDatasets{
    label: string,
    data: number[],
    borderColor: string,
    backgroundColor: string[],
    borderWith: number
}

function getTotalWeek(total:any){
    let week = [];
    for (let i = 1; i <= total; i++) {
        week.push("Week " + i);
        
    }

    return week;
}

function getHoursSpent(studentDisc:StudentDisc[], studentCourse: StudentCourse[], currMonth:any, total:any, weeks:any){
    const {getISOWeek} = require('date-fns');
    let discData = studentDisc.filter( (x) => x.discussion.category.category_id != '99' && x.status.localeCompare("Completed") === 0 && dayjs(x.discussion.disc_date).month() === currMonth);
    let result:number[] = [];
    for (let idx = 0; idx < total; idx++) {
        result.push(0);

        // disc
        let usedDiscData = discData.filter( (x) => getISOWeek(x.discussion.disc_date) === weeks[idx]);
        if(usedDiscData){
            usedDiscData.forEach((x) => {
                console.log(dayjs(x.discussion.disc_starttime,"HH:mm:ss").format("HH:mm:ss"), x.discussion.disc_endtime);
                var z:number = dayjs(x.discussion.disc_endtime,"HH:mm:ss").diff(dayjs(x.discussion.disc_starttime,"HH:mm:ss"),'minute');
                if(z < 0) z = 1440 + z;
                result[idx] += z;
            })
        }

        // course
        const data:string[] = studentCourse.filter((x) => x.completed_chap !== null).map((x) => x.completed_chap);
        data.forEach((x) => {
            var totalData = x.split('|')
                            .map((x) => x.substring(x.indexOf(';') + 1))
                            .filter((x) => dayjs(x).month() === currMonth && getISOWeek(new Date(x)) === weeks[idx])
                            .length;


            if(totalData !== 0){
                result[idx] += totalData * 10;
            }
        })
    }
    return result;
}

export function createCurrMonthBar(acc:AccountOutput, currMonth:any):BarChartData{
    var firstDayofMonth = new Date(dayjs().month(currMonth).set('date',1).format("YYYY-MM-DD"));
    var lastDayofMonth = new Date(dayjs().month(currMonth+1).set('date',0).format("YYYY-MM-DD"));
    var totalWeeks = Math.ceil((firstDayofMonth.getDay() + lastDayofMonth.getDate()) / 7);
    var firstWeek = getISOWeek(firstDayofMonth);

    console.log(
        acc.studentcourse_list.filter( (x) => x.status.localeCompare("Completed") === 0).map(
            (x) => x.completed_chap.substring(x.completed_chap.lastIndexOf(';')+1)
        )
    );

    let weeks = [];

    for (let idx = 0; idx < totalWeeks; idx++) {
        weeks.push(firstWeek+idx);
    }


    console.log("masuk sini aasd", firstWeek, totalWeeks,weeks);
    const label = getTotalWeek(totalWeeks);
    const hourSpent = getHoursSpent(acc.studentdisc_list, acc.studentcourse_list, currMonth, totalWeeks, weeks);
    console.log(label, hourSpent);

    const result:BarChartData = {
        labels:label,
        datasets: [
            {
                label: "Hours Spent",
                data: hourSpent,
                borderColor: "black",
                backgroundColor: ["aqua","red","blue","purple"],
                borderWith: 1
            }
        ]
    };

    return result;
    
}

export function getTotalCourse(acc:AccountOutput, currMonth:any){
    var totalCourse = acc.studentcourse_list.filter( (x) => x.status.localeCompare("Completed") === 0 && 
                                    dayjs(x.completed_chap.substring(x.completed_chap.lastIndexOf(';')+1)).month() === currMonth
                                    ).length;
    return totalCourse;
}