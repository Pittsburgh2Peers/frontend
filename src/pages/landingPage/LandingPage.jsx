import { CarOutlined, TruckOutlined } from "@ant-design/icons";
import GoogleLoginButton from "../login/GoogleSignIn";
import { motion } from "framer-motion";
import { useState } from "react";

const LandingPage = ({ setIsSignedIn }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000); // Adjust the duration as needed
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center md:mt-8 p-8">
      <p className="pb-4 border-b border-cmu-red">
        Take a breath. Moving into Pittsburgh is gonna be easy, now that you're
        here.
      </p>
      <p>
        {" "}
        Use your <span className="font-semibold">Andrew ID</span> to sign in.
      </p>
      <GoogleLoginButton setIsSignedIn={setIsSignedIn} />
      <div className="pb-4 border-b border-cmu-red w-full"></div>
      <p>
        We're gonna help you get on your feet with our network of current
        students.
      </p>
      <div className="flex flex-col w-full justify-start p-4 gap-4">
        <p className="">
          <CarOutlined className="pr-4" />
          Find a ride from the airport
        </p>

        <motion.p className="" onClick={handleAnimation}>
          <motion.span>
            <TruckOutlined className="pr-4" />
          </motion.span>
          Request a U-Haul
        </motion.p>
      </div>
    </div>
  );
};

export default LandingPage;
