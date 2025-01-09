import {
  ConfigPlugin,
  createRunOncePlugin,
  withAndroidStyles,
} from "@expo/config-plugins";

type ParentTheme =
  | "Default"
  | "Material2"
  | "Material3"
  | "Light"
  | "Material2.Light"
  | "Material3.Light";

type AndroidProps = {
  enforceNavigationBarContrast?: boolean;
  parentTheme?: ParentTheme;
};

type Props = { android?: AndroidProps } | undefined;

const withAndroidEdgeToEdgeTheme: ConfigPlugin<Props> = (
  config,
  props = {},
) => {
  const themes: Record<ParentTheme, string> = {
    Default: "Theme.EdgeToEdge",
    Material2: "Theme.EdgeToEdge.Material2",
    Material3: "Theme.EdgeToEdge.Material3",

    Light: "Theme.EdgeToEdge.Light",
    "Material2.Light": "Theme.EdgeToEdge.Material2.Light",
    "Material3.Light": "Theme.EdgeToEdge.Material3.Light",
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

  return withAndroidStyles(config, (config) => {
    const { androidStatusBar = {}, userInterfaceStyle = "light" } = config;
    const { barStyle } = androidStatusBar;
    const { android = {} } = props;
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

          if (enforceNavigationBarContrast === false) {
            style.item.push({
              $: { name: "enforceNavigationBarContrast" },
              _: String(false),
            });
          }

          if (barStyle != null) {
            style.item.push({
              $: { name: "android:windowLightStatusBar" },
              _: String(barStyle === "dark-content"),
            });
          } else if (userInterfaceStyle !== "automatic") {
            style.item.push({
              $: { name: "android:windowLightStatusBar" },
              _: String(userInterfaceStyle === "light"),
            });
          }
        }

        return style;
      },
    );

    return config;
  });
};

export default createRunOncePlugin(
  withAndroidEdgeToEdgeTheme,
  "react-native-edge-to-edge",
);
