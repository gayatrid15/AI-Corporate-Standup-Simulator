import React from "react";
import styled from "styled-components";

export default function VoiceOrb() {
  return (
    <StyledWrapper>
      <div className="orb-container">
        <div className="orb">
          <div className="orb-inner" />
          <div className="orb-inner" />
        </div>
      </div>
    </StyledWrapper>
  );
}
// const StyledWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;

//   .orb-container {
//     position: relative;
//     width: 220px;
//     height: 220px;

//     display: flex;
//     justify-content: center;
//     align-items: center;

//     overflow: hidden;
//     border-radius: 50%;

//     rotate: 90deg;

//     cursor: pointer;

//     filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.45))
//       drop-shadow(0 0 18px rgba(37, 99, 235, 0.45));

//     transition: all 0.35s ease;
//   }

//   .orb {
//     position: absolute;

//     width: 200px;

//     aspect-ratio: 1;

//     border-radius: 50%;

//     background: #040b16;

//     filter: blur(24px);

//     transition: all 0.35s ease;
//   }

//   .orb-container:hover .orb {
//     width: 220px;
//   }

//   .orb-inner {
//     position: absolute;

//     left: -120%;
//     top: -25%;

//     width: 160%;

//     aspect-ratio: 1;

//     border-radius: 50%;

//     /* light ocean blue */
//     background: #3583f8;

//     clip-path: polygon(
//       50% 0%,
//       61% 35%,
//       98% 35%,
//       68% 57%,
//       79% 91%,
//       50% 70%,
//       21% 91%,
//       32% 57%,
//       2% 35%,
//       39% 35%
//     );

//     animation: rotate 6s linear infinite;

//     transition: all 0.35s ease;

//     opacity: 0.9;
//   }

//   .orb-inner:nth-child(2) {
//     left: auto;
//     right: -120%;

//     top: auto;
//     bottom: -25%;

//     /* deep ocean blue */
//     background: #3dc8ff;

//     animation-duration: 8s;

//     clip-path: polygon(
//       20% 0%,
//       0% 20%,
//       30% 50%,
//       0% 80%,
//       20% 100%,
//       50% 70%,
//       80% 100%,
//       100% 80%,
//       70% 50%,
//       100% 20%,
//       80% 0%,
//       50% 30%
//     );

//     opacity: 0.8;
//   }

//   .orb-container:hover .orb .orb-inner {
//     width: 170%;
//   }

//   @keyframes rotate {
//     0% {
//       transform: rotate(0deg);
//     }

//     100% {
//       transform: rotate(360deg);
//     }
//   }
// `;

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .orb-container {
    position: relative;
    width: 220px;
    height: 220px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 50%;
    rotate: 90deg;
    cursor: pointer;

    filter: drop-shadow(0 0 10px rgba(100, 232, 255, 0.45))
      drop-shadow(0 0 10px rgba(3, 22, 190, 0.45));

    transition: all 0.35s ease;
  }

  .orb {
    position: absolute;
    width: 200px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #050505;
    filter: blur(24px);

    transition: all 0.35s ease;
  }

  .orb-container:hover .orb {
    width: 220px;
  }

  .orb-inner {
    position: absolute;
    left: -120%;
    top: -25%;

    width: 160%;
    aspect-ratio: 1;
    border-radius: 50%;

    background: #1ccaff;

    clip-path: polygon(
      50% 0%,
      61% 35%,
      98% 35%,
      68% 57%,
      79% 91%,
      50% 70%,
      21% 91%,
      32% 57%,
      2% 35%,
      39% 35%
    );

    animation: rotate 15s linear infinite;
    transition: all 0.35s ease;
  }

  .orb-inner:nth-child(2) {
    left: auto;
    right: -120%;
    top: auto;
    bottom: -25%;

    background: #014aaa;

    animation-duration: 20s;

    clip-path: polygon(
      20% 0%,
      0% 20%,
      30% 50%,
      0% 80%,
      20% 100%,
      50% 70%,
      80% 100%,
      100% 80%,
      70% 50%,
      100% 20%,
      80% 0%,
      50% 30%
    );
  }

  .orb-container:hover .orb .orb-inner {
    width: 170%;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;
