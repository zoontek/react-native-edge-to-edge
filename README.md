# ➖ react-native-bars

<a href="https://github.com/sponsors/zoontek">
  <img align="right" width="160" alt="This library helped you? Consider sponsoring!" src=".github/funding-octocat.svg">
</a>

Components to control your app status and navigation bars.

[![npm version](https://badge.fury.io/js/react-native-bars.svg)](https://www.npmjs.org/package/react-native-bars)
[![npm](https://img.shields.io/npm/dt/react-native-bars.svg)](https://www.npmjs.org/package/react-native-bars)
[![MIT](https://img.shields.io/dub/l/vibe-d.svg)](https://opensource.org/licenses/MIT)
<br>
[![Platform - Android](https://img.shields.io/badge/platform-Android-3ddc84.svg?style=flat&logo=android)](https://www.android.com)
[![Platform - iOS](https://img.shields.io/badge/platform-iOS-000.svg?style=flat&logo=apple)](https://developer.apple.com/ios)

<p>
  <img height="520" src="https://raw.githubusercontent.com/zoontek/react-native-bars/HEAD/docs/ios_demo.gif?raw=true" alt="iOS demo"></img>
  <img width="300" src="https://raw.githubusercontent.com/zoontek/react-native-bars/HEAD/docs/android_demo.gif?raw=true" alt="android demo"></img>
</p>

## Support

| version | RN version | Android version | iOS version |
| ------- | ---------- | --------------- | ----------- |
| 1.0.0+  | 0.65.0+    | 6.0+            | 11.0+       |

## Installation

```bash
$ yarn add react-native-bars
# --- or ---
$ npm i --save react-native-bars
```

## 🆘 Manual linking

Because this package targets React Native 0.65.0+, you will probably don't need to link it manually. Otherwise if it's not the case, follow this additional instructions:

<details>
  <summary><b>👀 See manual linking instructions</b></summary>

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

### Android

1. Edit your `android/build.gradle` file:

```gradle
buildscript {
  ext {
    buildToolsVersion = "30.0.2"
    minSdkVersion = 23 // <- set at least 23
    compileSdkVersion = 31 // <- set at least 31
    targetSdkVersion = 31 // <- set at least 31

    // …
```

2. Edit your `android/app/src/main/res/values/styles.xml` file:

```xml
<resources>

  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    <!-- StatusBar initial style: true = dark-content, false = light-content -->
    <item name="android:windowLightStatusBar">true</item>

    <!-- NavigationBar stays translucent on Android < 8.1 -->
    <item name="android:windowTranslucentNavigation">true</item>
  </style>

</resources>
```

3. Create (or edit) your `android/app/src/main/res/values-v27/styles.xml` file:

```xml
<resources>

  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    <!-- StatusBar initial style: true = dark-content, false = light-content -->
    <item name="android:windowLightStatusBar">true</item>

    <!-- NavigationBar initial style: true = dark-content, false = light-content -->
    <item name="android:windowLightNavigationBar">true</item>
  </style>

</resources>
```

4. Edit the `android/app/src/main/java/com/yourprojectname/MainActivity.java` file:

```java
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate; // <- add this necessary import
import com.zoontek.rnbars.RNBars; // <- add this necessary import

public class MainActivity extends ReactActivity {

  // …

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {

      @Override
      protected void loadApp(String appKey) {
        super.loadApp(appKey);
        RNBars.init(MainActivity.this); // <- initialize the module
      }
    };
  }
}
```

### iOS

![Xcode setup](https://raw.githubusercontent.com/zoontek/react-native-bars/HEAD/docs/xcode_setup.gif?raw=true)

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

### StatusBar

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

#### StatusBar.currentHeight

The height of the status bar, which includes the top notch height, if present.

```ts
const height: number = StatusBar.currentHeight;
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

### NavigationBar

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

#### NavigationBar.currentHeight

The height of the navigation bar, which includes the bottom notch height, if present.

```ts
const height: number = NavigationBar.currentHeight;
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

### SystemBars

A component to control both your app status and navigation bars.

```tsx
import { NavigationBar } from "react-native-bars";

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
