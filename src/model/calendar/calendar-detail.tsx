import dayjs from "dayjs";

export function getMonth(month = dayjs().month()){
    const year = dayjs().year();
    const firstDayofMonth = dayjs(new Date(year, month, 1)).day();

    // console.log(firstDayofMonth);

    let currMonthCount = 0 - firstDayofMonth; //karena ga semua tanggal 1 mulai dari minggu, jadi biar dia mulai bneran dari minggu dengan tanggal dari bulan sebelum
    const daysMatrix = new Array(6).fill([]).map( () => {
        return new Array(7).fill(null).map( () => {
            currMonthCount += 1;
            // console.log(currMonthCount);
            return dayjs(new Date(year,month, currMonthCount));
        })
    });

    // console.table(daysMatrix);

    return daysMatrix;
}