import type { TurboModule } from "react-native";
import { Appearance, Platform, TurboModuleRegistry } from "react-native";

interface Spec extends TurboModule {
  onColorSchemeChange(): void;
  setStatusBarStyle(style: string): void;
  setNavigationBarStyle(style: string): void;
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
