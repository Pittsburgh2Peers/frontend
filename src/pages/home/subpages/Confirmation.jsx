import { motion } from "framer-motion";
import { useContext } from "react";
import { RegistrationContext } from "../../../middleware/RegistrationContext";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const Confirmation = () => {
  const registrationContext = useContext(RegistrationContext);
  const {
    source,
    destination,
    service,
    selectedDate,
    numberOfPeople,
    numberOfTrolleys,
    name,
    email,
    picture,
    givenName,
    requireDriver,
  } = registrationContext;

  console.log(
    source,
    destination,
    service,
    selectedDate,
    numberOfPeople,
    numberOfTrolleys,
    name,
    email,
    picture,
    givenName,
    requireDriver
  );
  const navigate = useNavigate();
  const handleGo = () => {
    navigate("/carpool");
  };

  const shareWithFriends = () => {
    window.open(
      "https://api.whatsapp.com/send?text=https://pittsburgh2peers.azurewebsites.net/"
    );
  };
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
        title="That's it!"
        subTitle="Thanks for registering with us. We have found 4 others arriving within a 2 hour interval from when you land. Let's get you all connected!"
        extra={[
          <Button type="primary" key="meet-similar-slots" onClick={handleGo}>
            Let's go
          </Button>,
          <Button key="share" onClick={shareWithFriends}>
            Share with friends
          </Button>,
        ]}
      />
    </motion.div>
  );
};

export default Confirmation;
