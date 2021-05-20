import { timeFormat } from "d3";
import * as d3 from "d3";


export default timeFormat("%b %d");



const formatMillisecond = d3.timeFormat(".%L"),

  formatSecond = d3.timeFormat(":%S"),

  formatMinute = d3.timeFormat("%I:%M"),

  formatHour = d3.timeFormat("%I %p"),

  formatDay = d3.timeFormat("%a %d"),

  formatWeek = d3.timeFormat("%a, %b %d"),

  formatMonth = d3.timeFormat("%B"),

  formatYear = d3.timeFormat("%Y");

const printAllFormats = (date)=>{
    console.log("formatMillisecond: " + formatMillisecond(date));
    console.log("formatSecond: " + formatSecond(date));
    console.log("formatMinute: " + formatMinute(date));
    console.log("formatHour: " + formatHour(date));
    console.log("formatDay: " + formatDay(date));
    console.log("formatWeek: " + formatWeek(date));
    console.log("formatMonth: " + formatMonth(date));
    console.log("formatYear: " + formatYear(date));
}

export function formatDateTime(date){

    if(typeof(date)!=='string')
    date= new Date(date)   

    return null;

}

export function customTimeFormatter(date) {
    
   // printAllFormats(date);
    
  const format = (
      d3.timeSecond(date) > date
    ? formatMillisecond
    : d3.timeMinute(date) > date
    ? formatSecond
    : d3.timeHour(date) > date
    ? formatMinute
    : d3.timeDay(date) > date
    ? formatHour
    : d3.timeMonth(date) > date
    ? formatDay
    : d3.timeWeek(date) > date
    ? formatWeek
    : d3.timeYear(date) > date
    ? formatMonth
    : formatYear)(date);
    // console.log(format)

return format;
}