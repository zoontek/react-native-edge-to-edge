import {
  ConfigPlugin,
  createRunOncePlugin,
  withAndroidStyles,
} from "@expo/config-plugins";

type Theme = "Material2" | "Material3";

type Props = {
  android?: { parentTheme?: Theme };
};

const themes: Record<string, string> = {
  Material2: "Theme.EdgeToEdge.Material2",
  Material3: "Theme.EdgeToEdge.Material3",
} satisfies Record<Theme, string>;

const ignoreList = new Set([
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

const withAndroidEdgeToEdgeTheme: ConfigPlugin<Props> = (config, props) => {
  return withAndroidStyles(config, (config) => {
    const { androidStatusBar = {}, userInterfaceStyle = "light" } = config;
    const { barStyle } = androidStatusBar;
    const { android = {} } = props;
    const { parentTheme = "Default" } = android;

    config.modResults.resources.style = config.modResults.resources.style?.map(
      (style): typeof style => {
        if (style.$.name === "AppTheme") {
          style.$.parent = themes[parentTheme] ?? "Theme.EdgeToEdge";

          if (style.item != null) {
            style.item = style.item.filter(
              (item) => !ignoreList.has(item.$.name),
            );
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

  export default createRunOncePlugin(
    withAndroidEdgeToEdgeTheme,
    "react-native-edge-to-edge",
  );
};
