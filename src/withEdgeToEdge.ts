import {
  ConfigPlugin,
  createRunOncePlugin,
  withAndroidStyles,
  withPlugins,
} from "@expo/config-plugins";

const pkg = require("react-native-edge-to-edge/package.json");

const withAndroidEdgeToEdgeTheme: ConfigPlugin = (config) => {
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

  return withAndroidStyles(config, (config) => {
    const { userInterfaceStyle = "light" } = config;

    config.modResults.resources.style = config.modResults.resources.style?.map(
      (style): typeof style => {
        if (style.$.name === "AppTheme") {
          style.$.parent = "Theme.EdgeToEdge";

          if (style.item != null) {
            style.item = style.item.filter(
              (item) => !ignoreList.has(item.$.name),
            );
          }

          if (userInterfaceStyle !== "automatic") {
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

export const withEdgeToEdge = createRunOncePlugin(
  (config) => withPlugins(config, [withAndroidEdgeToEdgeTheme]),
  pkg.name,
  pkg.version,
);
