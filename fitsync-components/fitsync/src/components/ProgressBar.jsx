export default function ProgressBar({ value, max, color = "#F5C518", height = 6, bgColor = "rgba(255,255,255,0.12)" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ background: bgColor, borderRadius: height, height, overflow: "hidden" }}>
      <div
        style={{
          width: `${pct}%`,
          background: color,
          borderRadius: height,
          height: "100%",
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
}
