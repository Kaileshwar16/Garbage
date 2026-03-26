import { createContext, useContext, useState, useEffect } from "react";

export const UserCtx = createContext(null);

export const useUser = () => useContext(UserCtx);

const defaultUser = {
  name: "Demo",
  email: "",
  memberType: "Member",
  weight: 0,
  height: 0,
  age: 0,
  gender: "",
  goal: "",
  activityLevel: "",
  calories: 0,
  protein: 0,
  water: 0,
  bmr: 0,
  targetWeight: 0,
  streak: 0,
  weekDone: 0,
  weekTotal: 4,
  stepsToday: 0,
  waterToday: 0,
  caloriesBurned: 0,
  schedule: {},
  workoutHistory: [],
};

export function UserProvider({ children }) {
  // 1. Initialize state from LocalStorage if it exists, otherwise use default
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("fitsync_user");
    return savedUser ? JSON.parse(savedUser) : defaultUser;
  });

  // 2. Sync to LocalStorage whenever the user object changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("fitsync_user", JSON.stringify(user));
    }
  }, [user]);

  // 3. Helper to clear session (Logout)
  const logout = () => {
    localStorage.removeItem("fitsync_user");
    localStorage.removeItem("token"); // Clear the JWT too
    setUser(defaultUser);
  };

  return (
    <UserCtx.Provider value={{ user, setUser, logout }}>
      {children}
    </UserCtx.Provider>
  );
}
