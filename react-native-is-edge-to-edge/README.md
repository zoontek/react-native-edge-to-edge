# react-native-is-edge-to-edge

For library authors, we provide a lightweight package that detects whether `react-native-edge-to-edge` is installed (and whether edge-to-edge is enabled), allowing you to act accordingly.

## API

```ts
import { isEdgeToEdge } from "react-native-is-edge-to-edge";

if (isEdgeToEdge()) {
  // …
}
```
