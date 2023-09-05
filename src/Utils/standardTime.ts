export const standardTime = (tDate: Date) => {
    let year = tDate.getFullYear();
    let month: string | number = tDate.getMonth() + 1;
    let day: string | number = tDate.getDate();
    let hour: string | number = tDate.getHours();
    let minute: string | number = tDate.getMinutes();
    let second: string | number = tDate.getSeconds();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
