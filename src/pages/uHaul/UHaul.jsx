import { useContext, useEffect, useState } from "react";
import UHaulCard from "./UHaulCard";
import { RegistrationContext } from "../../middleware/RegistrationContext";
import mixpanel from "mixpanel-browser";
import { MixpanelEvents } from "../../lib/mixpanel";
import axios from "axios";
import { ENDPOINTS } from "../../lib/constants";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

const Uhaul = () => {
  const registrationContext = useContext(RegistrationContext);
  const {
    userToken,
    email,
    name,
    phoneNo,
    selectedDate,
    selectedTime,
    destination,
    source,
    pendingRequestDetails,
    requireDriver,
    setName,
    setEmail,
    setMatchedUsers,
    setMatchedCount,
    matchedUsers,
    setPendingRequestDetails,
  } = registrationContext;
  const [uHaulMatches, setUHaulMatches] = useState(matchedUsers);
  useEffect(() => {
    const fetchUHaulRequestsWithSimilarTimes = async () => {
      const pittsburgh2peer = JSON.parse(
        localStorage.getItem("pittsburgh2peer")
      );
      if (pittsburgh2peer) {
        const decoded = jwtDecode(pittsburgh2peer.credential);
        const { name, email, picture, given_name } = decoded;
        setName(name);
        setEmail(email);
      }
      const fetchUHaulRequestBody = {
        token: userToken,
        email: email,
        date: moment(pendingRequestDetails?.date)
          .set("year", moment().year())
          .format("DD-MM-YYYY"),
        time: moment(pendingRequestDetails?.time, "HH:mm").format("HH:mm"),
        startLocation: pendingRequestDetails?.source,
        canDrive: pendingRequestDetails?.personWillingToDrive,
        endLocation: pendingRequestDetails?.destination,
        dayRange: "2",
      };

      try {
        const response = await axios.post(
          process.env.REACT_APP_BASE_API_URL +
            ENDPOINTS.POST_GetAllUHaulRequests,
          fetchUHaulRequestBody
        );

        setMatchedUsers(response.data.data);
        setUHaulMatches(response.data);
        setMatchedCount(response.data.length);
        mixpanel.track(MixpanelEvents.USER_GOT_SUCCESS_SCREEN, {
          matches: response.data.length,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchUHaulRequestsWithSimilarTimes();
  }, [userToken, pendingRequestDetails]);

  useEffect(() => {
    const pittsburgh2peer = JSON.parse(localStorage.getItem("pittsburgh2peer"));
    if (pittsburgh2peer) {
      const decoded = jwtDecode(pittsburgh2peer.credential);
      const { name, email, picture, given_name } = decoded;
      setName(name);
      setEmail(email);
    }
    const fetchMyUHaulRequests = async () => {
      const fetchMyUhaulRequestsBody = {
        token: userToken,
        email: email,
      };

      try {
        const response = await axios.post(
          process.env.REACT_APP_BASE_API_URL + ENDPOINTS.POST_GetMyUHaulOffers,
          fetchMyUhaulRequestsBody
        );

        setPendingRequestDetails(response.data.pendingRequestDetails);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMyUHaulRequests();
  }, [userToken]);
  return (
    <div className="flex flex-col justify-center w-full gap-2 items-center p-8">
      <div className="flex flex-col items-center w-full">
        <UHaulCard
          startLocation={pendingRequestDetails?.startLocation}
          endLocation={pendingRequestDetails?.endLocation}
          senderTime={pendingRequestDetails?.time}
          time={moment(pendingRequestDetails?.time, "HH:mm").format("HH:mm")}
          driverRequired={pendingRequestDetails?.personWillingToDrive}
          senderDate={pendingRequestDetails?.date}
          receiverName={name}
          phoneNo={phoneNo}
          isSelf
        />
      </div>
      <div className="flex items-center max-w-sm py-4 font-bold">
        Matched Requests
      </div>
      <div className="flex flex-col w-full items-center max-w-sm gap-2">
        {matchedUsers?.length ? (
          matchedUsers.map(
            ({
              name: receiverName,
              startLocation,
              endLocation,
              time,
              personWillingtoDrive,
              date,
              phoneNo,
            }) => {
              return (
                <UHaulCard
                  name={name}
                  startLocation={startLocation}
                  endLocation={endLocation}
                  time={time}
                  driverRequired={personWillingtoDrive}
                  receiverDate={date}
                  receiverName={receiverName}
                  senderTime={pendingRequestDetails?.time}
                  phoneNo={phoneNo}
                  senderDate={pendingRequestDetails?.date}
                />
              );
            }
          )
        ) : (
          <div className="text-lg font-medium">
            <p>
              Keep calm and be patient. Nobody has signed up with this slot yet.
              🤞
            </p>
            <p className="text-sm font-light py-4">
              Please check back in a day. We're working on solutions to notify
              you in the meanwhile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Uhaul;
