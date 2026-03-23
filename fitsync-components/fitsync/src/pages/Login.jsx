import { useState } from "react";
import { useUser } from "../context/UserContext";
import { BG, GOLD, MUTED, inputStyle, btnOutline } from "../theme";

export default function Login({ nav }) {
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [err,   setErr]   = useState("");

  const handleLogin = () => {
    if (!email || !pass) { setErr("Please fill in all fields."); return; }
    // Derive a display name from the email prefix
    const name = email
      .split("@")[0]
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim() || "Demo";
    setUser((u) => ({ ...u, name, email, memberType: "Pro Member" }));
    nav("dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${BG} 0%, #1e1b4b 100%)`, padding: 28 }}>
      <button onClick={() => nav("welcome")} style={{ background: "none", border: "none", color: MUTED, fontSize: 20, cursor: "pointer", marginBottom: 20 }}>←</button>

      <h1 style={{ color: "#fff", fontWeight: 800, fontSize: 32, fontFamily: "'Space Grotesk', sans-serif", margin: "0 0 8px" }}>Login</h1>
      <p style={{ color: MUTED, fontSize: 14, margin: "0 0 32px" }}>Welcome back! Glad to see you again.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password" placeholder="Password" value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={inputStyle}
        />
        {err && <p style={{ color: "#f87171", fontSize: 13, margin: 0 }}>{err}</p>}
        <div style={{ textAlign: "right" }}>
          <span style={{ color: GOLD, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>Forgot password?</span>
        </div>
      </div>

      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
        <button onClick={handleLogin} style={btnOutline}>Login</button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>or</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>

        <button
          onClick={handleLogin}
          style={{ ...btnOutline, borderColor: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
        >
          <span style={{ fontWeight: 800 }}>G</span> Continue with Google
        </button>

        <p style={{ color: MUTED, textAlign: "center", fontSize: 13 }}>
          Don't have an account?{" "}
          <span onClick={() => nav("register")} style={{ color: GOLD, cursor: "pointer", fontWeight: 600 }}>Register Now</span>
        </p>
      </div>
    </div>
  );
}
