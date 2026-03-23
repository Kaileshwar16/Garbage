import { useEffect } from "react";
import { BG, GOLD, MUTED } from "../theme";

export default function Splash({ nav }) {
  useEffect(() => {
    const t = setTimeout(() => nav("welcome"), 2200);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${BG} 0%, #1e1b4b 50%, ${BG} 100%)`,
      }}
    >
      <style>{`
        @keyframes puls { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .splash-logo { animation: puls 1.8s ease-in-out infinite }
        .splash-t1   { animation: fadeUp 0.7s ease 0.3s both }
        .splash-t2   { animation: fadeUp 0.7s ease 0.6s both }
      `}</style>

      <div
        className="splash-logo"
        style={{
          width: 80, height: 80,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${GOLD}, #f0a500)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 40px rgba(245,197,24,0.4)`,
          marginBottom: 24,
          fontSize: 36,
        }}
      >
        ⚡
      </div>

      <h1
        className="splash-t1"
        style={{
          color: "#fff", fontSize: 36, fontWeight: 800, margin: 0,
          fontFamily: "'Space Grotesk', sans-serif", letterSpacing: -1,
        }}
      >
        FitSync
      </h1>

      <p className="splash-t2" style={{ color: MUTED, marginTop: 8, fontSize: 14 }}>
        Fitness Made Simple.
      </p>
    </div>
  );
}
