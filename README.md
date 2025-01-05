# react-native-edge-to-edge

Effortlessly enable [edge-to-edge](https://developer.android.com/develop/ui/views/layout/edge-to-edge) display in React Native, allowing your Android app content to flow seamlessly beneath the system bars.

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/zoontek/react-native-edge-to-edge/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-native-edge-to-edge?style=for-the-badge)](https://www.npmjs.org/package/react-native-edge-to-edge)
[![npm downloads](https://img.shields.io/npm/dt/react-native-edge-to-edge.svg?label=downloads&style=for-the-badge)](https://www.npmjs.org/package/react-native-edge-to-edge)

<img width="240" src="./docs/logo.svg" alt="Logo">

## Credits

This project has been built and is maintained thanks to the support from [Expo](https://expo.dev).

<a href="https://expo.io">
  <img width="180" src="./docs/expo.svg" alt="Expo">
</a>

## Support

This library follows the React Native [releases support policy](https://github.com/reactwg/react-native-releases/blob/main/docs/support.md).<br>
It is supporting the **latest version**, and the **two previous minor series**.

## Motivations

### Android 15

Recently, Google introduced a significant change: apps targeting SDK 35 will have edge-to-edge display [enforced by default](https://developer.android.com/about/versions/15/behavior-changes-15#edge-to-edge) on Android 15+. Google is _likely_ to mandate that app updates on the Play Store target SDK 35 starting on August 31, 2025. This assumption is based on the [previous years' requirements following a similar timeline](https://support.google.com/googleplay/android-developer/answer/11926878?sjid=11853000253346477363-EU#zippy=%2Care-there-any-exceptions-for-existing-apps-targeting-api-or-below:~:text=App%20update%20requirements).

Currently, new React Native projects target SDK 34.

### Consistency

iOS has long used edge-to-edge displays, so adopting this design across all platforms ensures a consistent user experience. It also simplifies managing safe areas, eliminating the need for special cases specific to Android.

### Immersive mode

[Immersive mode](https://developer.android.com/develop/ui/views/layout/immersive) allows you to hide the status and navigation bars, making it ideal for full-screen experiences. Currently, the built-in [`StatusBar`](https://reactnative.dev/docs/statusbar) component uses [`FLAG_FULLSCREEN`](https://developer.android.com/reference/android/view/WindowManager.LayoutParams#FLAG_FULLSCREEN), a flag that has been deprecated since Android 11.

## Installation

```bash
$ npm i -S react-native-edge-to-edge
# --- or ---
$ yarn add react-native-edge-to-edge
```

### Expo

Add the library plugin in your `app.json` config file and [create a new build](https://docs.expo.dev/develop/development-builds/create-a-build/) 👷:

```diff
{
  "expo": {
+   "plugins": [
+     ["react-native-edge-to-edge", { "android": { "parentTheme": "Light" } }]
+   ]
  }
}
```

_📌 The available plugins options are:_

```ts
type Theme =
  | "Default" // Theme.EdgeToEdge (default)
  | "Material2" // Theme.EdgeToEdge.Material2
  | "Material3" // Theme.EdgeToEdge.Material3
  | "Light" // Theme.EdgeToEdge.Light
  | "Material2.Light" // Theme.EdgeToEdge.Material2.Light
  | "Material3.Light"; // Theme.EdgeToEdge.Material3.Light

type Options = {
  android?: {
    // use an edge-to-edge version of `Theme.{MaterialComponents,Material3}.{DayNight,Light}.NoActionBar`
    parentTheme?: Theme; // optional
  };
};
```

> [!NOTE]
> This library is not yet supported in the [Expo Go](https://expo.dev/go) sandbox app.

### Bare React Native

Edit your `android/app/src/main/res/values/styles.xml` file to inherit from one of the provided themes:

```diff
<resources>
  <!-- inherit from one of the provided edge-to-edge parent themes:
     - Theme.EdgeToEdge / Theme.EdgeToEdge.Light
     - Theme.EdgeToEdge.Material2 / Theme.EdgeToEdge.Material2.Light
     - Theme.EdgeToEdge.Material3 / Theme.EdgeToEdge.Material3.Light -->
- <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
+ <style name="AppTheme" parent="Theme.EdgeToEdge">
    <!-- … -->
  </style>
</resources>
```

## Considerations

### Keyboard management

Enabling edge-to-edge display disrupts Android keyboard management (`android:windowSoftInputMode="adjustResize"`), requiring an alternative solution. While [`KeyboardAvoidingView`](https://reactnative.dev/docs/keyboardavoidingview) is a viable option, we recommend using [react-native-keyboard-controller](https://github.com/kirillzyusko/react-native-keyboard-controller) for its enhanced capabilities.

### Safe area management

Effective safe area management is essential to prevent content from being displayed behind transparent system bars. To achieve this, we highly recommend using [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context), a well-known and trusted library.

### Modal component quirks

Edge-to-edge support for the built-in [`Modal`](https://reactnative.dev/docs/modal) component will be available in [React Native 0.77](https://github.com/facebook/react-native/pull/47254). Meanwhile, we recommend using the [react-navigation modals](https://reactnavigation.org/docs/modal) or the [`expo-router` modal screens](https://docs.expo.dev/router/advanced/modals/#modal-screen-using-expo-router).

### 3-button navigation mode

This library follows the default [AndroidX `enableEdgeToEdge`](https://developer.android.com/develop/ui/views/layout/edge-to-edge) behavior. The system bars are transparent, except in 3-button navigation mode, where the navigation bar becomes translucent (semi-opaque). Its color adjusts based on light or dark theme.

## API

### `<SystemBars />`

A component for managing your app's system bars. Replace all occurrences of [`StatusBar`](https://reactnative.dev/docs/statusbar), [`expo-status-bar`](https://docs.expo.dev/versions/latest/sdk/status-bar) and [`expo-navigation-bar`](https://docs.expo.dev/versions/latest/sdk/navigation-bar/) with it (they uses a lot of now [deprecated APIs](https://developer.android.com/about/versions/15/behavior-changes-15#deprecated-apis) and interfere with edge-to-edge).

```tsx
import { SystemBars } from "react-native-edge-to-edge";

type SystemBarsProps = {
  // Sets the color of the status bar content (navigation bar adjusts itself automatically)
  // "auto" is based on current color scheme (light -> dark content, dark -> light content)
  style?: "auto" | "light" | "dark";
  // Hide system bars (the navigation bar cannot be hidden on iOS)
  hidden?: boolean | { statusBar?: boolean; navigationBar?: boolean };
};

const App = () => (
  <>
    <SystemBars style="light" />
    {/* … */}
  </>
);
```

#### SystemBars.pushStackEntry

```ts
const entry: SystemBarsEntry = SystemBars.pushStackEntry(
  props /*: SystemBarsProps */,
);
```

#### SystemBars.popStackEntry

```ts
SystemBars.popStackEntry(entry /*: SystemBarsEntry */);
```

#### SystemBars.replaceStackEntry

```ts
const entry: SystemBarsEntry = SystemBars.replaceStackEntry(
  entry /*: SystemBarsEntry */,
  props /*: SystemBarsProps */,
);
```

## Third-party

Many libraries expose options that you can set to account for the transparency of status and navigation bars. For example, the [`useHideAnimation`](https://github.com/zoontek/react-native-bootsplash?tab=readme-ov-file#usehideanimation) hook in `react-native-bootsplash` has `statusBarTranslucent` and `navigationBarTranslucent` options, the [`useAnimatedKeyboard`](https://docs.swmansion.com/react-native-reanimated/docs/device/useAnimatedKeyboard) in `react-native-reanimated` has an `isStatusBarTranslucentAndroid` option, etc.

> [!IMPORTANT]  
> Until third-party libraries officially add support for `react-native-edge-to-edge` to set these options automatically, you may need to adjust these options to prevent interference with the library.

For library authors, we provide a lightweight package called `react-native-is-edge-to-edge` (note the `-is-`!), which checks whether `react-native-edge-to-edge` is installed, making it easy to update your library accordingly:

```ts
import {
  controlEdgeToEdgeValues,
  isEdgeToEdge,
} from "react-native-is-edge-to-edge";

const EDGE_TO_EDGE = isEdgeToEdge();

function MyAwesomeLibraryComponent({
  statusBarTranslucent,
  navigationBarTranslucent,
}) {
  if (__DEV__) {
    // warn the user once about unnecessary defined values
    controlEdgeToEdgeValues({
      statusBarTranslucent,
      navigationBarTranslucent,
    });
  }

  return (
    <MyAwesomeLibraryNativeComponent
      statusBarTranslucent={EDGE_TO_EDGE || statusBarTranslucent}
      navigationBarTranslucent={EDGE_TO_EDGE || navigationBarTranslucent}
      // …
    />
  );
}
```

If you want to check for the library's presence on the native side to bypass certain parts of your code, consider using this small utility:

```kotlin
object EdgeToEdge {
  // we cannot detect edge-to-edge, but we can detect react-native-edge-to-edge install
  val ENABLED: Boolean = try {
      Class.forName("com.zoontek.rnedgetoedge.EdgeToEdgePackage")
      true
    } catch (exception: ClassNotFoundException) {
      false
    }
}
```
