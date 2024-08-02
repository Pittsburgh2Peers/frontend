import { createWhatsAppLinkForUhaul } from "../../lib/constants";
import { motion } from "framer-motion";
import moment from "moment";

const UHaulCard = ({
  startLocation,
  endLocation,
  time,
  driverRequired,
  phoneNo,
  receiverName,
  senderDate,
  senderTime,
  receiverDate,
  name,
  isSelf = false,
}) => {
  return (
    <motion.a
      href={`${
        !isSelf && name
          ? createWhatsAppLinkForUhaul({
              phone: phoneNo,
              receiverName: receiverName,
              date: senderDate,
              receiverDate: receiverDate,
              senderName: name,
            })
          : "#"
      }`}
      target={!isSelf && name ? "_blank" : ""}
      rel="noreferrer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeIn" }}
      className={`${
        isSelf ? "bg-cmu-iron-gray text-white" : ""
      } flex flex-col gap-2 text-base w-full rounded hover:shadow-lg transition-all duration-300 py-2 p-4 max-w-sm border-slate-200 border`}
    >
      <div className={`${isSelf ? "font-thin" : ""}`}>
        {isSelf ? "Your request:" : ""} {receiverName}
      </div>
      <div className="flex flex-col gap-1 pt-2 p-1 pl-0 text-xs">
        <div className="flex flex-col gap-1 md:flex-row items-start">
          <div className="flex flex-row gap-2">
            <p className="md:hidden">From:</p>
            <p>{startLocation} </p>
          </div>{" "}
          <span className="hidden md:block"> - </span>{" "}
          <div className="flex flex-row gap-2">
            <p className="md:hidden">To:</p>
            <p>{endLocation}</p>{" "}
          </div>
        </div>
        <p className="flex flex-row gap-2 items-center justify-start">
          <p className="">
            {moment(
              (isSelf ? senderDate : receiverDate) +
                " " +
                (isSelf ? senderTime : time),
              "DD-MM-yyyy HH:m"
            ).format("DD MMM - h:mm A")}
          </p>
        </p>
      </div>
    </motion.a>
  );
};

export default UHaulCard;
