import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OverriddenTimer from "../pages/OverriddenTimer";
import Cookies from "js-cookie";

const getTimeLeft = () => {
  const target = new Date("2025-10-22T20:00:00+05:30");
  const now = new Date();
  return target - now;
};

const TimerGate = ({ children }) => {
  const [timerEnded, setTimerEnded] = useState(getTimeLeft() <= 0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!timerEnded) {
      const interval = setInterval(() => {
        if (getTimeLeft() <= 0) {
          setTimerEnded(true);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerEnded]);

  useEffect(() => {
    if (timerEnded && location.pathname !== "/") {
      navigate("/");
    }
  }, [timerEnded, navigate, location.pathname]);

  if (!timerEnded) {
    const hasSecretAccess = Cookies.get("bunkmate_secret_access") === "true";
    if (location.pathname === "/secret" && hasSecretAccess) {
      return children; // Allow access to /secret if cookie is set
    }
    // For all other routes, show the timer page
    return <OverriddenTimer />;
  }
  
  return children;
};

export default TimerGate;