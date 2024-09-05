# react-native-edge-to-edge

Enable [Edge-to-edge](https://developer.android.com/develop/ui/views/layout/edge-to-edge) mode in React Native.

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/zoontek/react-native-edge-to-edge/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-native-edge-to-edge?style=for-the-badge)](https://www.npmjs.org/package/react-native-edge-to-edge)
[![npm downloads](https://img.shields.io/npm/dt/react-native-edge-to-edge.svg?label=downloads&style=for-the-badge)](https://www.npmjs.org/package/react-native-edge-to-edge)

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

### Android

Edit your `android/app/src/main/res/values/styles.xml` file:<br>

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
const entry: SystemBarsProps = SystemBars.pushStackEntry(
  props /*: SystemBarsProps*/,
);
```

#### SystemBars.popStackEntry

```ts
SystemBars.popStackEntry(entry/*: SystemBarsProps*/): void;
```

#### SystemBars.replaceStackEntry

```ts
const entry: SystemBarsProps = SystemBars.replaceStackEntry(
  entry /*: SystemBarsProps*/,
  props /*: SystemBarsProps*/,
);
```

## Sponsors

This module is provided **as is**, I work on it in my free time.

If you or your company uses it in a production app, consider sponsoring this project 💰. You also can contact me for **premium** enterprise support: help with issues, prioritize bugfixes, feature requests, etc.

<a href="https://github.com/sponsors/zoontek"><img align="center" alt="Sponsors list" src="https://raw.githubusercontent.com/zoontek/sponsors/main/sponsorkit/sponsors.svg"></a>
