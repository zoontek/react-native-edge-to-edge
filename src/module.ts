import { NativeModules } from "react-native";
import { SystemBarStyle } from "./types";

export const NativeModule:
  | {
      navigationBarHeight: SystemBarStyle;
      setNavigationBarStyle: (style: SystemBarStyle) => void;
    }
  | undefined = NativeModules.RNBars;
