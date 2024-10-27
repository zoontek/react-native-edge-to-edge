import { Platform, TurboModuleRegistry } from "react-native";

export const isEdgeToEdge = () =>
  Platform.OS !== "android" || TurboModuleRegistry.get("RNEdgeToEdge") != null;

const warnings = new Set();

export const controlEdgeToEdgeValues = (values: Record<string, unknown>) => {
  if (__DEV__ && isEdgeToEdge()) {
    const entries = Object.entries(values).filter(
      ([, value]) => typeof value !== "undefined",
    );

    const stableKey = entries.join(" ");

    if (entries.length < 1 || warnings.has(stableKey)) {
      return;
    }

    warnings.add(stableKey);

    const isPlural = entries.length > 1;
    const lastIndex = entries.length - 1;

    const list = entries.reduce(
      (acc, [name], index) =>
        index === 0
          ? name
          : acc + (index === lastIndex ? " and " : ", ") + name,
      "",
    );

    console.warn(
      `${list} ${isPlural ? "value" : "values"} are ignored when using react-native-edge-to-edge`,
    );
  }
};
