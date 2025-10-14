import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const fluidEase = [0.16, 1, 0.3, 1];
const BG_VIDEO_SRC = "assets/bg_video.mp4";

// --- Cookie Helpers ---
const SUBMISSION_COOKIE_NAME = 'secret_access_submitted';
const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
};
const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let c of ca) {
        c = c.trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
};

// --- Screen Size Hook ---
const useScreenSize = () => {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return { isMobile: width < 768, width };
};

// --- Timer Helper ---
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
const getRandomAvatarUrl = (seed) => `https://i.pravatar.cc/150?u=${seed}`;

// --- Navbar ---
const Navbar = () => {
    const { isMobile } = useScreenSize();
    const mobileStyles = {
        padding: "1rem 1.5rem",
        fontSize: "1.1rem",
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
                zIndex: 10,
                position: "relative",
                ...(isMobile ? mobileStyles : {}),
            }}
        >
            BunkMates
        </motion.nav>
    );
};

// --- Leaderboard ---
const Leaderboard = ({ users }) => {
    const { isMobile } = useScreenSize();
    const sortedUsers = users.sort((a, b) => a.timestamp?.toDate?.()?.getTime() - b.timestamp?.toDate?.()?.getTime());

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: fluidEase }}
            style={{
                width: "100%",
                padding: isMobile ? "1rem" : "2rem",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "1rem",
                backdropFilter: "blur(16px)",    
                maxHeight: "80vh",
                overflowY: "auto",
            }}
        >
            <h2 style={{
                textAlign: "center",
                fontSize: isMobile ? "1.5rem" : "2rem",
                marginBottom: "1rem",
                color: "#ffffffff",
            }}>🏆 Secret Access Leaderboard</h2>

            {sortedUsers.map((user, i) => (
                <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: i < sortedUsers.length - 1 ? "1px dashed rgba(255,255,255,0.2)" : "none",
                        gap: "15px",
                    }}
                >
                    <span style={{
                        fontSize: isMobile ? "1.1rem" : "1.4rem",
                        fontWeight: 700,
                        color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#fff",
                        width: isMobile ? "30px" : "40px",
                        textAlign: "center",
                    }}>#{i + 1}</span>

                    <img
                        src={getRandomAvatarUrl(user.name + user.email)}
                        alt="avatar"
                        style={{
                            width: isMobile ? "40px" : "50px",
                            height: isMobile ? "40px" : "50px",
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
                    />

                    <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 600, color: "#fff" }}>{user.name}</p>
                        <p style={{ margin: 0, fontSize: isMobile ? "0.75rem" : "0.9rem", color: "#ccc" }}>
                            Joined: {user.timestamp?.toDate?.()?.toLocaleTimeString() || "-"}
                        </p>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

// --- User Form ---
const UserForm = ({ onSubmissionSuccess }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { isMobile } = useScreenSize();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email) return setError("Name & Email required!");
        setError("");
        setLoading(true);

        try {
            await addDoc(collection(db, "secret-users"), { name, email, timestamp: serverTimestamp() });
            onSubmissionSuccess();
        } catch {
            setError("Failed to submit. Try again.");
            setLoading(false);
        }
    };

    const inputStyle = {
        padding: "0.8rem",
        borderRadius: "0.5rem",
        border: "1px solid #00bfff",
        background: "rgba(255,255,255,0.1)",
        color: "#fff",
        fontSize: "1rem",
        outline: "none",
        boxShadow: "0 0 6px rgba(0,191,255,0.3)",
    };

    return (
<motion.form
  onSubmit={handleSubmit}
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  transition={{ duration: 0.5, ease: fluidEase }}
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    width: isMobile ? "90%" : "400px",
    padding: "2rem",
    background: "rgba(0, 0, 0, 0.75)",
    borderRadius: "1.2rem",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px rgba(0, 191, 255, 0.3), 0 0 12px rgba(0, 191, 255, 0.2)",
    backdropFilter: "blur(8px)",
    position: "relative",
    overflow: "hidden",
  }}
