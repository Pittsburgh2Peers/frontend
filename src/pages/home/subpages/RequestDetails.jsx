import { InputNumber, Radio } from "antd";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { RegistrationContext } from "../../../middleware/RegistrationContext";
import {
  P2PServices,
  peopleCounts,
  trolleyCounts,
} from "../../../lib/constants";

import mixpanel from "mixpanel-browser";
import { MixpanelEvents } from "../../../lib/mixpanel";

const RequestDetails = () => {
  const registrationContext = useContext(RegistrationContext);
  const {
    numberOfPeople,
    numberOfTrolleys,
    setNumberOfPeople,
    setNumberOfTrolleys,
    service,
    requireDriver,
    setRequireDriver,
    selectedDate,
    selectedTime,
  } = registrationContext;

  useEffect(() => {
    mixpanel.track(MixpanelEvents.USER_SELECTED_DATE, {
      date: new Date(
        new Date(selectedDate).setFullYear(new Date().getFullYear())
      )
        .toLocaleDateString("en-GB")
        .replaceAll(/\//g, "-"),
    });
    mixpanel.track(MixpanelEvents.USER_SELECTED_TIME, { time: selectedTime });
  }, []);

  const [numberOfPeopleSelection, setNumberOfPeopleSelection] = useState(
    parseInt(numberOfPeople, 10) < 4 ? parseInt(numberOfPeople, 10) : 4
  );
  const [numberOfTrolleysSelection, setNumberOfTrolleysSelection] = useState(
    parseInt(numberOfTrolleys, 10) < 8
      ? parseInt(numberOfTrolleys, 10)
      : "More than 8"
  );

  if (service === P2PServices.FIND_A_RIDE) {
    return (
      <motion.div
        className="flex flex-col items-center p-8 gap-4"
        key="request-details-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
      >
        <div className="flex flex-col justify-center gap-4 items-center">
          <div>You'd be a group of how many people?</div>
          <Radio.Group
            value={numberOfPeopleSelection}
            buttonStyle="solid"
            onChange={(e) => {
              if (e.target.value === 4) {
                setNumberOfPeople(null);
                setNumberOfPeopleSelection(4);
              } else {
                setNumberOfPeople(e.target.value);
                setNumberOfPeopleSelection(e.target.value);
              }
            }}
          >
            {peopleCounts.map((count) => (
              <Radio.Button key={count} value={count}>
                {count === 4 ? "4 or more" : count}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        {numberOfPeopleSelection === 4 ? (
          <InputNumber
            type="number"
            placeholder="Enter number of people"
            value={numberOfPeople}
            min={0}
            onChange={(value) => {
              setNumberOfPeople(value);
            }}
            className="w-full p-1 border text-base max-w-sm focus:outline-cmu-red rounded"
          />
        ) : null}
        {numberOfPeople !== 0 ? (
          <motion.div
            className="flex flex-col justify-center gap-4 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={"number-of-trolleys-container"}
          >
            <div>And a total of how many trolleys?</div>
            <Radio.Group
              value={numberOfTrolleysSelection}
              buttonStyle="solid"
              onChange={(e) => {
                if (e.target.value === "More than 8") {
                  setNumberOfTrolleys(null);
                  setNumberOfTrolleysSelection("More than 8");
                } else {
                  setNumberOfTrolleys(e.target.value);
                  setNumberOfTrolleysSelection(e.target.value);
                }
              }}
            >
              {trolleyCounts.map((count) => (
                <Radio.Button key={count} value={count}>
                  {count === "More than 8" ? "8 or more" : count}
                </Radio.Button>
              ))}
            </Radio.Group>
          </motion.div>
        ) : null}
        {numberOfTrolleysSelection === "More than 8" ? (
          <InputNumber
            type="number"
            placeholder="Enter number of trolleys"
            min={0}
            value={numberOfTrolleys}
            onChange={(value) => setNumberOfTrolleys(value)}
            className="w-full p-1 border text-base max-w-sm focus:outline-cmu-red rounded"
          />
        ) : null}
      </motion.div>
    );
  }
  if (service === P2PServices.REQUEST_A_UHAUL) {
    return (
      <motion.div
        className="flex flex-col items-center p-8 gap-4"
        key="request-details-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
      >
        <div>Would you require someone to drive the U-Haul?</div>
        <Radio.Group
          value={requireDriver}
          buttonStyle="solid"
          onChange={(e) => {
            setRequireDriver(e.target.value);
            console.log(e.target.value, e);
          }}
        >
          <Radio.Button value={true}>Yes</Radio.Button>
          <Radio.Button value={false}>No</Radio.Button>
        </Radio.Group>
      </motion.div>
    );
  }
};

export default RequestDetails;
