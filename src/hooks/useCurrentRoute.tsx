import { create } from "zustand";

interface CurrentRouteStore {
  key: string;
  setKey: (key: string) => void;
}

export default create<CurrentRouteStore>((set) => ({
  key: "/",
  setKey: (key) => set({ key }),
}));
