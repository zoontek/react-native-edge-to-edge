import { TurboModuleRegistry } from "react-native";

const hasReactNativeEdgeToEdgePackage =
  TurboModuleRegistry.get("RNEdgeToEdge") != null;

export const isEdgeToEdge = () => hasReactNativeEdgeToEdgePackage;
