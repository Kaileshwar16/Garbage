import { useUser } from "../context/UserContext";
import { GOLD, BORDER, MUTED } from "../theme";

const NAV_ITEMS = [
  ["dashboard", "Home"],
  ["schedule",  "Schedule"],
  ["stats",     "Stats"],
  ["profile",   "Profile"],
];

export default function Navbar({ active, nav }) {
  const { user } = useUser();
  const initial = user.name ? user.name[0].toUpperCase() : "?";

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(22,22,45,0.96)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${BORDER}`,
        display: "flex",
        alignItems: "center",
        padding: "0 32px",
        height: 60,
        gap: 4,
      }}
    >
      {/* Logo */}
      <span
        style={{
          color: GOLD,
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: -0.5,
          marginRight: "auto",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        FitSync
      </span>

      {/* Nav links */}
      {NAV_ITEMS.map(([id, label]) => (
        <button
          key={id}
          onClick={() => nav(id)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: active === id ? GOLD : MUTED,
            fontSize: 14,
            fontWeight: active === id ? 600 : 400,
            fontFamily: "inherit",
            padding: "4px 14px",
            borderBottom: `2px solid ${active === id ? GOLD : "transparent"}`,
            transition: "all 0.2s",
            height: "100%",
          }}
        >
          {label}
        </button>
      ))}

      {/* User avatar */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user.name || "Demo"}</div>
          <div style={{ color: GOLD, fontSize: 10 }}>{user.memberType || "Member"}</div>
        </div>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: GOLD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#1a1a2e",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {initial}
        </div>
      </div>
    </nav>
  );
}
