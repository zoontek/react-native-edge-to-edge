import type { TurboModule } from "react-native";
import { Appearance, TurboModuleRegistry } from "react-native";

type SystemBarsConfig = {
  statusBarHidden: boolean | undefined;
  statusBarStyle: string | undefined;
  navigationBarHidden: boolean | undefined;
};

export interface Spec extends TurboModule {
  onColorSchemeChange(): void;
  setSystemBarsConfig(config: SystemBarsConfig): void;
}

const NativeModule = TurboModuleRegistry.get<Spec>("RNEdgeToEdge");

if (NativeModule != null) {
  Appearance.addChangeListener(() => {
    NativeModule.onColorSchemeChange();
  });
}

export default NativeModule;
