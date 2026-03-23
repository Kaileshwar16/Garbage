import { useState } from "react";
import { useUser } from "../context/UserContext";
import { BG, GOLD, MUTED, inputStyle, btnGold } from "../theme";

export default function Register({ nav }) {
  const { setUser } = useUser();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [err,  setErr]  = useState("");

  const ch = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleRegister = () => {
    if (!form.name || !form.email || !form.password) { setErr("Please fill in all fields."); return; }
    if (form.password !== form.confirm) { setErr("Passwords do not match."); return; }
    setUser((u) => ({ ...u, name: form.name, email: form.email, memberType: "Pro Member" }));
    nav("onboarding");
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${BG} 0%, #1e1b4b 100%)`, padding: 28 }}>
      <button onClick={() => nav("welcome")} style={{ background: "none", border: "none", color: MUTED, fontSize: 20, cursor: "pointer", marginBottom: 20 }}>←</button>

      <h1 style={{ color: "#fff", fontWeight: 800, fontSize: 32, fontFamily: "'Space Grotesk', sans-serif", margin: "0 0 6px" }}>Hello! 👋</h1>
      <p style={{ color: MUTED, fontSize: 14, margin: "0 0 32px" }}>Create your account to get started</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input type="text"     placeholder="Full Name"        value={form.name}     onChange={ch("name")}     style={inputStyle} />
        <input type="email"    placeholder="Email"            value={form.email}    onChange={ch("email")}    style={inputStyle} />
        <input type="password" placeholder="Password"         value={form.password} onChange={ch("password")} style={inputStyle} />
        <input type="password" placeholder="Confirm Password" value={form.confirm}  onChange={ch("confirm")}  style={inputStyle} />
        {err && <p style={{ color: "#f87171", fontSize: 13, margin: 0 }}>{err}</p>}
      </div>

      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
        <button onClick={handleRegister} style={btnGold}>Create Account</button>
        <p style={{ color: MUTED, textAlign: "center", fontSize: 13 }}>
          Already have an account?{" "}
          <span onClick={() => nav("login")} style={{ color: GOLD, cursor: "pointer", fontWeight: 600 }}>Login here</span>
        </p>
      </div>
    </div>
  );
}
