import { useState } from "react";
import { useUser } from "../context/UserContext"; // Ensure this handles tokens!
import { BG, GOLD, MUTED, inputStyle, btnGold } from "../theme";

export default function Register({ nav }) {
  const { setUser } = useUser();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false); // New: loading state

  const ch = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleRegister = async () => {
    // 1. Basic Validation
    if (!form.name || !form.email || !form.password) { 
      setErr("Please fill in all fields."); 
      return; 
    }
    if (form.password !== form.confirm) { 
      setErr("Passwords do not match."); 
      return; 
    }

    setLoading(true);
    setErr("");

    try {
      // 2. Call your Arch Linux Backend
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Update local state and navigate
        setUser({ name: form.name, email: form.email, memberType: "Pro Member" });
        nav("onboarding");
      } else {
        setErr(data.msg || "Registration failed. Try again.");
      }
    } catch (error) {
      setErr("Server is offline. Check if your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${BG} 0%, #1e1b4b 100%)`, padding: 28 }}>
      <button onClick={() => nav("welcome")} style={{ background: "none", border: "none", color: MUTED, fontSize: 20, cursor: "pointer", marginBottom: 20 }}>←</button>

      <h1 style={{ color: "#fff", fontWeight: 800, fontSize: 32, fontFamily: "'Space Grotesk', sans-serif", margin: "0 0 6px" }}>Hello! 👋</h1>
      <p style={{ color: MUTED, fontSize: 14, margin: "0 0 32px" }}>Create your account to get started</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input type="text" placeholder="Full Name" value={form.name} onChange={ch("name")} style={inputStyle} />
        <input type="email" placeholder="Email" value={form.email} onChange={ch("email")} style={inputStyle} />
        <input type="password" placeholder="Password" value={form.password} onChange={ch("password")} style={inputStyle} />
        <input type="password" placeholder="Confirm Password" value={form.confirm} onChange={ch("confirm")} style={inputStyle} />
        {err && <p style={{ color: "#f87171", fontSize: 13, margin: 0 }}>{err}</p>}
      </div>

      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
        <button 
          onClick={handleRegister} 
          style={{ ...btnGold, opacity: loading ? 0.7 : 1 }} 
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
        <p style={{ color: MUTED, textAlign: "center", fontSize: 13 }}>
          Already have an account?{" "}
          <span onClick={() => nav("login")} style={{ color: GOLD, cursor: "pointer", fontWeight: 600 }}>Login here</span>
        </p>
      </div>
    </div>
  );
}
