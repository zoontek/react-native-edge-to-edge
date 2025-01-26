import type { TurboModule } from "react-native";
import { Appearance, Platform, TurboModuleRegistry } from "react-native";

type SystemBarStyle = "default" | "light-content" | "dark-content";

interface Spec extends TurboModule {
  onColorSchemeChange(): void;
  setStatusBarStyle(style: SystemBarStyle): void;
  setNavigationBarStyle(style: SystemBarStyle): void;
  setStatusBarHidden(hidden: boolean): void;
  setNavigationBarHidden(hidden: boolean): void;
}

const NativeModule =
  Platform.OS === "android"
    ? TurboModuleRegistry.getEnforcing<Spec>("RNEdgeToEdge")
    : null;

if (NativeModule != null) {
  Appearance.addChangeListener(() => {
    NativeModule.onColorSchemeChange();
  });
}

export default NativeModule;
