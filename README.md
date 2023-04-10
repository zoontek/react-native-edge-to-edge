# ➖ react-native-bars

Components to control your app status and navigation bars.<br />
Inspired by the built-in `StatusBar` module and [react-native-transparent-status-and-navigation-bar](https://github.com/MoOx/react-native-transparent-status-and-navigation-bar) by [@MoOx](https://github.com/MoOx) (Thanks to them 💖).

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/zoontek/react-native-bars/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-native-bars?style=for-the-badge)](https://www.npmjs.org/package/react-native-bars)
[![npm downloads](https://img.shields.io/npm/dt/react-native-bars.svg?label=downloads&style=for-the-badge)](https://www.npmjs.org/package/react-native-bars)
<br />
[![platform - android](https://img.shields.io/badge/platform-Android-3ddc84.svg?logo=android&style=for-the-badge)](https://www.android.com)
[![platform - ios](https://img.shields.io/badge/platform-iOS-000.svg?logo=apple&style=for-the-badge)](https://developer.apple.com/ios)

<br>

<p>
  <img width="300" src="https://raw.githubusercontent.com/zoontek/react-native-bars/HEAD/docs/android_demo.gif?raw=true" alt="android demo"></img>
</p>

## Funding

<a href="https://github.com/sponsors/zoontek">
  <img align="right" width="150" alt="This library helped you? Consider sponsoring!" src=".github/funding-octocat.svg">
</a>

This module is provided **as is**, I work on it in my free time.

If your company uses it in a production app, consider sponsoring this project 💰. You also can contact me for **premium** enterprise support, help with issues, prioritize bugfixes, feature requests, etc.

## Support

| package version | react-native version |
| --------------- | -------------------- |
| 2.0.0+          | 0.70.0+              |
| 1.0.0+          | 0.65.0+              |

## Installation

```bash
$ npm install --save react-native-bars
# --- or ---
$ yarn add react-native-bars
```

## Recommendations

This module will works best with:

- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context): A library to handle safe area insets and avoid drawing below status and navigation bars.

## Setup

ℹ️ For `react-native` < `0.70` setup, use latest v1 and follow [this README](https://github.com/zoontek/react-native-bars/blob/1.1.2/README.md).

### Android

1. Edit your `android/app/src/main/java/com/yourprojectname/MainActivity.java` file:

```java
// …

// Add these required imports:
import android.os.Bundle;
import com.zoontek.rnbars.RNBars;

public class MainActivity extends ReactActivity {

  // …

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState); // or super.onCreate(null) with react-native-screens
    RNBars.init(this, "dark-content"); // <- initialize with initial bars styles (could be light-content)
  }
}
```

2. To setup initial bar styles on Android < 8.1, edit your `android/app/src/main/res/values/styles.xml` file:<br>
   _👉 Dont forget to edit `android:windowLightStatusBar` to match your initial styles._

```xml
<resources>

  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    <!-- … -->

    <!-- Set status bar background transparent -->
    <item name="android:statusBarColor">@android:color/transparent</item>

    <!-- Navigation bar will stay translucent on Android < 8.1 -->
    <item name="android:windowTranslucentNavigation">true</item>
  </style>

</resources>
```

3. For Android >= 8.1, create (or edit) your `android/app/src/main/res/values-v27/styles.xml` file:<br>
   _👉 Dont forget to edit `android:{windowLightStatusBar,windowLightNavigationBar}` to match your initial styles._

```xml
<resources xmlns:tools="http://schemas.android.com/tools">

  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    <!-- … -->

    <!-- Set system bars background transparent -->
    <item name="android:statusBarColor">@android:color/transparent</item>
    <item name="android:navigationBarColor">@android:color/transparent</item>

    <!-- Disable auto contrasted system bars background -->
    <item name="android:enforceStatusBarContrast" tools:targetApi="q">false</item>
    <item name="android:enforceNavigationBarContrast" tools:targetApi="q">false</item>
  </style>

</resources>
```

## iOS

You can setup your initial status bar style in **Xcode > General > Deployment Info**:

![Xcode setup](https://raw.githubusercontent.com/zoontek/react-native-bars/HEAD/docs/xcode_setup.png?raw=true)

## Usage

```tsx
import { NavigationBar, StatusBar, SystemBars } from "react-native-bars";

const App = () => {
  return (
    <>
      <StatusBar animated={true} barStyle="light-content" />
      <NavigationBar barStyle="light-content" />

      {/* Or, to update both with one component: */}
      <SystemBars animated={true} barStyle="light-content" />
    </>
  );
};
```

## API

### `<StatusBar />`

A component to control your app status bar.

```tsx
import { StatusBar } from "react-native-bars";

type StatusBarProps = {
  // Should transition between status bar property changes be animated? (has no effect on Android)
  animated?: boolean;
  // Sets the color of the status bar content
  barStyle: "light-content" | "dark-content";
};

const App = () => (
  <>
    <StatusBar animated={true} barStyle="dark-content" />
    {/* … */}
  </>
);
```

#### StatusBar.pushStackEntry

```ts
const entry: StatusBarProps = StatusBar.pushStackEntry(
  props /*: StatusBarProps*/,
);
```

#### StatusBar.popStackEntry

```ts
StatusBar.popStackEntry(entry/*: StatusBarProps*/): void;
```

#### StatusBar.replaceStackEntry

```ts
const entry: StatusBarProps = StatusBar.replaceStackEntry(
  entry /*: StatusBarProps*/,
  props /*: StatusBarProps*/,
);
```

---

### `<NavigationBar />`

A component to control your app navigation bar. It has no effect on iOS and Android < 8.1.

```tsx
import { NavigationBar } from "react-native-bars";

type NavigationBarProps = {
  // Sets the color of the navigation bar content
  barStyle: "light-content" | "dark-content";
};

const App = () => (
  <>
    <NavigationBar barStyle="dark-content" />
    {/* … */}
  </>
);
```

#### NavigationBar.pushStackEntry

```ts
const entry: NavigationBarProps = NavigationBar.pushStackEntry(
  props /*: NavigationBarProps*/,
);
```

#### NavigationBar.popStackEntry

```ts
NavigationBar.popStackEntry(entry/*: NavigationBarProps*/): void;
```

#### NavigationBar.replaceStackEntry

```ts
const entry: NavigationBarProps = NavigationBar.replaceStackEntry(
  entry /*: NavigationBarProps*/,
  props /*: NavigationBarProps*/,
);
```

---

### `<SystemBars />`

A component to control both your app status and navigation bars.

```tsx
import { SystemBars } from "react-native-bars";

type SystemBarsProps = {
  // Should transition between bars property changes be animated? (has no effect on Android)
  animated?: boolean;
  // Sets the color of the bars content
  barStyle: "light-content" | "dark-content";
};

const App = () => (
  <>
    <SystemBars animated={true} barStyle="dark-content" />
    {/* … */}
  </>
);
```
