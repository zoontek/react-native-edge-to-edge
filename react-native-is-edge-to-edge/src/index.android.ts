import { TurboModuleRegistry } from "react-native";

const warnings = new Set<string>();

export const isEdgeToEdge = () =>
  TurboModuleRegistry.get("RNEdgeToEdge") != null ||
  TurboModuleRegistry.get<{
    getConstants?: () => { isEdgeToEdge?: boolean };
  }>("DeviceInfo")?.getConstants?.().isEdgeToEdge === true;

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
      `${list} ${isPlural ? "values are" : "value is"} ignored when using react-native-edge-to-edge`,
    );
  }
};
