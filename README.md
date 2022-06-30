# ➖ react-native-bars

Components to control your app status and navigation bars.<br />
Inspired by the built-in `StatusBar` module and [react-native-transparent-status-and-navigation-bar](https://github.com/MoOx/react-native-transparent-status-and-navigation-bar) by [@MoOx](https://github.com/MoOx) (Thanks to them 💖).

[![npm version](https://badge.fury.io/js/react-native-bars.svg)](https://www.npmjs.org/package/react-native-bars)
[![npm](https://img.shields.io/npm/dt/react-native-bars.svg)](https://www.npmjs.org/package/react-native-bars)
[![MIT](https://img.shields.io/dub/l/vibe-d.svg)](https://opensource.org/licenses/MIT)
[![Platform - Android](https://img.shields.io/badge/platform-Android-3ddc84.svg?style=flat&logo=android)](https://www.android.com)
[![Platform - iOS](https://img.shields.io/badge/platform-iOS-000.svg?style=flat&logo=apple)](https://developer.apple.com/ios)

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

| version | RN version | Android version | iOS version |
| ------- | ---------- | --------------- | ----------- |
| 1.0.0+  | 0.65.0+    | 6.0+            | 11.0+       |

## Installation

```bash
$ npm install --save react-native-bars
# --- or ---
$ yarn add react-native-bars
```

## Recommendations

This module will works best with:

- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context): A library to handle safe area insets and avoid drawing below status and navigation bars.
- [react-native-bootsplash](https://github.com/zoontek/react-native-bootsplash): A splash screen library to wait until your app finished loading.

## 🆘 Manual linking

Because this package targets React Native 0.65.0+, you will probably don't need to link it manually. Otherwise if it's not the case, follow this additional instructions:

<details>
  <summary><b>👀 See manual linking instructions</b></summary>

## Setup

### Android

1. Add the following lines to `android/settings.gradle`:

```gradle
include ':react-native-bars'
project(':react-native-bars').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-bars/android')
```

2. Add the implementation line to the dependencies in `android/app/build.gradle`:

```gradle
dependencies {
  // ...
  implementation project(':react-native-bars')
}
```

3. Add the import and link the package in `MainApplication.java`:

```java
import com.zoontek.rnbars.RNBarsPackage; // <- add the RNBarsPackage import

public class MainApplication extends Application implements ReactApplication {

  // …

  @Override
  protected List<ReactPackage> getPackages() {
    @SuppressWarnings("UnnecessaryLocalVariable")
    List<ReactPackage> packages = new PackageList(this).getPackages();
    // …
    packages.add(new RNBarsPackage());
    return packages;
  }

  // …
}
```

</details>

## Setup

ℹ️ For `react-native` < `0.68` setup, follow the [`v1.1.2 README.md`](https://github.com/zoontek/react-native-bars/blob/1.1.2/README.md) (it works with the latest `react-native-bars` version too).

### Android

1. As this library only support Android 6+, you probably have to edit your `android/build.gradle` file:

```gradle
buildscript {
  ext {
    buildToolsVersion = "31.0.0"
    minSdkVersion = 23 // <- set at least 23
    compileSdkVersion = 31 // <- set at least 31
    targetSdkVersion = 31 // <- set at least 31

    // …
```

2. Edit your `android/app/src/main/java/com/yourprojectname/MainActivity.java` file:

```java
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.zoontek.rnbars.RNBars; // <- add this necessary import

public class MainActivity extends ReactActivity {

  // …

  public static class MainActivityDelegate extends ReactActivityDelegate {

    // …

    @Override
    protected void loadApp(String appKey) {
      super.loadApp(appKey);
      RNBars.init(getPlainActivity(), "dark-content"); // <- initialize with initial bars styles (could be light-content)
    }
  }
}
```

3. To setup initial bar styles on Android < 8.1, edit your `android/app/src/main/res/values/styles.xml` file:<br>
   _👉 Dont forget to edit `android:windowLightStatusBar` to match your initial styles._

```xml
<resources>

  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    <!-- … -->

    <!-- Allow drawing under the system bars background -->
    <item name="android:windowDrawsSystemBarBackgrounds">true</item>
    <item name="android:fitsSystemWindows">false</item>

    <!-- Set status bar background transparent -->
    <item name="android:statusBarColor">@android:color/transparent</item>

    <!-- Navigation bar will stay translucent on Android < 8.1 -->
    <item name="android:windowTranslucentNavigation">true</item>
  </style>

</resources>
```

4. Then for Android >= 8.1, create (or edit) your `android/app/src/main/res/values-v27/styles.xml` file:<br>
   _👉 Dont forget to edit `android:{windowLightStatusBar,windowLightNavigationBar}` to match your initial styles._

```xml
<resources xmlns:tools="http://schemas.android.com/tools">

  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    <!-- … -->

    <!-- Allow drawing under the system bars background -->
    <item name="android:windowDrawsSystemBarBackgrounds">true</item>
    <item name="android:fitsSystemWindows">false</item>

    <!-- Set system bars background transparent -->
    <item name="android:statusBarColor">@android:color/transparent</item>
    <item name="android:navigationBarColor">@android:color/transparent</item>

    <!-- Disable auto contrasted system bars background -->
    <item name="android:enforceStatusBarContrast" tools:targetApi="q">false</item>
    <item name="android:enforceNavigationBarContrast" tools:targetApi="q">false</item>
  </style>

</resources>
```

#### With react-native-bootsplash

For a perfect `react-native-bars` + `react-native-bootsplash` match 💞, check the bootplash example app `styles.xml` files:

- [values/styles.xml](https://github.com/zoontek/react-native-bootsplash/blob/master/example/android/app/src/main/res/values/styles.xml)
- [values-v27/styles.xml](https://github.com/zoontek/react-native-bootsplash/blob/master/example/android/app/src/main/res/values-v27/styles.xml)

## iOS 

You can setup your initial status bar style in **Xcode > General > Deployment Info**:

![Xcode setup](https://raw.githubusercontent.com/zoontek/react-native-bars/HEAD/docs/xcode_setup.png?raw=true)

## Usage

```js
import * as React from "react";
import { StatusBar, NavigationBar, SystemBars } from "react-native-bars";

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
