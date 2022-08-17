import React, { useEffect, useMemo, useState } from "react";
import ScheduleClass from "../../lib/schedule";
import { RiArrowDropRightLine, RiArrowDropLeftLine } from "react-icons/ri";

interface Schedule{
    date: ScheduleDate;
}

export default function Schedule({date}:Schedule){

    const [gap, setGap] = useState<number>(1);
    const [daysInMonth, setDaysInMonth] = useState<number>(0);

    useEffect(()=>{
        setGap(new Date(date.year,date.month,1).getDay()-1);

    },[date.month, date.year, gap])

    useEffect(()=>{
        setDaysInMonth(ScheduleClass.daysInMonth(date))
    },[daysInMonth,date.month, date.year,date])

    return (
        <div>
            <div className="flex w-full" >   
                {
                    ["Mo.","Di.","Mi.","Do.","Fr.","Sa.","So."].map((e,i) => <DateDay key={e} dateName={e} isSunday={i === 6} />)
                }
            </div>
            <div className="bg-slate-500/25 flex flex-wrap " >
                {
                    Array.from({length:gap})
                    .map((e,i) => <ScheduleDay key={i} hidden />)
                }
                {
                    Array.from({length:daysInMonth})
                    .map((e,i) => <ScheduleDay key={i} dayNumber={i+1} hidden={false} />)
                }
            </div>
        </div>
    )
}

function DateDay({dateName, isSunday}:{dateName:string, isSunday:boolean}){
    return(
        <p className={`w-[14.2857%] text-center font-bold ${isSunday ? "text-rose-500" :""}`} >{dateName}</p>
    )
}

interface ScheduleDay{
    dayNumber?: number;
    hidden: boolean;
}

function ScheduleDay({dayNumber, hidden}:ScheduleDay){

    if (hidden) return <div className="w-[14.2857%] h-14 xl:h-24" />

    return(
        <div className="bg-gradient-to-t from-slate-100 to-slate-300 w-[14.2857%] h-14 border border-slate-500 flex justify-center items-center text-xl font-bold select-none transition-all xl:hover:scale-110 xl:hover:shadow-xl xl:h-24" >
            {dayNumber}
        </div>
    )
}

export function ChangeMonth({date, setDate}:{date:ScheduleDate, setDate:React.Dispatch<React.SetStateAction<ScheduleDate>>}){

    const [monthName, setMonthName] = useState<string>("")

    useEffect(()=>{
        setMonthName(ScheduleClass.parseMonthNumberToString(date.month,"de"));
    },[monthName, date.month])

    function decreaseMonth(){
        if (date.month - 1 === 0){
            setDate({...date,month:12, year: date.year-1});
            return;
        }

        setDate({...date, month: date.month - 1});
    }

    function increaseMonth(){
        if (date.month + 1 === 13){

            setDate({...date, month: 1, year: date.year + 1});
            return;
        }
        
        setDate({...date, month: date.month + 1});

    }

    return(
        <div className="mt-8" >
            <p className="text-center underline underline-offset-2" >{date.year}</p>
            <div className="flex justify-between items-center text-2xl" >
                <button className="p-2 mx-4 " onClick={decreaseMonth} >
                    <RiArrowDropLeftLine className="w-8 h-8 transition-all xl:w-12 xl:h-12 xl:hover:scale-110" />                
                </button>
                <p className="font-bold text-md" >{monthName}</p>
                <button className="p-2 mx-4" onClick={increaseMonth} >
                    <RiArrowDropRightLine className="w-8 h-8 transition-all xl:w-12 xl:h-12 xl:hover:scale-110" />
                </button>
            </div>
        </div>
    )
}

export interface ScheduleDate{
    day: number;
    month: number;
    year: number;
    dayInWeek: number;
}
