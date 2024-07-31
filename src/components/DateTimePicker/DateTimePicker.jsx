// import React, { useEffect, useState } from "react";
// import { format, subDays, differenceInCalendarDays } from "date-fns";
// import Wheel from "./Wheel";
import "./styles.css";
import { Input } from "antd";
import { motion } from "framer-motion";
import { P2PServices } from "../../lib/constants";

const DateTimePicker = ({
  selectedTime,
  selectedDate,
  setSelectedTime,
  setSelectedDate,
  service,
}) => {
  //   const [currentHour, setCurrentHour] = useState(
  //     selectedTime ? parseInt(selectedTime.split(":")[0]) : 0
  //   );
  //   const [currentMinutes, setCurrentMinutes] = useState(
  //     selectedTime ? parseInt(selectedTime.split(":")[1]) : 0
  //   );
  //   const [currentDate, setCurrentDate] = useState(
  //     format(subDays(new Date(), 0), "iii d LLL")
  //   );

  //   const initialDateIndex = differenceInCalendarDays(new Date(), selectedDate);

  //   function updateCurrentDate(_relative, absolute) {
  //     setCurrentDate(format(subDays(new Date(), absolute), "iii d LLL"));
  //   }
  //   function formateDate(_relative, absolute) {
  //     return format(subDays(new Date(), absolute), "iii d LLL");
  //   }

  //   useEffect(() => {
  //     setSelectedDate(currentDate);
  //     setSelectedTime(`${currentHour}:${currentMinutes}`);
  //   }, [
  //     currentDate,
  //     currentHour,
  //     currentMinutes,
  //     setSelectedDate,
  //     setSelectedTime,
  //   ]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm p-4">
      <div>{`On what date do you ${
        service === P2PServices.FIND_A_RIDE ? "reach?" : "need a UHaul?"
      } `}</div>
      <Input
        type="date"
        value={selectedDate}
        placeholder="On what date do you reach Pittsburgh?"
        className="p-2 w-full max-w-sm appearance-none h-10"
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{
          WebkitAppearance: "none",
          MozAppearance: "none",
          appearance: "none",
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {selectedDate ? (
          <div className="flex flex-col items-start gap-4 max-w-sm justify-center">
            <div>{`What time do you ${
              service === P2PServices.FIND_A_RIDE ? "reach?" : "need it?"
            }`}</div>
            <Input
              type="time"
              value={selectedTime}
              placeholder="What time do you reach Pittsburgh?"
              className="p-2 w-full max-w-sm appearance-none h-10"
              onChange={(e) => setSelectedTime(e.target.value)}
              style={{
                WebkitAppearance: "none",
                MozAppearance: "none",
                appearance: "none",
              }}
            />
          </div>
        ) : null}
      </motion.div>
    </div>
    // <div
    //   style={{
    //     height: "240px",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     background: "#fff",
    //   }}
    // >
    //   <div style={{ width: 180, height: 180 }}>
    //     <Wheel
    //       loop
    //       length={24}
    //       width={140}
    //       perspective="right"
    //       setValue={formateDate}
    //       setWheelAbsolute={updateCurrentDate}
    //       initIdx={initialDateIndex}
    //     />
    //   </div>
    //   <div style={{ width: 70, height: 180 }}>
    //     <Wheel
    //       loop
    //       length={24}
    //       width={23}
    //       setWheelAbsolute={setCurrentHour}
    //       initIdx={currentHour}
    //     />
    //   </div>
    //   <div style={{ width: 70, height: 180 }}>
    //     <Wheel
    //       loop
    //       length={60}
    //       width={23}
    //       perspective="left"
    //       setWheelAbsolute={setCurrentMinutes}
    //       initIdx={currentMinutes}
    //     />
    //   </div>
    // </div>
  );
};

export default DateTimePicker;
