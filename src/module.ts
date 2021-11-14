import { NativeModules } from "react-native";
import { SystemBarStyle } from "./types";

export const NativeModule:
  | {
      navigationBarHeight: number;
      setStatusBarStyle: (style: SystemBarStyle) => void;
      setNavigationBarStyle: (style: SystemBarStyle) => void;
    }
  | undefined = NativeModules.RNBars;
