import { Button, Input } from "antd";
import { useContext, useEffect } from "react";
import { RegistrationContext } from "../../middleware/RegistrationContext";
import { jwtDecode } from "jwt-decode";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  parsePhoneNumber,
  getCountryCallingCode,
  formatPhoneNumber,
} from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";
import axios from "axios";
import { ENDPOINTS } from "../../lib/constants";
import { formatPhoneNumberIntl } from "react-phone-number-input";

const Profile = () => {
  const registrationContext = useContext(RegistrationContext);
  const {
    name,
    givenName,
    phoneNumber,
    email,
    setPicture,
    setGivenName,
    setPhoneNumber,
    setName,
    setEmail,
    userToken,
    setProfileHasPhoneNumber,
  } = registrationContext;

  useEffect(() => {
    const pittsburgh2peer = JSON.parse(localStorage.getItem("pittsburgh2peer"));
    if (pittsburgh2peer) {
      const decoded = jwtDecode(pittsburgh2peer.credential);
      const { name, email, picture, given_name } = decoded;
      setName(name);
      setEmail(email);
      setPicture(picture);
      setGivenName(given_name);
    }
  }, [setName, setEmail, setGivenName, setPicture]);
  const navigate = useNavigate();

  useEffect(() => {
    getUserProfileDetails();
  }, [userToken]);

  const getUserProfileDetails = async () => {
    const userProfileDetails = {
      token: localStorage.getItem("p2puserToken"),
      email: email,
    };
    const response = await axios.post(
      process.env.REACT_APP_BASE_API_URL + ENDPOINTS.POST_GetUserProfileDetails,
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

  const updateUserProfile = async () => {
    const parsedPhoneNumber = parsePhoneNumber(phoneNumber);

    const updateProfileBody = {
      token: localStorage.getItem("p2puserToken"),
      email: email,
      name: name,
      phoneNo: formatPhoneNumber(phoneNumber),
      countryCode: "+" + getCountryCallingCode(parsedPhoneNumber.country),
    };

    try {
      const response = await axios.put(
        process.env.REACT_APP_BASE_API_URL + ENDPOINTS.POST_UpdateUserProfile,
        updateProfileBody
      );

      const result =
        response.data.errorCode === "0"
          ? "Succesfully updated profile."
          : "Profile update failed.";
      toast(result);
    } catch (error) {
      console.log(error);
    }
  };

  const onSave = () => {
    // Add updateProfileBody here
    const debounce = (func, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func(...args);
        }, delay);
      };
    };

    const saveToast = debounce(() => updateUserProfile(), 1000);
    saveToast();
  };

  const logoutFromP2P = () => {
    localStorage.removeItem("pittsburgh2peer");
    localStorage.removeItem("p2puserToken");
    navigate("/landing");
    toast("Logged out successfully");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 p-8 max-w-screen-lg">
      <div className="flex flex-col items-start max-w-sm w-full gap-4 justify-center">
        <h2 className="text-xl font-bold">Hi {givenName},</h2>
        <p>
          You can setup contact info right here, be mindful to update it in case
          it changes as you reach Pitt.
        </p>
      </div>
      <div className="flex flex-col items-start max-w-sm w-full gap-4 justify-center">
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Enter your email"
          value={email}
          // onChange={(e) => setEmail(e.target.value)}
          disabled
        />
        <PhoneInput
          placeholder="Enter phone number"
          value={phoneNumber}
          defaultCountry="US"
          className="w-full border border-slate-300 p-2 max-w-sm text-sm"
          onChange={setPhoneNumber}
        />
        <div className="flex flex-row justify-start gap-4 items-center">
          <Button onClick={onSave}>Save</Button>
          {/* <Button onClick={logoutFromP2P} className="bg-red-500 text-white">
            Logout
          </Button> */}
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default Profile;
