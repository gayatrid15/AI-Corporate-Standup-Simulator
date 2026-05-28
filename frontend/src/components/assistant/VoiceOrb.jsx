import { useEffect, useRef, useState } from "react";

function VoiceOrb({ isListening }) {
  const [volume, setVolume] = useState(0);

  const streamRef = useRef(null);

  useEffect(() => {
    if (!isListening) {
      setVolume(0);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      return;
    }

    let animationFrame;

    const startMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        streamRef.current = stream;

        const audioContext = new AudioContext();

        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 128;

        const source = audioContext.createMediaStreamSource(stream);

        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const animate = () => {
          analyser.getByteFrequencyData(dataArray);

          let sum = 0;

          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }

          const avg = sum / dataArray.length;

          setVolume(avg);

          animationFrame = requestAnimationFrame(animate);
        };

        animate();
      } catch (err) {
        console.error(err);
      }
    };

    startMic();

    return () => {
      cancelAnimationFrame(animationFrame);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isListening]);

  return (
    <div className="orb-scene">
      {/* OUTER GLOW */}
      <div
        className="orb-aura"
        style={{
          transform: `scale(${1 + volume / 350})`,
          opacity: 0.55 + volume / 250,
        }}
      />

      {/* MAIN ORB */}
      <div
        className="premium-orb"
        style={{
          transform: `scale(${1 + volume / 500})`,
        }}
      >
        {/* INTERNAL WAVES */}
        <div className="energy-wave wave-a"></div>
        <div className="energy-wave wave-b"></div>
        <div className="energy-wave wave-c"></div>

        {/* LIGHT SWEEP */}
        <div className="orb-light-sweep"></div>

        {/* TEXTURE */}
        <div className="orb-texture"></div>

        {/* HIGHLIGHT */}
        <div className="orb-specular"></div>

        {/* INNER CORE */}
        <div
          className="orb-core"
          style={{
            opacity: 0.5 + volume / 220,
            transform: `scale(${1 + volume / 900})`,
          }}
        ></div>
      </div>
    </div>
  );
}

export default VoiceOrb;
