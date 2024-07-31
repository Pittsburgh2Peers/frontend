import {
  LeftOutlined as LeftArrow,
  RightOutlined as RightArrow,
} from "@ant-design/icons";
import { Button } from "antd";
import { AnimatePresence } from "framer-motion";
import { useContext, useEffect, useCallback } from "react";
import {
  ENDPOINTS,
  P2PServices,
  stages,
  stepNumbers,
} from "../../lib/constants";
import { RegistrationContext } from "../../middleware/RegistrationContext";
import {
  ArrivalDetails,
  Confirmation,
  ContactInfo,
  FindARide,
  LookingFor,
  RequestDetails,
  Services,
  SourceDestinationSelect,
} from "./subpages";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import mixpanel from "mixpanel-browser";
import { MixpanelEvents } from "../../lib/mixpanel";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import "./home.css";

const Home = () => {
  const registrationContext = useContext(RegistrationContext);
  const {
    stage,
    setStage,
    onLookingForChange,
    selectedDate,
    handleDateChange,
    selectedTime,
    setPhoneNumber,
    setProfileHasPhoneNumber,
    handleTimeChange,
    handlePrev,
    handleNext,
    service,
    setService,
    setPicture,
    setGivenName,
    setName,
    setEmail,
    numberOfPeople,
    numberOfTrolleys,
    source,
    requireDriver,
    destination,
    contactConsent,
    userToken,
    email,
    setIsUserEligibleForRequests,
  } = registrationContext || {};

  const navigate = useNavigate();

  useEffect(() => {
    const pittsburgh2peer = JSON.parse(localStorage.getItem("pittsburgh2peer"));
    if (pittsburgh2peer) {
      const decoded = jwtDecode(pittsburgh2peer.credential);
      const { name, email, picture, given_name } = decoded;
      setName(name);
      setEmail(email);
      setPicture(picture);
      setGivenName(given_name);
    } else {
      navigate("/landing");
    }
  }, [setName, setEmail, setGivenName, setPicture]);
  useEffect(() => {
    if (stage === stages.FIND_A_RIDE || stage === stages.REQUEST_A_UHAUL) {
      setTimeout(() => {
        setStage(stages.ARRIVAL_DETAILS);
      }, 2000);
    }
  }, [stage, setStage]);

  const validateServiceSelection = useCallback(() => {
    return !(
      service === P2PServices.FIND_A_RIDE ||
      service === P2PServices.REQUEST_A_UHAUL
    );
  }, [service]);

  useEffect(() => {
    validateServiceSelection();
  }, [service, validateServiceSelection]);

  useEffect(() => {
    const getUserProfileDetails = async () => {
      const userProfileDetails = {
        token: localStorage.getItem("p2puserToken"),
        email: email,
      };
      const response = await axios.post(
        process.env.REACT_APP_BASE_API_URL +
          ENDPOINTS.POST_GetUserProfileDetails,
        userProfileDetails
      );

      if (
        response.data?.userDetails?.phoneNo &&
        response.data?.userDetails?.countryCode
      ) {
        setPhoneNumber(
          formatPhoneNumberIntl(
            response.data.userDetails?.countryCode +
              response.data.userDetails?.phoneNo
          )
        );
        setProfileHasPhoneNumber(true);

        if (response.data?.userDetails?.name) {
          setName(response.data?.userDetails?.name);
        }
      }
    };
    getUserProfileDetails();
    checkIsUserEligibleForRequests();
  }, [userToken]);
  const validateArrivalDetails = () => {
    return false;
  };

  const validateRequestDetails = () => {
    const checkCarpoolFlowDisabled = !(numberOfPeople && numberOfTrolleys);
    const checkUHaulFlowDisabled = requireDriver === null;
    if (checkCarpoolFlowDisabled && checkUHaulFlowDisabled === false) {
      mixpanel.track(MixpanelEvents.USER_SELECTED_REQUEST_DETAILS, {
        people: numberOfPeople,
        trolleys: numberOfTrolleys,
        driverNeeded: requireDriver,
      });
    }
    return checkCarpoolFlowDisabled && checkUHaulFlowDisabled;
  };

  const validateSourceDestination = () => {
    return !(source && destination);
  };

  const checkIsUserEligibleForRequests = async () => {
    const checkEligibilityBody = {
      token: userToken,
      email: email,
    };
    try {
      if (email && userToken) {
        const response = await axios.post(
          process.env.REACT_APP_BASE_API_URL +
            ENDPOINTS.POST_UserProfileComplete,
          checkEligibilityBody
        );
        setIsUserEligibleForRequests(response.data.eligible);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isNextDisabled = () => {
    switch (stage) {
      case stages.HOMEPAGE:
        return validateServiceSelection();
      case stages.FIND_A_RIDE:
        return false;
      case stages.REQUEST_A_UHAUL:
        return false;
      case stages.ARRIVAL_DETAILS:
        return validateArrivalDetails();
      case stages.ARRIVAL_DETAILS_TIME:
        return false;
      case stages.LOOKING_FOR:
        return false;
      case stages.REQUEST_DETAILS:
        return validateRequestDetails();
      case stages.SOURCE_DESTINATION:
        return validateSourceDestination();
      case stages.CONTACT_INFO:
        return !contactConsent;
      case stages.CONFIRMATION:
        return false;
      default:
        return false;
    }
  };

  const renderStage = () => {
    switch (stage) {
      case stages.HOMEPAGE:
        return (
          <Services
            service={service}
            setStage={setStage}
            setService={setService}
          />
        );
      case stages.FIND_A_RIDE:
      case stages.REQUEST_A_UHAUL:
        return <FindARide />;
      case stages.ARRIVAL_DETAILS:
        return (
          <ArrivalDetails
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
            selectedTime={selectedTime}
            handleTimeChange={handleTimeChange}
            service={service}
          />
        );
      case stages.LOOKING_FOR:
        return <LookingFor onLookingForChange={onLookingForChange} />;
      case stages.REQUEST_DETAILS:
        return <RequestDetails />;
      case stages.SOURCE_DESTINATION:
        return <SourceDestinationSelect />;
      case stages.CONTACT_INFO:
        return <ContactInfo />;
      case stages.CONFIRMATION:
        return <Confirmation />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-screen-lg w-full">
      <AnimatePresence>
        {renderStage()}
        {stage !== stages.FIND_A_RIDE && stage !== stages.REQUEST_A_UHAUL && (
          <div
            className={`flex flex-row max-w-screen-lg z-50 bg-white ${
              stage !== stages.HOMEPAGE ? "justify-between" : "justify-between"
            } rounded-lg items-center w-full max-w-screen-lg p-4 fixed bottom-8`}
            key={"homepage-container"}
          >
            <Button
              size={"large"}
              onClick={handlePrev}
              className={`rounded-lg ${
                stage !== stages.HOMEPAGE ? "" : "invisible"
              }`}
            >
              <LeftArrow />
              {stage !== stages.CONFIRMATION ? "Previous" : "Back to home"}
            </Button>
            {stage !== stages.CONFIRMATION && stage !== stages.HOMEPAGE ? (
              <span className="text-sm text-cmu-iron-gray">{`Step ${
                stepNumbers[stage]
              } / ${Object.keys(stepNumbers).length}`}</span>
            ) : null}
            <Button
              onClick={handleNext}
              size={"large"}
              className={`rounded-lg bg-cmu-red text-white ${
                stage !== stages.CONFIRMATION ? "" : "invisible"
              }`}
              disabled={isNextDisabled()}
            >
              {stage !== stages.CONTACT_INFO ? "Next" : "Submit"}

              <RightArrow />
            </Button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
