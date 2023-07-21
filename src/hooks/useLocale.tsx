import appConfig from "configs/app.config";
import { create } from "zustand";

interface LocaleStore {
  locale: string;
  setLocale: (locale: string) => void;
}

export default create<LocaleStore>((set) => ({
  locale: appConfig.locale,
  setLocale: (locale: string) => set({ locale }),
}));
