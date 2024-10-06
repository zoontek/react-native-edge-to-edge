# react-native-edge-to-edge

Effortlessly enable [edge-to-edge](https://developer.android.com/develop/ui/views/layout/edge-to-edge) display in React Native, allowing your app content to flow seamlessly beneath the system bars.

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/zoontek/react-native-edge-to-edge/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-native-edge-to-edge?style=for-the-badge)](https://www.npmjs.org/package/react-native-edge-to-edge)
[![npm downloads](https://img.shields.io/npm/dt/react-native-edge-to-edge.svg?label=downloads&style=for-the-badge)](https://www.npmjs.org/package/react-native-edge-to-edge)

<img width="240" src="./docs/logo.svg" alt="Logo">

## Credits

This project has been built and is maintained thanks to the support from [Expo.io](https://expo.io).

<a href="https://expo.io">
  <img width="180" src="./docs/expo.svg" alt="Expo">
</a>

## Support

This library follows the React Native [releases support policy](https://github.com/reactwg/react-native-releases/blob/main/docs/support.md).<br>
It is supporting the **latest version**, and the **two previous minor series**.

## Motivations

### Android 15

With the upcoming release of Android 15, Google is introducing a significant change: apps targeting SDK 35 [will have edge-to-edge enforcement](https://developer.android.com/about/versions/15/behavior-changes-15#edge-to-edge). Currently, the latest version of React Native targets SDK 34, so this isn't an issue **yet**, but it will be in a future release.

### Immersive mode

[Immersive mode](https://developer.android.com/develop/ui/views/layout/immersive) allows you to hide the status and navigation bars, making it ideal for full-screen experiences. Currently, the built-in [`StatusBar`](https://reactnative.dev/docs/statusbar) component uses [`FLAG_FULLSCREEN`](https://developer.android.com/reference/android/view/WindowManager.LayoutParams#FLAG_FULLSCREEN), a flag that has been deprecated since Android 11.

### Consistency

iOS has long used edge-to-edge displays, so adopting this design across all platforms ensures a consistent user experience. It also simplifies managing safe areas, eliminating the need for special cases specific to Android.

## Installation

```bash
$ npm i -S react-native-edge-to-edge
# --- or ---
$ yarn add react-native-edge-to-edge
```

### Expo

Add the library plugin in your `app.json` config file and run `expo prebuild`:

```diff
{
  "expo": {
+   "plugins": ["react-native-edge-to-edge"]
  }
}
```

### Bare React Native

Edit your `android/app/src/main/res/values/styles.xml` file to inherit from the provided theme:

```diff
<resources>
- <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
+ <style name="AppTheme" parent="Theme.EdgeToEdge">
    <!-- … -->
  </style>
</resources>
```

## Considerations

### Third-party librairies

Many libraries consider the transparency of status and navigation bars. For example, the [`useHideAnimation`](https://github.com/zoontek/react-native-bootsplash?tab=readme-ov-file#usehideanimation) hook in `react-native-bootsplash` has `statusBarTranslucent` and `navigationBarTranslucent` options, the [`useAnimatedKeyboard`](https://docs.swmansion.com/react-native-reanimated/docs/device/useAnimatedKeyboard) in `react-native-reanimated` has an `isStatusBarTranslucentAndroid` option, etc.

> [!IMPORTANT]  
> Until third-party libraries officially add support for `react-native-edge-to-edge`, you may need to adjust these options to prevent interference with the library.

For library authors, we provide a lightweight package called `react-native-is-edge-to-edge` (note the `-is-`!), which checks whether `react-native-edge-to-edge` is installed, making it easy to update your library accordingly:

```ts
import { isEdgeToEdge } from "react-native-is-edge-to-edge";

if (isEdgeToEdge()) {
  // …do something
}
```

### Keyboard management

Enabling edge-to-edge display disrupts basic Android keyboard management (`android:windowSoftInputMode="adjustResize"`), requiring an alternative solution. While [`KeyboardAvoidingView`](https://reactnative.dev/docs/keyboardavoidingview) is a viable option, we recommend using [react-native-keyboard-controller](https://github.com/kirillzyusko/react-native-keyboard-controller) for its enhanced capabilities.

### Safe area management

Effective safe area management is essential to prevent content from being displayed behind transparent system bars. To achieve this, we highly recommend using [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context), a widely known and trusted library.

### Modal component quirks

Status bar management has never worked effectively with the built-in [`Modal`](https://reactnative.dev/docs/modal) component (as it creates a `Dialog` with a `Window` instance distinct from `MainActivity`). A `statusBarTranslucent` prop was introduced, but it is insufficient because there is no equivalent for the navigation bar. Instead, we recommend using the [react-navigation modals](https://reactnavigation.org/docs/modal), which do not suffer from this issue, as they utilize [react-native-screens](https://docs.swmansion.com/react-native-screens) and `Fragment` behind the scenes.

## API

> [!WARNING]  
> The API is subject to change before reaching version **1.0.0**.

### `<SystemBars />`

A component for managing your app's system bars. This replace [`StatusBar`](https://reactnative.dev/docs/statusbar), [`expo-status-bar`](https://docs.expo.dev/versions/latest/sdk/status-bar) and [`expo-navigation-bar`](https://docs.expo.dev/versions/latest/sdk/navigation-bar/) (that uses a lot of now [deprecated APIs](https://developer.android.com/about/versions/15/behavior-changes-15#deprecated-apis)).

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
