# react-native-edge-to-edge

Effortlessly enable [edge-to-edge display](https://developer.android.com/develop/ui/views/layout/edge-to-edge) in React Native, allowing your app content to flow seamlessly beneath the status bar and navigation bar.

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/zoontek/react-native-edge-to-edge/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-native-edge-to-edge?style=for-the-badge)](https://www.npmjs.org/package/react-native-edge-to-edge)
[![npm downloads](https://img.shields.io/npm/dt/react-native-edge-to-edge.svg?label=downloads&style=for-the-badge)](https://www.npmjs.org/package/react-native-edge-to-edge)

<img width="250" src="./docs/logo.svg" alt="Logo">

## Support

This library follows the React Native [releases support policy](https://github.com/reactwg/react-native-releases/blob/main/docs/support.md).<br>
It is supporting the **latest version**, and the **two previous minor series**.

## Installation

```bash
$ npm install --save react-native-edge-to-edge
# --- or ---
$ yarn add react-native-edge-to-edge
```

## Recommendations

This module will works best with:

- [react-native-keyboard-controller](https://github.com/kirillzyusko/react-native-keyboard-controller): A better approach to keyboard handling than `KeyboardAvoidingView`.
- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context): A flexible way to handle safe area insets.

## Setup

### Expo

Add the plugin in your `app.json`:

```diff
{
  "expo": {
+   "plugins": ["react-native-edge-to-edge"]
  }
}
```

### Bare React Native

Edit your `android/app/src/main/res/values/styles.xml` file to inherit from `Theme.EdgeToEdge`:<br>

```xml
<resources>
  <!-- make AppTheme inherit from Theme.EdgeToEdge -->
  <style name="AppTheme" parent="Theme.EdgeToEdge">
    <!-- … -->
  </style>
</resources>
```

## API

### `<SystemBars />`

A component to control your app system bars.

```tsx
import { SystemBars } from "react-native-edge-to-edge";

type SystemBarsProps = {
  // Sets the color of the status bar content
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
SystemBars.popStackEntry(entry/*: SystemBarsEntry */): void;
```

#### SystemBars.replaceStackEntry

```ts
const entry: SystemBarsEntry = SystemBars.replaceStackEntry(
  entry /*: SystemBarsEntry */,
  props /*: SystemBarsProps */,
);
```

## Credits

This project has been built and is maintained thanks to the support from [Expo.io](https://expo.io)

<a href="https://expo.io">
  <img width="200" src="./docs/expo.svg" alt="Expo">
</a>
