import { motion } from "framer-motion";
import { P2PServices } from "../../../lib/constants";
import DateTimePicker from "../../../components/DateTimePicker/DateTimePicker";

const ArrivalDetails = ({
  selectedDate,
  handleDateChange,
  selectedTime,
  handleTimeChange,
  service,
}) => {
  return (
    <motion.div className="p-4">
      <motion.div
        className="flex flex-col items-center gap-4"
        key="arrival-time-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
      >
        <p>
          When do you{" "}
          {service === P2PServices.FIND_A_RIDE
            ? "reach Pittsburgh"
            : service === P2PServices.REQUEST_A_UHAUL
            ? "need the U-Haul"
            : null}
          ? (EST)
        </p>
        {/* <TimePicker
          value={selectedTime}
          onChange={handleTimeChange}
          changeOnScroll
          needConfirm={false}
          minuteStep={15}
          hourStep={1}
          format={format}
          className="w-4/5 mx-8 md:max-w-sm text-base"
        /> */}
        <DateTimePicker
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          setSelectedTime={handleTimeChange}
          setSelectedDate={handleDateChange}
          service={service}
        />
      </motion.div>
    </motion.div>
  );
};

export default ArrivalDetails;
