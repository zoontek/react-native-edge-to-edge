import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

type SystemBarsConfig = {
  statusBarStyle: string | undefined;
  statusBarHidden: boolean | undefined;
  navigationBarHidden: boolean | undefined;
};

export interface Spec extends TurboModule {
  setSystemBarsConfig(config: SystemBarsConfig): void;
}

export default TurboModuleRegistry.get<Spec>("RNEdgeToEdge");
