import { BG, GOLD, MUTED, btnGold, btnOutline } from "../theme";

export default function Welcome({ nav }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(160deg, ${BG} 0%, #1e1b4b 60%, ${BG} 100%)`,
      }}
    >
      {/* Logo bar */}
      <div style={{ padding: "20px 28px" }}>
        <span style={{ color: GOLD, fontWeight: 800, fontSize: 22, letterSpacing: -0.5, fontFamily: "'Space Grotesk', sans-serif" }}>
          FitSync
        </span>
      </div>

      {/* Hero */}
      <div
        style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "40px 28px",
        }}
      >
        <div
          style={{
            width: 90, height: 90,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${GOLD}, #f0a500)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 50px rgba(245,197,24,0.35)",
            marginBottom: 24, fontSize: 40,
          }}
        >
          ⚡
        </div>
        <h2 style={{ color: "#fff", fontSize: 32, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", margin: "0 0 4px", textAlign: "center" }}>
          Start your
        </h2>
        <h2 style={{ color: GOLD, fontSize: 32, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", margin: "0 0 12px", textAlign: "center" }}>
          Fitness Journey
        </h2>
        <p style={{ color: MUTED, fontSize: 14, textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>
          Track workouts, hit goals, and stay consistent — all in one place.
        </p>
      </div>

      {/* CTAs */}
      <div style={{ padding: "0 28px 52px", display: "flex", flexDirection: "column", gap: 12 }}>
        <button onClick={() => nav("login")} style={btnOutline}>Login</button>
        <button onClick={() => nav("register")} style={btnGold}>Create Account</button>
        <button
          onClick={() => nav("dashboard")}
          style={{ background: "none", border: "none", color: MUTED, fontSize: 13, cursor: "pointer", padding: "8px", fontFamily: "inherit" }}
        >
          Continue as guest
        </button>
      </div>
    </div>
  );
}
