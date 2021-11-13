import * as React from "react";
import { StyleSheet, Text } from "react-native";
import {
  initialWindowMetrics,
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello world</Text>
    </SafeAreaView>
  );
};

export default () => (
  <SafeAreaProvider initialMetrics={initialWindowMetrics}>
    <App />
  </SafeAreaProvider>
);
