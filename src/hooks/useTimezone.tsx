import { create } from "zustand";

interface TimezoneState {
  timezone: string;
  setTimezone: (timezone: string) => void;
}

export const useTimezone = create<TimezoneState>((set) => ({
  timezone: "Europe/Paris",
  setTimezone: (timezone: string) => set({ timezone }),
}));