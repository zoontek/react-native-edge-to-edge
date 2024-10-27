import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  Object.defineProperty(global, "__DEV__", {
    value: true,
    writable: false,
  });
});

vi.mock("react-native", () => ({
  Platform: { OS: "android" },
  TurboModuleRegistry: { get: () => ({}) },
}));

describe("controlEdgeToEdgeValues", () => {
  const mock = vi.spyOn(console, "warn").mockImplementation(() => {});
  const statusBarTranslucent = true;
  const navigationBarTranslucent = false;

  beforeEach(() => {
    mock.mockReset();
    vi.resetModules();
  });

  it("is called when some values are defined", async () => {
    const { controlEdgeToEdgeValues } = await import("../src");

    controlEdgeToEdgeValues({ statusBarTranslucent, navigationBarTranslucent });

    expect(mock).toHaveBeenCalledOnce();
    expect(mock).toHaveBeenCalledWith(
      "statusBarTranslucent and navigationBarTranslucent values are ignored when using react-native-edge-to-edge",
    );
  });

  it("is not called if the values are undefined", async () => {
    const { controlEdgeToEdgeValues } = await import("../src");

    controlEdgeToEdgeValues({ statusBarTranslucent: undefined });
    expect(mock).not.toHaveBeenCalled();
  });

  it("is called once if the values doesn't change", async () => {
    const { controlEdgeToEdgeValues } = await import("../src");

    controlEdgeToEdgeValues({ statusBarTranslucent, navigationBarTranslucent });
    controlEdgeToEdgeValues({ statusBarTranslucent, navigationBarTranslucent });

    expect(mock).toHaveBeenCalledOnce();
    expect(mock).toHaveBeenCalledWith(
      "statusBarTranslucent and navigationBarTranslucent values are ignored when using react-native-edge-to-edge",
    );
  });

  it("is called twice if the values change", async () => {
    const { controlEdgeToEdgeValues } = await import("../src");

    controlEdgeToEdgeValues({ statusBarTranslucent, navigationBarTranslucent });
    controlEdgeToEdgeValues({ statusBarTranslucent });

    expect(mock).toHaveBeenCalledTimes(2);

    expect(mock).toHaveBeenNthCalledWith(
      1,
      "statusBarTranslucent and navigationBarTranslucent values are ignored when using react-native-edge-to-edge",
    );
    expect(mock).toHaveBeenNthCalledWith(
      2,
      "statusBarTranslucent value is ignored when using react-native-edge-to-edge",
    );
  });
});
