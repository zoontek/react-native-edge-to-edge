import { NativeModules } from "react-native";
import { SystemBarStyle } from "./types";

type AndroidModule = {
  setStatusBarStyle: (style: SystemBarStyle) => void;
  setNavigationBarStyle: (style: SystemBarStyle) => void;
};

export const NativeModule: AndroidModule | undefined = NativeModules.RNBars;
