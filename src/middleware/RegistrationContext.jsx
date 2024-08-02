import React, { useState } from "react";
import {
  ENDPOINTS,
  LookingFor,
  P2PServices,
  navigation,
  stages,
} from "../lib/constants";
import { Toaster, toast } from "sonner";
import axios from "axios";
import mixpanel from "mixpanel-browser";
import { MixpanelEvents } from "../lib/mixpanel";
import {
  parsePhoneNumber,
  getCountryCallingCode,
  formatPhoneNumber,
} from "react-phone-number-input";
import moment from "moment";

const RegistrationContext = React.createContext();
export const P2PRegistrationContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [stage, setStage] = useState(stages.HOMEPAGE); // Where the flow starts
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  ); // the date of arrival in Pitt // format - iii d LLL
  const [selectedTime, setSelectedTime] = useState(moment().format("HH:mm")); // the time of arrival in Pitt // format - hh:mm
  const [lookingFor, setLookingFor] = useState(LookingFor.RIDE); // Whether they are looking for a ride or for passengers
  const [numberOfPeople, setNumberOfPeople] = useState(null); // Number of people in the party
  const [numberOfTrolleys, setNumberOfTrolleys] = useState(null); // Number of trolleys in the party
  const [service, setService] = useState(null); // Whether the user wants a ride or UHaul
  const [name, setName] = useState(""); // User's name from google oauth
  const [email, setEmail] = useState(""); // User's email from google oauth
  const [picture, setPicture] = useState(""); // User's picture url from google oauth
  const [givenName, setGivenName] = useState(""); // User's given name from google oauth
  const [source, setSource] = useState(""); // Source location selected by the user
  const [destination, setDestination] = useState(""); // destination location picked by the user
  const [requireDriver, setRequireDriver] = useState(null); // whether the user needs a driver for the Uhaul
  const [phoneNumber, setPhoneNumber] = useState(""); // the user input phone number
  const [contactConsent, setContactConsent] = useState(false); // consent to share user data
  const [userToken, setUserToken] = useState(""); // token to make api calls provided by the backend
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [isUserEligibleForRequests, setIsUserEligibleForRequests] =
    useState(false);
  const [pendingRequestDetails, setPendingRequestDetails] = useState(null);
  const [carPoolRequested, setCarPoolRequested] = useState(false); // State to track if a carpool has been requested
  const [uHaulRequested, setUHaulRequested] = useState(false); // State to track if a UHaul has been requested
  const [isBetaUser, setIsBetaUser] = useState(false);
  const [isUHaulEnabledForAll, setIsUHaulEnabledForAll] = useState(false); // State to track if UHaul service is enabled for all users
  const [profileHasPhoneNumber, setProfileHasPhoneNumber] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleNext = async () => {
    switch (stage) {
      case stages.CONTACT_INFO:
        if (service === P2PServices.FIND_A_RIDE) {
          registerUserRequest();
        } else {
          userUHaulRequest();
        }
        const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
        const updateUserProfileBody = {
          token: localStorage.getItem("p2puserToken"),
          email: email,
          phoneNo: formatPhoneNumber(phoneNumber),
          countryCode: "+" + getCountryCallingCode(parsedPhoneNumber.country),
        };

        if (!profileHasPhoneNumber) {
          const response = await axios.put(
            process.env.REACT_APP_BASE_API_URL +
              ENDPOINTS.POST_UpdateUserProfile,
            updateUserProfileBody
          );
          if (response.data.errorCode === 0) {
            toast("Succesfully updated profile!");
          } else {
            toast("Failed to update profile!");
          }
          break;
        }

      default:
        setStage(navigation[stage].next);
    }
  };

  const handlePrev = () => {
    switch (stage) {
      case stages.CONFIRMATION:
        setStage(stages.HOMEPAGE);
        break;
      default:
        setStage(navigation[stage].prev);
    }
  };

  const onLookingForChange = (lookingFor) => {
    setLookingFor(lookingFor);
  };

  const userUHaulRequest = async () => {
    const uHaulRequestBody = {
      token: localStorage.getItem("p2puserToken"),
      email: email,
      date: moment(selectedDate)
        .set("year", moment().year())
        .format("DD-MM-YYYY"),
      time: moment(selectedTime, "HH:mm").format("HH:mm"),
      startLocation: source,
      endLocation: destination,
      canDrive: !requireDriver,
    };

    try {
      const response = await axios.put(
        process.env.REACT_APP_BASE_API_URL + ENDPOINTS.POST_UHaulRequest,
        uHaulRequestBody
      );

      const { errorCode } = response.data;
      const userMessage =
        errorCode === "0"
          ? "Succesfully raised a U-Haul request"
          : "Error: Oops, something went wrong.";
      toast(userMessage);
      setStage(navigation[stage].next);
    } catch (error) {
      console.log(error);
    }
  };

  const registerUserRequest = async () => {
    const carpoolRequestBody = {
      token: localStorage.getItem("p2puserToken"),
      email: email,
      date: moment(selectedDate)
        .set("year", moment().year())
        .format("DD-MM-YYYY"),
      time: moment(selectedTime, "HH:mm").format("HH:mm"),
      noOfPassengers: numberOfPeople,
      noOfTrolleys: numberOfTrolleys,
      startLocation: source,
      endLocation: destination,
    };

    try {
      const response = await axios.put(
        process.env.REACT_APP_BASE_API_URL + ENDPOINTS.POST_CarPoolRequest,
        carpoolRequestBody
      );
      mixpanel.track(MixpanelEvents.USER_COMPLETED_REQUEST, {
        service: service,
      });
      const { errorCode } = response.data;
      const userMessage =
        errorCode === "0"
          ? "Succesfully raised a carpool request"
          : errorCode === "467"
          ? "Error: Request for this user already exists"
          : "Error: Oops, something went wrong.";
      toast(userMessage);
      setStage(navigation[stage].next);
    } catch (error) {
      console.error("Error during token generation:", error);
    }
  };

  return (
    <RegistrationContext.Provider
      value={{
        numberOfPeople,
        setNumberOfPeople,
        numberOfTrolleys,
        setNumberOfTrolleys,
        handleDateChange,
        handleTimeChange,
        handleNext,
        handlePrev,
        onLookingForChange,
        user,
        setUser,
        stage,
        setStage,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        lookingFor,
        setLookingFor,
        service,
        setService,
        name,
        setName,
        email,
        setEmail,
        picture,
        setPicture,
        givenName,
        setGivenName,
        source,
        setSource,
        destination,
        setDestination,
        requireDriver,
        setRequireDriver,
        phoneNumber,
        setPhoneNumber,
        contactConsent,
        setContactConsent,
        userToken,
        setUserToken,
        matchedUsers,
        setMatchedUsers,
        isUserEligibleForRequests,
        setIsUserEligibleForRequests,
        pendingRequestDetails,
        setPendingRequestDetails,
        carPoolRequested,
        setCarPoolRequested,
        uHaulRequested,
        setUHaulRequested,
        isBetaUser,
        setIsBetaUser,
        isUHaulEnabledForAll,
        setIsUHaulEnabledForAll,
        profileHasPhoneNumber,
        setProfileHasPhoneNumber,
      }}
    >
      {children}
      <Toaster />
    </RegistrationContext.Provider>
  );
};

export default P2PRegistrationContext;
export { RegistrationContext };
