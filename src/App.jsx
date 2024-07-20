import "./App.css";
import TopBar from "./core/TopBar";
import { ConfigProvider } from "antd";
import Footer from "./core/Footer";
import Home from "./pages/home/Home";
import P2PRegistrationContext from "./middleware/RegistrationContext";
import { useEffect, useState } from "react";
import LandingPage from "./pages/landingPage/LandingPage";
import { jwtDecode } from "jwt-decode";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Carpool from "./pages/carpool/Carpool";
import AboutUs from "./pages/about/AboutUs";
import Profile from "./pages/profile/Profile";

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const checkLocalStorage = () => {
    const pittsburgh2peer = JSON.parse(localStorage.getItem("pittsburgh2peer"));
    if (pittsburgh2peer) {
      const decoded = jwtDecode(pittsburgh2peer.credential);
      const { exp } = decoded;
      setIsSignedIn(Date.now() < exp * 1000);
      return Date.now() < exp * 1000;
    }
  };

  const checkIsSignedIn = () => {
    const pittsburgh2peer = JSON.parse(localStorage.getItem("pittsburgh2peer"));
    if (pittsburgh2peer) {
      const decoded = jwtDecode(pittsburgh2peer.credential);
      const { exp } = decoded;
      return Date.now() < exp * 1000;
    }
    return false;
  };

  useEffect(() => {
    checkLocalStorage();
  }, []);

  return (
    <div className="App">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#C41230",
            borderRadius: 2,

            // Alias Token
            colorBgContainer: "#fff",
          },
        }}
      >
        <P2PRegistrationContext>
          <Router>
            <TopBar />
            <Routes>
              <Route
                path="/"
                element={
                  checkIsSignedIn() ? (
                    <Home />
                  ) : (
                    <LandingPage setIsSignedIn={setIsSignedIn} />
                  )
                }
              />
              <Route
                path="/home"
                element={
                  checkIsSignedIn() ? (
                    <Home />
                  ) : (
                    <LandingPage setIsSignedIn={setIsSignedIn} />
                  )
                }
              />
              <Route
                path="/landing"
                element={<LandingPage setIsSignedIn={setIsSignedIn} />}
              />
              <Route
                path="/carpool"
                element={
                  checkIsSignedIn() ? (
                    <Carpool />
                  ) : (
                    <LandingPage setIsSignedIn={setIsSignedIn} />
                  )
                }
              />
              <Route
                path="/profile"
                element={
                  checkIsSignedIn() ? (
                    <Profile />
                  ) : (
                    <LandingPage setIsSignedIn={setIsSignedIn} />
                  )
                }
              />
              <Route path="/about" element={<AboutUs />} />
            </Routes>
            <Footer />
          </Router>
        </P2PRegistrationContext>
      </ConfigProvider>
    </div>
  );
};

export default App;
