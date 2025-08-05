import React from "react";

const GeometricBackground = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1440 800"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill="none" stroke="rgba(0, 0, 0, 0.69)" strokeWidth="1">
        <path d="M0 100 L1440 0" />
        <path d="M0 300 L1440 100" />
        <path d="M0 500 L1440 300" />
        <path d="M0 700 L1440 500" />
      </g>

      <circle cx="10%" cy="20%" r="1.5" fill="black" opacity="0.08">
        <animateTransform
          attributeName="transform"
          type="translate"
          from="0 0"
          to="10 10"
          dur="6s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="80%" cy="60%" r="1.5" fill="black" opacity="0.08">
        <animateTransform
          attributeName="transform"
          type="translate"
          from="0 0"
          to="-10 -10"
          dur="8s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default GeometricBackground;
