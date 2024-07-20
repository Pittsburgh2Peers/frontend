import { Input, Checkbox } from "antd";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { RegistrationContext } from "../../../middleware/RegistrationContext";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const ContactInfo = () => {
  const registrationContext = useContext(RegistrationContext);
  const {
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    contactConsent,
    setContactConsent,
  } = registrationContext;
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleCheckboxChange = (e) => {
    setContactConsent(e.target.checked);
  };

  const validatePhone = (value) => {
    if (!value) {
      setPhoneError("Please input your phone number!");
    } else if (!/^\d{10}$/.test(value)) {
      setPhoneError("Phone number must be 10 digits!");
    } else {
      setPhoneError("");
    }
  };

  const validateEmail = (value) => {
    if (!value) {
      setEmailError("Please input your email!");
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("The input is not valid E-mail!");
    } else {
      setEmailError("");
    }
  };

  const handlePhoneChange = (value) => {
    // const value = e.target.value;
    setPhoneNumber(value);
    if (phoneError) {
      validatePhone(value);
    }
    // validatePhone(value);
  };

  //   const handleEmailChange = (e) => {
  //     const value = e.target.value;
  //     setEmail(value);
  //     if (emailError) {
  //       validateEmail(e.target.value);
  //     }
  //     // validateEmail(value);
  //   };

  const handlePhoneBlur = (e) => {
    validatePhone(e.target.value);
  };

  const handleEmailBlur = (e) => {
    validateEmail(e.target.value);
  };

  return (
    <motion.div
      className="flex flex-col justify-center gap-4 items-center p-8"
      key="contact-info-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
    >
      <div className="flex flex-col justify-center gap-4 items-center w-full">
        {/* <Input
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={handlePhoneChange}
          onBlur={handlePhoneBlur}
          allowClear
          className="w-full max-w-sm"
        />
        {phoneError && <div className="text-red-500 text-xs">{phoneError}</div>} */}
        <PhoneInput
          placeholder="Enter phone number"
          value={phoneNumber}
          defaultCountry="US"
          className="w-full border border-slate-300 p-2 max-w-sm text-sm"
          onChange={handlePhoneChange}
        />
        <Input
          placeholder="Email"
          value={email}
          //   onChange={handleEmailChange}
          //   onBlur={handleEmailBlur}
          //   allowClear
          disabled
          className="w-full max-w-sm"
        />
        {emailError && <div className="text-red-500 text-xs">{emailError}</div>}
        <Checkbox
          onChange={handleCheckboxChange}
          checked={contactConsent}
          className="max-w-sm"
        >
          I give consent to share contact details with other students matched
          based on my arrival times.
        </Checkbox>
      </div>
    </motion.div>
  );
};

export default ContactInfo;
