import { Platform, TurboModuleRegistry } from "react-native";

// Edge-to-edge is enabled by default on all platforms, expected android
const enabled =
  Platform.OS !== "android" || TurboModuleRegistry.get("RNEdgeToEdge") != null;

export const isEdgeToEdge = () => enabled;
