import { Platform, TurboModuleRegistry } from "react-native";

// Edge-to-edge is only an Android problem
const enabled =
  Platform.OS !== "android" || TurboModuleRegistry.get("RNEdgeToEdge") != null;

export const isEdgeToEdge = () => enabled;
