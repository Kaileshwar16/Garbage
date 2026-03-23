import { useState } from "react";
import { UserProvider } from "./context/UserContext";
import { BG } from "./theme";

// Components
import Navbar from "./components/Navbar";

// Pages
import Splash         from "./pages/Splash";
import Welcome        from "./pages/Welcome";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import Onboarding     from "./pages/Onboarding";
import PlanReveal     from "./pages/PlanReveal";
import Dashboard      from "./pages/Dashboard";
import WorkoutSession from "./pages/WorkoutSession";
import Schedule       from "./pages/Schedule";
import Stats          from "./pages/Stats";
import Profile        from "./pages/Profile";
import PulseAI        from "./pages/PulseAI";

const PAGES_WITH_NAV = ["dashboard", "schedule", "stats", "profile", "workout"];

export default function App() {
  const [page,   setPage]   = useState("splash");
  const [showAI, setShowAI] = useState(false);

  const nav = (p) => { setPage(p); setShowAI(false); };

  return (
    <UserProvider>
      <div style={{ minHeight: "100vh", background: BG, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          ::-webkit-scrollbar { width: 4px; height: 4px; }
          ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
          button:hover { opacity: 0.87; }
          input[type=range] { cursor: pointer; }
          input[type=time]  { color-scheme: dark; }
        `}</style>

        {/* Persistent navbar for main app pages */}
        {PAGES_WITH_NAV.includes(page) && (
          <Navbar active={page} nav={nav} onAI={() => setShowAI(true)} />
        )}

        {/* Page router */}
        {page === "splash"     && <Splash         nav={nav} />}
        {page === "welcome"    && <Welcome         nav={nav} />}
        {page === "login"      && <Login           nav={nav} />}
        {page === "register"   && <Register        nav={nav} />}
        {page === "onboarding" && <Onboarding      nav={nav} />}
        {page === "plan"       && <PlanReveal       nav={nav} />}
        {page === "dashboard"  && <Dashboard        nav={nav} onAI={() => setShowAI(true)} />}
        {page === "workout"    && <WorkoutSession   nav={nav} />}
        {page === "schedule"   && <Schedule         nav={nav} />}
        {page === "stats"      && <Stats            nav={nav} />}
        {page === "profile"    && <Profile          nav={nav} />}

        {/* AI overlay */}
        {showAI && <PulseAI onClose={() => setShowAI(false)} />}
      </div>
    </UserProvider>
  );
}
