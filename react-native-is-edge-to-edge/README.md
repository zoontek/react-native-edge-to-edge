# react-native-is-edge-to-edge

For library authors, we provide this lightweight package, which checks whether `react-native-edge-to-edge` is installed, making it easy to update your library accordingly:

## API

```jsx
import {
  isEdgeToEdge,
  controlEdgeToEdgeValues,
} from "react-native-is-edge-to-edge";

const EDGE_TO_EDGE = isEdgeToEdge();

function MyLibraryComponent({
  statusBarTranslucent,
  navigationBarTranslucent,
}) {
  if (__DEV__) {
    // warn the user once about unnecessary defined values
    controlEdgeToEdgeValues({ statusBarTranslucent, navigationBarTranslucent });
  }

  return (
    <MyLibraryNativeComponent
      statusBarTranslucent={EDGE_TO_EDGE || statusBarTranslucent}
      navigationBarTranslucent={EDGE_TO_EDGE || navigationBarTranslucent}
      // …
    />
  );
}
```
