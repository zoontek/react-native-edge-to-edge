import { NativeModules } from "react-native";
import { SystemBarStyle } from "./types";

export const NativeModule:
  | {
      navigationBarHeight: number;
      setNavigationBarStyle: (style: SystemBarStyle) => void;
    }
  | undefined = NativeModules.RNBars;
