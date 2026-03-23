import { useState } from "react";
import { useUser } from "../context/UserContext";
import { BG, BG2, BORDER, GOLD, MUTED, inputStyle, btnGold, btnOutline } from "../theme";
import { calcBMR, calcCalories, calcProtein, calcWater } from "../utils/fitness";

export default function Profile({ nav }) {
  const { user, setUser } = useUser();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:   user.name   || "",
    email:  user.email  || "",
    weight: user.weight || 70,
    height: user.height || 170,
    age:    user.age    || 25,
  });

  const initial = (user.name || "D")[0].toUpperCase();

  const saveProfile = () => {
    // Recalculate nutrition if body stats changed
    const bmr      = form.weight && form.height && form.age
      ? calcBMR(form.weight, form.height, form.age, user.gender)
      : user.bmr;
    const calories = bmr ? calcCalories(bmr, user.activityLevel) : user.calories;
    const protein  = form.weight ? calcProtein(form.weight, user.goal) : user.protein;
    const water    = form.weight ? calcWater(form.weight) : user.water;
    setUser((u) => ({ ...u, ...form, bmr, calories, protein, water }));
    setEditing(false);
  };

  const handleLogout = () => {
    setUser((u) => ({ ...u, name: "Demo", email: "", memberType: "Member" }));
    nav("welcome");
  };

  const MENU_ITEMS = [
    { icon: "👤", label: "Edit Profile",  sub: "Change your personal details",    color: "#fff",    action: () => setEditing((e) => !e) },
    { icon: "📊", label: "Progress",       sub: "View your detailed analytics",    color: "#fff",    action: () => nav("stats") },
    { icon: "🚪", label: "Logout",         sub: "Sign out of your account",        color: "#f87171", action: handleLogout },
  ];

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: 28, color: "#fff" }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 800, margin: "0 0 28px" }}>Profile</h1>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, alignItems: "start" }}>

        {/* ── Avatar card ── */}
        <div style={{ background: BG2, borderRadius: 16, padding: 24, textAlign: "center", border: `1px solid ${BORDER}` }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", color: "#1a1a2e", fontWeight: 800, fontSize: 28, fontFamily: "'Space Grotesk', sans-serif" }}>
              {initial}
            </div>
            <div style={{ position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: "50%", background: "#4ade80", border: "2px solid #16162d" }} />
          </div>

          <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800 }}>{user.name || "Demo"}</h3>
          <p style={{ color: MUTED, fontSize: 12, margin: "0 0 4px" }}>{user.email || "—"}</p>
          <p style={{ color: GOLD, fontSize: 11, fontWeight: 600, margin: "0 0 16px" }}>{user.memberType || "Member"}</p>

          {user.goal && (
            <div style={{ background: "rgba(245,197,24,0.1)", borderRadius: 8, padding: "6px 10px", marginBottom: 16 }}>
              <div style={{ color: GOLD, fontSize: 11, fontWeight: 600 }}>{user.goal}</div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {[
              ["Weight", user.weight ? `${user.weight}kg` : "—"],
              ["Height", user.height ? `${user.height}cm` : "—"],
              ["Age",    user.age    || "—"],
            ].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: 14, fontWeight: 800, color: GOLD }}>{v}</div>
                <div style={{ fontSize: 9, color: MUTED, letterSpacing: 1 }}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

          {/* Nutrition summary */}
          {user.calories > 0 && (
            <div style={{ background: BG2, borderRadius: 14, padding: "14px 18px", border: `1px solid ${BORDER}`, marginBottom: 4 }}>
              <p style={{ color: MUTED, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>
                Your Daily Targets
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  ["🔥", `${user.calories} kcal`, "Calories"],
                  ["🥩", `${user.protein}g`,      "Protein" ],
                  ["💧", `${user.water}L`,         "Water"   ],
                ].map(([icon, val, label]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18 }}>{icon}</div>
                    <div style={{ color: GOLD, fontWeight: 700, fontSize: 14 }}>{val}</div>
                    <div style={{ color: MUTED, fontSize: 10 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Menu items */}
          {MENU_ITEMS.map((item, i) => (
            <div
              key={i}
              onClick={item.action}
              style={{
                background: BG2, borderRadius: 14, padding: "16px 18px",
                display: "flex", alignItems: "center", gap: 14,
                cursor: item.action ? "pointer" : "default",
                border: `1px solid ${BORDER}`, transition: "background 0.2s",
              }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: item.color, fontWeight: 600, fontSize: 14 }}>{item.label}</div>
                <div style={{ color: MUTED, fontSize: 12 }}>{item.sub}</div>
              </div>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 18 }}>›</span>
            </div>
          ))}

          {/* Inline edit form */}
          {editing && (
            <div style={{ background: BG2, borderRadius: 14, padding: 18, border: `1px solid ${BORDER}` }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: "0 0 14px" }}>Edit Profile</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input placeholder="Name"  value={form.name}  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}  style={inputStyle} />
                <input placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={inputStyle} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <input type="number" placeholder="Weight (kg)" value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: Number(e.target.value) }))} style={inputStyle} />
                  <input type="number" placeholder="Height (cm)" value={form.height} onChange={(e) => setForm((f) => ({ ...f, height: Number(e.target.value) }))} style={inputStyle} />
                  <input type="number" placeholder="Age"         value={form.age}    onChange={(e) => setForm((f) => ({ ...f, age:    Number(e.target.value) }))} style={inputStyle} />
                </div>
                <p style={{ color: MUTED, fontSize: 11, margin: 0 }}>
                  Nutrition targets will be recalculated automatically.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={saveProfile}        style={{ ...btnGold,    padding: "11px" }}>Save Changes</button>
                  <button onClick={() => setEditing(false)} style={{ ...btnOutline, padding: "11px" }}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