>
  <h3 style={{
    textAlign: "center",
    color: "#00bfff",
    textShadow: "0 0 12px #00bfff, 0 0 24px rgba(0,191,255,0.5)",
    fontSize: isMobile ? "1.6rem" : "2rem",
    marginBottom: "1rem"
  }}>
    Enter the Secret World!
  </h3>

  <input
    type="text"
    placeholder="Your Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    disabled={loading}
    style={{
      padding: "0.8rem 1rem",
      borderRadius: "0.6rem",
      border: "1px solid rgba(0, 191, 255, 0.6)",
      background: "rgba(255, 255, 255, 0.05)",
      color: "#fff",
      fontSize: "1rem",
      outline: "none",
      boxShadow: "0 0 6px rgba(0, 191, 255, 0.3)",
      transition: "all 0.3s",
    }}
    onFocus={(e) => e.target.style.boxShadow = "0 0 12px #00bfff"}
    onBlur={(e) => e.target.style.boxShadow = "0 0 6px rgba(0, 191, 255, 0.3)"}
  />

  <input
    type="email"
    placeholder="Your Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    disabled={loading}
    style={{
      padding: "0.8rem 1rem",
      borderRadius: "0.6rem",
      border: "1px solid rgba(0, 191, 255, 0.6)",
      background: "rgba(255, 255, 255, 0.05)",
      color: "#fff",
      fontSize: "1rem",
      outline: "none",
      boxShadow: "0 0 6px rgba(0, 191, 255, 0.3)",
      transition: "all 0.3s",
    }}
    onFocus={(e) => e.target.style.boxShadow = "0 0 12px #00bfff"}
    onBlur={(e) => e.target.style.boxShadow = "0 0 6px rgba(0, 191, 255, 0.3)"}
  />

  {error && (
    <p style={{
      color: "#ff6b6b",
      textAlign: "center",
      fontSize: "0.9rem",
      textShadow: "0 0 4px #ff6b6b"
    }}>
      {error}
    </p>
  )}

  <motion.button
    type="submit"
    whileHover={{ scale: 1.05, boxShadow: "0 0 20px #00bfff, 0 0 40px rgba(0,191,255,0.5)" }}
    whileTap={{ scale: 0.95 }}
    disabled={loading}
    style={{
      padding: "0.8rem 1.5rem",
      background: loading ? "#007a99" : "#00bfff",
      color: "#000",
      border: "none",
      borderRadius: "0.6rem",
      fontWeight: 700,
      cursor: loading ? "not-allowed" : "pointer",
      fontSize: "1rem",
      transition: "all 0.3s",
      boxShadow: "0 0 8px #00bfff",
    }}
  >
    {loading ? "Submitting..." : "Submit & View Leaderboard"}
  </motion.button>
</motion.form>

    );
};

// --- Timer ---
const Timer = ({ timeLeft }) => {
    const { isMobile } = useScreenSize();
    const isEnded = Object.values(timeLeft).every(val => val === 0);

    const containerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: isMobile ? "1rem" : "4rem",
        marginTop: isMobile ? "2rem" : "3rem",
    };

    const labelStyle = {
        fontSize: isMobile ? "0.7rem" : "0.9rem",
        color: "#aaa",
        textTransform: "uppercase",
        letterSpacing: "1px",
    };

    const valueStyle = {
        fontSize: isMobile ? "2.5rem" : "5rem",
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

// --- Main Page ---
const SecretPage = () => {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaderboardUsers, setLeaderboardUsers] = useState([]);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
    const [timeLeft, setTimeLeft] = useState(getTimeLeft());
    const { isMobile } = useScreenSize();

    useEffect(() => {
        if (getCookie(SUBMISSION_COOKIE_NAME) === 'true') setShowLeaderboard(true);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchLeaderboard = async () => {
        setLoadingLeaderboard(true);
        try {
            const q = query(collection(db, "secret-users"), orderBy("timestamp", "asc"));
            const snapshot = await getDocs(q);
            setLeaderboardUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) { console.error(err); }
        finally { setLoadingLeaderboard(false); }
    };

    useEffect(() => { if (showLeaderboard) fetchLeaderboard(); }, [showLeaderboard]);

    const handleSubmissionSuccess = () => {
        setCookie(SUBMISSION_COOKIE_NAME, 'true', 30);
        setShowLeaderboard(true);
    };

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
                overflowX: "hidden",
                position: "relative",
            }}
        >
            {/* Background Video */}
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
                    opacity: 0.40,
                    background: "#000"
                }}
                src={BG_VIDEO_SRC}
            />

            {/* Overlay for readability */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "linear-gradient(120deg, rgba(0,0,0,0.6) 0%, rgba(10,10,30,0.3) 100%)",
                    zIndex: 1,
                    pointerEvents: "none",
                }}
            />

            <div style={{ position: "relative", zIndex: 2, minHeight: "100vh" }}>
                <Navbar />
                <div style={{
                    width: "100%",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: isMobile ? "1.5rem 0.5rem" : "3rem 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <h1 style={{
                        textAlign: "center",
                        color: "#ffffffff",
                        marginBottom: isMobile ? "2rem" : "4rem",
                        fontSize: isMobile ? "2rem" : "3rem",
                    }}>
                        The Secret BunkMates Hub
                    </h1>

                    <AnimatePresence mode="wait">
                        {!showLeaderboard ? (
                            <div key="form-view" style={{ display: "flex", justifyContent: "center" }}>
                                <UserForm onSubmissionSuccess={handleSubmissionSuccess} />
                            </div>
                        ) : (
                            <div key="leaderboard-view" style={{
                                display: "flex",
                                flexDirection: isMobile ? "column" : "row",
                                gap: isMobile ? "1rem" : "3rem",
                                alignItems: isMobile ? "center" : "flex-end",
                                justifyContent: "center",
                                width: "100%",
                            }}>
                                <div style={{ width: isMobile ? "90%" : "30%", minWidth: "250px" }}>
                                    <Timer timeLeft={timeLeft} />
                                </div>
                                <div style={{ width: isMobile ? "100%" : "70%", display: "flex", justifyContent: "right" }}>
                                    {loadingLeaderboard ? (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ color: "#ffffffff", fontSize: "1.2rem" }}>Loading Leaderboard...</motion.p>
                                    ) : (
                                        <Leaderboard users={leaderboardUsers} />
                                    )}
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default SecretPage;