import {
  CarOutlined,
  TruckOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { ENDPOINTS, P2PServices } from "../../../lib/constants";
import { useContext, useEffect, useState } from "react";
import { RegistrationContext } from "../../../middleware/RegistrationContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mixpanel from "mixpanel-browser";
import { MixpanelEvents } from "../../../lib/mixpanel";
import moment from "moment";

const Services = ({ service, setStage, setService }) => {
  const registrationContext = useContext(RegistrationContext);
  const {
    isUserEligibleForRequests,
    email,
    setIsUserEligibleForRequests,
    pendingRequestDetails,
    setPendingRequestDetails,
    userToken,
    carPoolRequested,
    setCarPoolRequested,
    uHaulRequested,
    setUHaulRequested,
    isBetaUser,
    setIsBetaUser,
    isUHaulEnabledForAll,
    setIsUHaulEnabledForAll,
    setSource,
    setDestination,
    setNumberOfPeople,
    setNumberOfTrolleys,
    setRequireDriver,
    setSelectedDate,
    setSelectedTime,
  } = registrationContext;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleViewCarpool = () => {
    navigate("/carpool");
  };
  const handleViewUHaul = () => {
    navigate("/uhaul");
  };

  const fetchMyCarpoolRequests = async () => {
    const checkEligibilityBody = {
      token: userToken,
      email: email,
    };
    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_API_URL + ENDPOINTS.POST_GetMyCarPoolOffers,
        checkEligibilityBody
      );
      console.log(response);
      setSelectedDate(
        moment(response.data.pendingRequestDetails?.date, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        )
      );
      setSelectedTime(
        moment(response.data.pendingRequestDetails?.time, "HH:mm").format(
          "HH:mm"
        )
      );
      setNumberOfPeople(response.data.pendingRequestDetails?.noOfPassengers);
      setNumberOfTrolleys(response.data.pendingRequestDetails?.noOfTrolleys);
      setSource(response.data.pendingRequestDetails?.startLocation);
      setDestination(response.data.pendingRequestDetails?.endLocation);
    } catch (error) {
      console.log(error);
    }
  };

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
      setSelectedDate(
        moment(response.data.pendingRequestDetails?.date, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        )
      );
      setSelectedTime(
        moment(response.data.pendingRequestDetails?.time, "HH:mm").format(
          "HH:mm"
        )
      );
      setRequireDriver(
        !response.data.pendingRequestDetails?.personWillingToDrive
      );
      setSource(response.data.pendingRequestDetails?.startLocation);
      setDestination(response.data.pendingRequestDetails?.endLocation);
    } catch (error) {
      console.error(error);
    }
  };
  const handleServiceClick = (service) => {
    mixpanel.track(MixpanelEvents.USER_SELECTED_SERVICE, { service: service });
    setService(service);

    switch (service) {
      case P2PServices.FIND_A_RIDE:
        fetchMyCarpoolRequests();
        break;
      case P2PServices.REQUEST_A_UHAUL:
        fetchMyUHaulRequests();
        break;
    }
  };

  useEffect(() => {
    const checkIfCarpoolShown = async () => {
      const checkEligibilityBody = {
        token: userToken,
        email: email,
      };
      try {
        if (email && userToken) {
          const response = await axios.post(
            process.env.REACT_APP_BASE_API_URL +
              ENDPOINTS.POST_GetMyCarPoolOffers,
            checkEligibilityBody
          );

          setPendingRequestDetails(response.data.pendingRequestDetails);

          if (response.data.errorCode === "0") {
            setIsUserEligibleForRequests(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkIfCarpoolShown();
  }, [email, setIsUserEligibleForRequests, userToken]);

  useEffect(() => {
    const checkFlags = async () => {
      setLoading(true);
      try {
        if (email && userToken) {
          const getFlagsRequestBody = {
            token: userToken,
            email: email,
          };
          const response = await axios.post(
            process.env.REACT_APP_BASE_API_URL + ENDPOINTS.POST_GetFlags,
            getFlagsRequestBody
          );

          setCarPoolRequested(response.data.carPoolRequested);
          setUHaulRequested(response.data.uHaulRequested);
          setIsBetaUser(response.data.isBeta);
          setIsUHaulEnabledForAll(response.data.isUHaulEnabledForAll);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    checkFlags();
  }, [userToken]);

  useEffect(() => {
    const fetchMyCarpoolRequests = async () => {
      const checkEligibilityBody = {
        token: userToken,
        email: email,
      };
      try {
        const response = await axios.post(
          process.env.REACT_APP_BASE_API_URL +
            ENDPOINTS.POST_GetMyCarPoolOffers,
          checkEligibilityBody
        );
        setSelectedDate(
          moment(response.pendingRequestDetails?.date).format("DD-MM-YYYY")
        );
        setSelectedTime(
          moment(response.pendingRequestDetails?.time).format("HH:mm")
        );
        setNumberOfPeople(response.pendingRequestDetails?.noOfPassengers);
        setNumberOfTrolleys(response.pendingRequestDetails?.noOfTrolleys);
        setSource(response.pendingRequestDetails?.startLocation);
        setDestination(response.pendingRequestDetails?.endLocation);
      } catch (error) {
        console.log(error);
      }
    };

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
        setSelectedDate(
          moment(response.pendingRequestDetails?.date).format("DD-MM-YYYY")
        );
        setSelectedTime(
          moment(response.pendingRequestDetails?.time).format("HH:mm")
        );
        setRequireDriver(response.pendingRequestDetails?.personWillingToDrive);
        setSource(response.pendingRequestDetails?.startLocation);
        setDestination(response.pendingRequestDetails?.endLocation);
      } catch (error) {
        console.error(error);
      }

      switch (service) {
        case P2PServices.FIND_A_RIDE:
          fetchMyCarpoolRequests();
          break;
        case P2PServices.REQUEST_A_UHAUL:
          fetchMyUHaulRequests();
          break;
      }
    };
  }, [service, userToken]);

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col items-center justify-center p-4"
        key="services-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
      >
        <div className="flex flex-row w-full justify-center items-center p-4">
          Welcome to Pittsburgh. Let's take some weight off those shoulders. How
          can we help?
        </div>

        <div className="flex flex-col justify-center w-full gap-4 p-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
            <Button
              size={"large"}
              className={`${
                service === P2PServices.FIND_A_RIDE
                  ? "text-cmu-red border-cmu-red"
                  : "hover:text-cmu-red hover:border-cmu-red"
              } w-full max-w-sm`}
              loading={loading}
              onClick={() => handleServiceClick(P2PServices.FIND_A_RIDE)}
            >
              <CarOutlined />
              {carPoolRequested ? `Modify your ride request` : `Find a ride`}
            </Button>
            <Button
              size={"large"}
              disabled={!(isBetaUser || isUHaulEnabledForAll)}
              className={`${
                service === P2PServices.REQUEST_A_UHAUL
                  ? "text-cmu-red border-cmu-red"
                  : "hover:text-cmu-red hover:border-cmu-red"
              } w-full max-w-sm`}
              loading={loading}
              onClick={() => handleServiceClick(P2PServices.REQUEST_A_UHAUL)}
            >
              <TruckOutlined />
              {uHaulRequested
                ? `Modify your U-Haul request`
                : `Request a U-Haul`}
            </Button>
          </div>
          <div
            className={`flex flex-col md:flex-row items-center justify-center gap-4 ${
              carPoolRequested || uHaulRequested
                ? "border-t border-cmu-red md:border-0 pt-4 md:pt-0"
                : ""
            }`}
          >
            {carPoolRequested ? (
              <div className=" w-full max-w-sm md:border-0 md:pt-0">
                <Button
                  size={"large"}
                  className="w-full max-w-sm"
                  onClick={() => handleViewCarpool()}
                  loading={loading}
                >
                  <UsergroupAddOutlined />
                  View Carpool Mates
                </Button>
              </div>
            ) : null}
            {uHaulRequested ? (
              <div className="w-full max-w-sm md:border-0 md:pt-0">
                <Button
                  size={"large"}
                  className="w-full max-w-sm"
                  onClick={() => handleViewUHaul()}
                  loading={loading}
                >
                  <UsergroupAddOutlined />
                  View matched U-Haul Requests
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Services;
