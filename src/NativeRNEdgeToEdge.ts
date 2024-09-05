import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

type SystemBarsConfig = {
  statusBarHidden: boolean | undefined;
  statusBarStyle: string | undefined;
  navigationBarHidden: boolean | undefined;
};

export interface Spec extends TurboModule {
  setSystemBarsConfig(config: SystemBarsConfig): void;
}

export default TurboModuleRegistry.get<Spec>("RNEdgeToEdge");
