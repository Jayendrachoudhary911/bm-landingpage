import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OverriddenTimer from "../pages/OverriddenTimer";
import Cookies from "js-cookie";

const getTimeLeft = () => {
  const target = new Date("2025-10-23T20:30:00+05:30");
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
    const hasAdminAccess = Cookies.get("bunkmate_admin_access") === "true";
    const hasSecretAccess = Cookies.get("bunkmate_secret_access") === "true";
    if (hasAdminAccess) {
      return children; // Admins can access all routes
    }
    if (location.pathname === "/secret" && hasSecretAccess) {
      return children; // Secret access only for /secret
    }
    // For all other routes, show the timer page
    return <OverriddenTimer />;
  }

  return children;
};

export default TimerGate;