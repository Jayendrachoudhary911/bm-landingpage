import React, { useState, useEffect } from "react";
import { ReactTyped } from "react-typed";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if needed
import Cookies from "js-cookie";

// 1. Custom Hook for Screen Size 📱
const useScreenSize = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile: width < 768, width };
};

// Helper to calculate remaining time (No changes needed)
const getTimeLeft = () => {
  const target = new Date("2025-10-22T20:00:00+05:30");
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const fluidEase = [0.16, 1, 0.3, 1];

// ---

// 2. Responsive Navbar component
const Navbar = () => {
  const { isMobile } = useScreenSize();
  const mobileStyles = {
    padding: "1rem 1.5rem", // Reduced padding
    fontSize: "1.1rem", // Smaller font size
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0, filter: "blur(8px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, ease: fluidEase }}
      style={{
        width: "100%",
        padding: "1.2rem 2.5rem",
        backdropFilter: "blur(10px)",
        color: "#ffffff",
        fontWeight: 700,
        fontSize: "1.4rem",
        letterSpacing: "2px",
        textTransform: "uppercase",
        ...(isMobile ? mobileStyles : {}), // Apply mobile styles if needed
      }}
    >
      BunkMates
    </motion.nav>
  );
};

// ---

// 3. Responsive Timer component
const Timer = ({ timeLeft }) => {
  const { isMobile } = useScreenSize();

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: isMobile ? "1rem" : "4rem", // Smaller gap on mobile
    marginTop: isMobile ? "2rem" : "3rem",
  };

  const labelStyle = {
    fontSize: isMobile ? "0.7rem" : "0.9rem", // Smaller label
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const valueStyle = {
    fontSize: isMobile ? "2.5rem" : "5rem", // Significantly smaller number font
    fontWeight: 800,
    color: "#ffffff",
    fontFamily: "Poppins, sans-serif",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: fluidEase }}
      style={containerStyle}
    >
      {Object.entries(timeLeft).map(([label, value], i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.8, ease: fluidEase }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <motion.span
            key={value}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
            style={valueStyle}
          >
            {value.toString().padStart(2, "0")}
          </motion.span>
          <span style={labelStyle}>{label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

// ---

// 4. Responsive PasswordBox component
const PasswordBox = ({ onSuccess, onBack }) => {
  const [inputs, setInputs] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [pressedKey, setPressedKey] = useState(null);
  const [encryptPhase, setEncryptPhase] = useState(false);
  const [correctPassword, setCorrectPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const { isMobile } = useScreenSize();

    useEffect(() => {
    const fetchPassword = async () => {
      try {
        const docRef = doc(db, "pass", "secret-code");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCorrectPassword(docSnap.data().content);
          setAdminPassword(docSnap.data().admin_pass || "");
        } else {
          setError("Password not set.");
        }
      } catch (err) {
        setError("Failed to fetch password.");
      } finally {
        setLoading(false);
      }
    };
    fetchPassword();
  }, []);

  const handleKeyPress = (key) => {
    if (verifying) return;
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 180);

    if (key === "←") {
      const lastFilled = inputs.findLastIndex((val) => val !== "");
      if (lastFilled !== -1) {
        const updated = [...inputs];
        updated[lastFilled] = "";
        setInputs(updated);
      }
    } else if (key === "✔") {
      handleSubmit();
    } else if (/^[A-Z0-9]$/.test(key)) {
      const firstEmpty = inputs.findIndex((val) => val === "");
      if (firstEmpty !== -1) {
        const updated = [...inputs];
        updated[firstEmpty] = key.toUpperCase();
        setInputs(updated);
      }
    }
  };

  const handleSubmit = () => {
    if (inputs.includes("")) {
      setError("Complete the password first!");
      return;
    }
    setVerifying(true);
    setError("");
    setEncryptPhase(true);

    setTimeout(() => {
      const entered = inputs.join("");
      if (entered === correctPassword) {
        Cookies.set("bunkmate_secret_access", "true", { expires: 7 });
        setTimeout(() => onSuccess(), 2200);
      } else if (entered === adminPassword) {
        Cookies.set("bunkmate_admin_access", "true", { expires: 7 });
        setTimeout(() => onSuccess(), 2200);
      } else {
        setEncryptPhase(false);
        setTimeout(() => {
          setVerifying(false);
          setError("Incorrect password. Try again!");
          setInputs(["", "", "", "", "", ""]);
        }, 400);
      }
    }, 2500);
  };

  // Keyboard layout adapted for responsiveness
  const rows = [
    "1234567890".split(""),
    "qwertyuiop".split(""),
    "asdfghjkl".split(""),
    ["⇧", "z", "x", "c", "v", "b", "n", "m", "⌫"],
    ["?123", ",", "space", ".", "⏎"],
  ];
  
  // Responsive styles for password boxes
  const passBoxStyle = {
    width: isMobile ? "2.5rem" : "3rem",
    height: isMobile ? "2.7rem" : "3.2rem",
    fontSize: isMobile ? "1.5rem" : "2rem",
    gap: isMobile ? "0.5rem" : "1rem",
  };

  // Responsive styles for keyboard buttons
  const keyButtonStyle = {
    padding: isMobile ? "0.6rem 0" : "0.8rem 0",
    fontSize: isMobile ? "0.9rem" : "1rem",
    borderRadius: "0.5rem",
    // Remove fixed maxWidth for flexibility
    maxWidth: 'none', 
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.8rem",
        marginTop: "3rem",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "absolute",
          top: isMobile ? "-8rem" : "-10rem", // Adjusted position for mobile
          left: isMobile ? "0.8rem" : "1.5rem",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#fff",
          padding: "0.5rem 1.2rem",
          borderRadius: "0.4rem",
          cursor: "pointer",
          fontSize: "0.9rem",
          letterSpacing: "1px",
        }}
      >
        ← Back
      </motion.button>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center",
          color: "#bbb",
          fontSize: isMobile ? "0.9rem" : "1rem", // Smaller quote on mobile
          maxWidth: isMobile ? "90%" : "80%", // Wider on mobile
          marginBottom: "1rem",
        }}
      >
        “Every password hides a secret. Let’s see if you can unlock this one.”
      </motion.div>

      {!verifying ? (
        <>
          {/* Password Boxes */}
          <motion.div
            layout
            transition={{ layout: { duration: 0.6, ease: "easeOut" } }}
            style={{ display: "flex", gap: passBoxStyle.gap }}
          >
            {inputs.map((val, i) => (
              <motion.div
                key={i}
                layout
                animate={{ scale: val ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  ...passBoxStyle, // Apply responsive styles
                  textAlign: "center",
                  fontWeight: 700,
                  color: "#fff",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(36px)",
                  boxShadow: val
                    ? "0 0 10px rgba(255,255,255,0.15)"
                    : "0 0 5px rgba(255,255,255,0.05)",
                }}
              >
                {val}
              </motion.div>
            ))}
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{ color: "#ff6666", fontSize: "0.9rem" }}
            >
              {error}
            </motion.p>
          )}

          {/* Custom Keyboard */}
          <motion.div
            layout
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "0.4rem" : "0.5rem", // Tighter gap on mobile
              width: "95%",
              maxWidth: "600px",
              marginTop: isMobile ? "2rem" : "5rem", // Reduced margin on mobile
              userSelect: "none",
              paddingBottom: "1.5rem",
            }}
          >
            {rows.map((row, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: isMobile ? "0.4rem" : "0.5rem", // Tighter gap on mobile
                }}
              >
                {row.map((key) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      handleKeyPress(
                        key === "⏎"
                          ? "✔"
                          : key === "⌫"
                          ? "←"
                          : key.toUpperCase()
                      )
                    }
                    style={{
                      ...keyButtonStyle, // Apply base responsive styles
                      flex:
                        key === "space"
                          ? 3.5 // Slightly more space-efficient
                          : key === "⏎" || key === "⌫"
                          ? 1.5 // Slightly more space-efficient
                          : 1,
                      // Remove fixed max width to allow full flex growth
                      background:
                        pressedKey === key
                          ? "linear-gradient(135deg, #24242425, #2d2d2d74)"
                          : "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      backdropFilter: "blur(36px)",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      userSelect: "none",
                      boxShadow:
                        pressedKey === key
                          ? "0 0 15px rgba(0,200,255,0.6)"
                          : "0 0 6px rgba(255,255,255,0.05)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {key === "space" ? "" : key}
                  </motion.button>
                ))}
              </div>
            ))}
          </motion.div>
        </>
      ) : (
        <motion.div
          key="verifying"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
          transition={{ duration: 0.8, repeat: encryptPhase ? Infinity : 0 }}
          style={{
            position: "relative",
            fontSize: isMobile ? "1rem" : "1.4rem", // Smaller verifying text
            color: "#ffffffff",
            letterSpacing: "1px",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          {encryptPhase ? (
            <>
              <motion.div
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  fontSize: "1.2rem",
                  color: "#00bfff",
                  textShadow: "0 0 15px rgba(0,200,255,0.8)",
                }}
              >
                Encrypting &amp; Verifying
              </motion.div>
              <motion.div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "4px",
                  background:
                    "linear-gradient(90deg, transparent, #00ffff, transparent)",
                  top: "50%",
                  left: 0,
                  filter: "blur(4px)",
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </>
          ) : (
            "Verifying..."
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

// ---

const OverriddenTimer = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [timerEnded, setTimerEnded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [bgPulse, setBgPulse] = useState(false);
  const { isMobile } = useScreenSize(); // Use screen size in main component

  useEffect(() => {
    if (Cookies.get("bunkmate_secret_access") === "true") {
      window.location.href = "/secret";
    }
  }, []);

    useEffect(() => {
    if (Cookies.get("bunkmate_admin_access") === "true") {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = getTimeLeft();
      setTimeLeft(updated);
      if (
        updated.days === 0 &&
        updated.hours === 0 &&
        updated.minutes === 0 &&
        updated.seconds === 0
      ) {
        clearInterval(interval);
        setTimeout(() => setTimerEnded(true), 1000);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pulseInterval = setInterval(() => setBgPulse((prev) => !prev), 4000);
    return () => clearInterval(pulseInterval);
  }, []);

// ...existing code...
const handleSuccess = () => {
  // If admin access, set admin cookie and redirect to homepage
  if (Cookies.get("bunkmate_admin_access") === "true") {
    window.location.href = "/";
    return;
  }
  // Otherwise, set secret access and redirect to /secret
  Cookies.set("bunkmate_secret_access", "true", { expires: 7 }); // 7 days expiry
  window.location.href = "/secret";
};
// ...existing code...

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: fluidEase }}
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden", // Prevent horizontal overflow on mobile
        transition: "background 2s ease-in-out",
      }}
    >

      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.40, // Adjust for readability
          background: "#000"
        }}
        src="assets/bg_video.mp4"
      />


      <Navbar />

      {/* Parallax zoom effect */}
      <motion.main
        initial={{ scale: 1.05 }}
        animate={{ scale: showPassword ? 0.98 : 1.02 }}
        transition={{ duration: 1.2, ease: fluidEase }}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
        }}
      >
        <AnimatePresence mode="wait">
          {!showPassword ? (
            <motion.div
              key="timerView"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 1, ease: fluidEase }}
            >
              {!timerEnded ? (
                <>
                  <ReactTyped
                    strings={[
                      "Countdown to Launch",
                      "Preparing for Takeoff...",
                      "BunkMates Arrives Soon",
                      "Get Ready to Bunk",
                      "Bunk The Chaos, Keep the Fun!"
                    ]}
                    typeSpeed={50}
                    backSpeed={40}
                    backDelay={1400}
                    loop
                    showCursor
                    cursorChar="|"
                    style={{
                      fontSize: isMobile ? "1.2rem" : "2rem", // Smaller font size
                      fontWeight: 600,
                      color: "#e6e6e6",
                      fontFamily: "Inter, sans-serif",
                      letterSpacing: "1px",
                    }}
                  />
                  <Timer timeLeft={timeLeft} />
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setShowPassword(true)}
                    transition={{ type: "spring", stiffness: 200 }}
                    style={{
                      background: "#11111129",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      padding: "0.8rem 2rem",
                      borderRadius: "0.4rem",
                      fontWeight: 600,
                      marginTop: isMobile ? "2rem" : "3rem", // Reduced margin
                      letterSpacing: "1px",
                      cursor: "pointer",
                    }}
                  >
                    Try Your Luck
                  </motion.button>
                </>
              ) : (
                <motion.div
                  key="launch"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: fluidEase }}
                  style={{
                    fontSize: isMobile ? "1.8rem" : "2.8rem", // Smaller font size
                    fontWeight: 800,
                    color: "#ffffff",
                    marginTop: "4rem",
                    letterSpacing: "1px",
                  }}
                >
                  Launching BunkMates...
                </motion.div>
              )}
            </motion.div>
          ) : (
            <PasswordBox
              key="passwordUI"
              onSuccess={handleSuccess}
              onBack={() => setShowPassword(false)}
            />
          )}
        </AnimatePresence>
      </motion.main>
      

    </motion.div>
  );
};

export default OverriddenTimer;