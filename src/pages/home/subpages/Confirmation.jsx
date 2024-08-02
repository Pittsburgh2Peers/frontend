import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { RegistrationContext } from "../../../middleware/RegistrationContext";
import { Result, Button, Flex, Rate, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import { ENDPOINTS, P2PServices } from "../../../lib/constants";
import axios from "axios";
import mixpanel from "mixpanel-browser";
import { MixpanelEvents } from "../../../lib/mixpanel";
import moment from "moment";

const Confirmation = () => {
  const navigate = useNavigate();
  const handleGoCarpool = () => {
    navigate("/carpool");
  };
  const handleGoUHaul = () => {
    navigate("/uhaul");
  };
  const registrationContext = useContext(RegistrationContext);
  const [matchedCount, setMatchedCount] = useState(-1);
  const {
    email,
    source,
    destination,
    selectedDate,
    selectedTime,
    setMatchedUsers,
    requireDriver,
    service,
  } = registrationContext;
  const shareWithFriends = () => {
    mixpanel.track(MixpanelEvents.USER_CLICKED_SHARE, { platform: "Any" });
    if (navigator.share) {
      navigator
        .share({
          title: "Pittsburgh2Peers",
          url: "https://pittsburgh2peers.vercel.app/",
        })
        .catch(console.error);
    } else {
      alert("Share not supported on this browser, use a compatible device.");
    }
  };

  const customIcons = {
    1: <FrownOutlined />,
    2: <FrownOutlined />,
    3: <MehOutlined />,
    4: <SmileOutlined />,
    5: <SmileOutlined />,
  };

  const fetchUsersWithSimilarTimes = async () => {
    const fetchCarpoolRequestBody = {
      token: localStorage.getItem("p2puserToken"),
      email: email,
      startLocation: source,
      date: moment(selectedDate)
        .set("year", moment().year())
        .format("DD-MM-YYYY"),
      time: moment(selectedTime, "HH:mm").format("HH:mm"),
      timeRange: 3,
    };

    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_API_URL +
          ENDPOINTS.POST_GetAllCarPoolRequests,
        fetchCarpoolRequestBody
      );

      setMatchedUsers(response.data.data);
      console.log(response.data.data.length);
      setMatchedCount(response.data.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUHaulRequestsWithSimilarTimes = async () => {
    const fetchUHaulRequestBody = {
      token: localStorage.getItem("p2puserToken"),
      email: email,
      date: moment(selectedDate)
        .set("year", moment().year())
        .format("DD-MM-YYYY"),
      time: moment(selectedTime, "HH:m").format("HH:mm"),
      startLocation: source,
      canDrive: requireDriver,
      endLocation: destination,
      dayRange: "2",
    };

    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_API_URL + ENDPOINTS.POST_GetAllUHaulRequests,
        fetchUHaulRequestBody
      );

      setMatchedUsers(response.data.data);
      setMatchedCount(response.data.data.length);
      mixpanel.track(MixpanelEvents.USER_GOT_SUCCESS_SCREEN, {
        matches: response.data.length,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateRating = (value) => {
    mixpanel.track(MixpanelEvents.USER_RATED_PLATFORM, {
      rating: value,
    });
  };

  useEffect(() => {
    if (service === P2PServices.FIND_A_RIDE) {
      fetchUsersWithSimilarTimes();
    } else {
      fetchUHaulRequestsWithSimilarTimes();
    }
  }, []);

  if (service === P2PServices.FIND_A_RIDE) {
    return (
      <motion.div
        className="flex flex-col justify-center gap-4 items-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
        key={"confirmation-container"}
      >
        <Result
          status="success"
          title="Thanks for registering with us."
          className="max-w-sm"
          subTitle={
            <Skeleton
              active
              loading={matchedCount === -1}
              className="w-full max-w-sm"
            >
              {matchedCount !== 0 ? (
                <div>
                  <p>
                    {" "}
                    We have found {matchedCount} others arriving within a +/- 3
                    hour interval from when you land.{" "}
                  </p>
                  <p className="font-semibold text-black pb-2">
                    {"[ "}
                    {moment(selectedDate).format("ddd, MMM D")}, at{" "}
                    {moment(selectedTime, "HH:mm").format("h:mm A")}
                    {" ]"}
                  </p>
                  <p>Let's get you all connected!</p>
                </div>
              ) : (
                <p>
                  {`We couldn't find anyone in the same timeslot as you yet. Check again in a couple of hours. `}
                  <p className="font-semibold text-black pb-2">
                    {"[ "}
                    {moment(selectedDate).format("ddd, MMM D")}, at{" "}
                    {moment(selectedTime, "HH:mm").format("h:mm A")}
                    {" ]"}
                  </p>
                  <a
                    className="text-cmu-red hover:text-cmu-red hover:border-b hover:border-cmu-red "
                    href="https://api.whatsapp.com/send?text=https://pittsburgh2peers.vercel.app/"
                    onClick={() =>
                      mixpanel.track(MixpanelEvents.USER_CLICKED_SHARE, {
                        platform: "Whatsapp",
                      })
                    }
                  >
                    Consider sharing the app
                  </a>
                  {` with your circles to improve everyone's chances :)`}
                </p>
              )}
            </Skeleton>
          }
          extra={[
            matchedCount !== 0 ? (
              <Button
                type="primary"
                key="meet-similar-slots"
                onClick={handleGoCarpool}
              >
                Let's go
              </Button>
            ) : null,
            <Button key="share" onClick={shareWithFriends}>
              Share with friends
            </Button>,
            <Flex gap="middle" vertical className="pt-8">
              <p className="text-base">How was your experience?</p>
              <Rate
                defaultValue={5}
                character={({ index = 0 }) => customIcons[index + 1]}
                onChange={updateRating}
              />
            </Flex>,
          ]}
        />
      </motion.div>
    );
  } else {
    return (
      <motion.div
        className="flex flex-col justify-center gap-4 items-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
        key={"confirmation-container"}
      >
        <Result
          status="success"
          title="Thanks for registering with us."
          className="max-w-sm"
          subTitle={
            <Skeleton active loading={matchedCount === -1}>
              {matchedCount !== 0 ? (
                <div>
                  <p>
                    {`We have found ${matchedCount} other ${
                      matchedCount > 1 ? "s" : " user"
                    } requesting a U-Haul within a +/- 2
                    day interval from when you land.`}
                  </p>
                  <p className="font-semibold text-black pb-2">
                    {"[ "}
                    {moment(selectedDate).format("ddd, MMM D")}, at{" "}
                    {moment(selectedTime, "HH:mm").format("h:mm A")}
                    {" ]"}
                  </p>
                  <p>Let's get you all connected!</p>
                </div>
              ) : (
                <p>
                  {`We couldn't find anyone in the same timeslot as you yet. Check again in a couple of hours. `}
                  <p className="font-semibold text-black pb-2">
                    {"[ "}
                    {moment(selectedDate).format("ddd, MMM D")}, at{" "}
                    {moment(selectedTime, "HH:mm").format("h:mm A")}
                    {" ]"}
                  </p>
                  <a
                    className="text-cmu-red hover:text-cmu-red hover:border-b hover:border-cmu-red "
                    href="https://api.whatsapp.com/send?text=https://pittsburgh2peers.vercel.app/"
                    onClick={() =>
                      mixpanel.track(MixpanelEvents.USER_CLICKED_SHARE, {
                        platform: "Whatsapp",
                      })
                    }
                  >
                    Consider sharing the app
                  </a>
                  {` with your circles to improve everyone's chances :)`}
                </p>
              )}
            </Skeleton>
          }
          extra={[
            matchedCount !== 0 ? (
              <Button
                type="primary"
                key="meet-similar-slots"
                onClick={handleGoUHaul}
              >
                Let's go
              </Button>
            ) : null,
            <Button key="share" onClick={shareWithFriends}>
              Share with friends
            </Button>,
            <Flex gap="middle" vertical className="pt-8">
              <p className="text-base">How was your experience?</p>
              <Rate
                defaultValue={5}
                character={({ index = 0 }) => customIcons[index + 1]}
              />
            </Flex>,
          ]}
        />
      </motion.div>
    );
  }
};

export default Confirmation;
