import {
  type ConfigPlugin,
  createRunOncePlugin,
  withAndroidStyles,
} from "@expo/config-plugins";

type ParentTheme =
  | "Default"
  | "Material2"
  | "Material3"
  | "Material3.Dynamic"
  | "Material3Expressive"
  | "Material3Expressive.Dynamic"
  | "Light"
  | "Material2.Light"
  | "Material3.Light"
  | "Material3.Dynamic.Light"
  | "Material3Expressive.Light"
  | "Material3Expressive.Dynamic.Light";

type EdgeToEdgePluginConfig = {
  android?: {
    /**
     * Enforce a contrasting background on the navigation bar.
     * Set to `false` to enforce full transparency in all cases (you will then
     * need to manage the navigation bar style using `SystemBars`).
     * @default true
     */
    enforceNavigationBarContrast?: boolean;
    /**
     * The parent theme for the Android `AppTheme`. Choose based on your
     * current theme.
     * @default "Default"
     */
    parentTheme?: ParentTheme;
  };
};

const plugin: ConfigPlugin<EdgeToEdgePluginConfig | undefined> = (
  expoConfig,
  pluginConfig = {},
) => {
  const themes: Record<ParentTheme, string> = {
    Default: "Theme.EdgeToEdge",
    Material2: "Theme.EdgeToEdge.Material2",
    Material3: "Theme.EdgeToEdge.Material3",
    "Material3.Dynamic": "Theme.EdgeToEdge.Material3.Dynamic",
    Material3Expressive: "Theme.EdgeToEdge.Material3Expressive",
    "Material3Expressive.Dynamic":
      "Theme.EdgeToEdge.Material3Expressive.Dynamic",

    Light: "Theme.EdgeToEdge.Light",
    "Material2.Light": "Theme.EdgeToEdge.Material2.Light",
    "Material3.Light": "Theme.EdgeToEdge.Material3.Light",
    "Material3.Dynamic.Light": "Theme.EdgeToEdge.Material3.Dynamic.Light",
    "Material3Expressive.Light": "Theme.EdgeToEdge.Material3Expressive.Light",
    "Material3Expressive.Dynamic.Light":
      "Theme.EdgeToEdge.Material3Expressive.Dynamic.Light",
  };

  const cleanupList = new Set([
    "enforceNavigationBarContrast",
    "android:enforceNavigationBarContrast",
    "android:enforceStatusBarContrast",
    "android:fitsSystemWindows",
    "android:navigationBarColor",
    "android:statusBarColor",
    "android:windowDrawsSystemBarBackgrounds",
    "android:windowLayoutInDisplayCutoutMode",
    "android:windowLightNavigationBar",
    "android:windowLightStatusBar",
    "android:windowTranslucentNavigation",
    "android:windowTranslucentStatus",
  ]);

  return withAndroidStyles(expoConfig, (config) => {
    const {
      androidNavigationBar = {},
      androidStatusBar = {},
      userInterfaceStyle = "light",
    } = config;

    const { barStyle: navigationBarStyle } = androidNavigationBar;
    const { barStyle: statusBarStyle } = androidStatusBar;
    const { android = {} } = pluginConfig;
    const { enforceNavigationBarContrast, parentTheme = "Default" } = android;

    config.modResults.resources.style = config.modResults.resources.style?.map(
      (style): typeof style => {
        if (style.$.name === "AppTheme") {
          style.$.parent = themes[parentTheme] ?? themes["Default"];

          if (style.item != null) {
            style.item = style.item.filter(
              (item) => !cleanupList.has(item.$.name),
            );
          }

          if (statusBarStyle != null) {
            style.item.push({
              $: { name: "android:windowLightStatusBar" },
              _: String(statusBarStyle === "dark-content"),
            });
          } else if (userInterfaceStyle !== "automatic") {
            style.item.push({
              $: { name: "android:windowLightStatusBar" },
              _: String(userInterfaceStyle === "light"),
            });
          }

          if (enforceNavigationBarContrast === false) {
            if (navigationBarStyle != null) {
              style.item.push({
                $: { name: "android:windowLightNavigationBar" },
                _: String(navigationBarStyle === "dark-content"),
              });
            } else if (userInterfaceStyle !== "automatic") {
              style.item.push({
                $: { name: "android:windowLightNavigationBar" },
                _: String(navigationBarStyle === "light"),
              });
            }

            style.item.push({
              $: { name: "enforceNavigationBarContrast" },
              _: String(false),
            });
          }
        }

        return style;
      },
    );

    return config;
  });
};

const PACKAGE_NAME = "react-native-edge-to-edge";

export const withEdgeToEdge = createRunOncePlugin(plugin, PACKAGE_NAME);

export default (
  config: EdgeToEdgePluginConfig,
): [typeof PACKAGE_NAME, EdgeToEdgePluginConfig] => [PACKAGE_NAME, config];
