import styled from "styled-components";

export default function OceanOrb() {
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

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  .orb-container {
    position: relative;

    width: 260px;
    height: 260px;

    display: flex;
    justify-content: center;
    align-items: center;

    overflow: hidden;

    border-radius: 50%;

    rotate: 90deg;

    cursor: pointer;

    background: radial-gradient(
      circle at center,
      rgba(10, 25, 45, 0.95),
      rgba(2, 6, 23, 1)
    );

    border: 1px solid rgba(125, 211, 252, 0.08);

    backdrop-filter: blur(24px);

    filter: drop-shadow(0 0 14px rgba(56, 189, 248, 0.35))
      drop-shadow(0 0 28px rgba(37, 99, 235, 0.25));

    box-shadow:
      inset 0 0 25px rgba(255, 255, 255, 0.02),
      inset 0 0 80px rgba(56, 189, 248, 0.06);

    transition: all 0.4s ease;
  }

  .orb-container::before {
    content: "";

    position: absolute;

    inset: -20px;

    border-radius: 50%;

    background: radial-gradient(
      circle,
      rgba(56, 189, 248, 0.12),
      rgba(37, 99, 235, 0.05),
      transparent 70%
    );

    filter: blur(30px);

    z-index: 0;

    animation: pulseGlow 5s ease-in-out infinite;
  }

  .orb {
    position: absolute;

    width: 220px;

    aspect-ratio: 1;

    border-radius: 50%;

    background: #050816;

    overflow: hidden;

    filter: blur(18px);

    transition: all 0.4s ease;
  }

  .orb-container:hover .orb {
    width: 240px;
  }

  .orb-inner {
    position: absolute;

    left: -120%;
    top: -25%;

    width: 160%;

    aspect-ratio: 1;

    border-radius: 50%;

    background: linear-gradient(135deg, #7dd3fc, #38bdf8, #0ea5e9);

    opacity: 0.9;

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

    animation: rotate 7s linear infinite;

    transition: all 0.4s ease;
  }

  .orb-inner:nth-child(2) {
    left: auto;
    right: -120%;

    top: auto;
    bottom: -25%;

    background: linear-gradient(135deg, #2563eb, #1d4ed8, #0f172a);

    opacity: 0.85;

    animation-duration: 10s;

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

  .orb-container:hover .orb-inner {
    width: 170%;
  }

  .orb-container:hover {
    transform: scale(1.03);

    filter: drop-shadow(0 0 18px rgba(56, 189, 248, 0.5))
      drop-shadow(0 0 35px rgba(37, 99, 235, 0.35));
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes pulseGlow {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.7;
    }

    50% {
      transform: scale(1.08);
      opacity: 1;
    }
  }
`;
