# react-native-is-edge-to-edge

For library authors, we provide this lightweight package, which checks whether `react-native-edge-to-edge` is installed, making it easy to update your library accordingly:

## API

```jsx
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
object EdgeToEdgeUtil {
  val ENABLED: Boolean
    get() = try {
      // we cannot detect edge-to-edge, but we can detect react-native-edge-to-edge install
      Class.forName("com.zoontek.rnedgetoedge.EdgeToEdgePackage")
      true
    } catch (exception: ClassNotFoundException) {
      false
    }
}
```
