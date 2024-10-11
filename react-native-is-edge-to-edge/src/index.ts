import { Platform, TurboModuleRegistry } from "react-native";

// Edge-to-edge is only an Android problem
const edgeToEdge =
  Platform.OS !== "android" || TurboModuleRegistry.get("RNEdgeToEdge") != null;

export const isEdgeToEdge = () => edgeToEdge;
