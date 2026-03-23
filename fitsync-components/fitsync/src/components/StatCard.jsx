import { BG2, BORDER, MUTED } from "../theme";

export default function StatCard({ label, value, small = false }) {
  return (
    <div
      style={{
        background: BG2,
        borderRadius: 10,
        padding: small ? "8px 14px" : "16px 20px",
        border: `1px solid ${BORDER}`,
        minWidth: small ? 110 : undefined,
      }}
    >
      <div style={{ color: MUTED, fontSize: 10, marginBottom: 2 }}>{label}</div>
      <div style={{ color: "#fff", fontWeight: 700, fontSize: small ? 13 : 18 }}>{value}</div>
    </div>
  );
}
