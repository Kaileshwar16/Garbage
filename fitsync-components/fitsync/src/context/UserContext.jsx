import { createContext, useContext, useState } from "react";

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
  const [user, setUser] = useState(defaultUser);
  return (
    <UserCtx.Provider value={{ user, setUser }}>
      {children}
    </UserCtx.Provider>
  );
}
