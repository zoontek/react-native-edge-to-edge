import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Appearance,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { NavigationBar, StatusBar, SystemBarStyle } from "react-native-bars";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  darkContainer: {
    backgroundColor: "#1F2937",
  },
  title: {
    color: "#374151",
    fontSize: 20,
    fontWeight: "700",
  },
  darkTitle: {
    color: "#E5E7EB",
  },
});

const Space = ({ size }: { size: number }) => (
  <View
    accessibilityRole="none"
    collapsable={true}
    style={{ height: size, width: size }}
  />
);

const Title = ({ text }: { text: string }) => {
  const dark = useColorScheme() === "dark";

  return (
    <>
      <Text style={[styles.title, dark && styles.darkTitle]}>{text}</Text>
      <Space size={16} />
    </>
  );
};

const BAR_STYLES: Record<number, SystemBarStyle> = {
  0: "auto",
  1: "light",
  2: "dark",
};

const App = () => {
  const dark = useColorScheme() === "dark";

  const [statusBarStyleIndex, setStatusBarStyleIndex] = useState(0);
  const [navigationBarStyleIndex, setNavigationBarStyleIndex] = useState(0);

  return (
    <SafeAreaView style={[styles.container, dark && styles.darkContainer]}>
      <StatusBar
        style={BAR_STYLES[statusBarStyleIndex] ?? "auto"}
        animated={true}
      />

      <NavigationBar style={BAR_STYLES[navigationBarStyleIndex] ?? "auto"} />

      <Title text="Theme" />

      <SegmentedControl
        values={["light", "dark"]}
        selectedIndex={dark ? 1 : 0}
        onChange={({ nativeEvent: { selectedSegmentIndex } }) => {
          Appearance.setColorScheme(
            selectedSegmentIndex === 1 ? "dark" : "light",
          );
        }}
      />

      <Space size={48} />

      <Title text="<StatusBar />" />

      <SegmentedControl
        values={Object.values(BAR_STYLES)}
        selectedIndex={statusBarStyleIndex}
        onChange={({ nativeEvent: { selectedSegmentIndex } }) => {
          setStatusBarStyleIndex(selectedSegmentIndex);
        }}
      />

      <Space size={32} />

      <Title text="<NavigationBar />" />

      <SegmentedControl
        values={Object.values(BAR_STYLES)}
        selectedIndex={navigationBarStyleIndex}
        onChange={({ nativeEvent: { selectedSegmentIndex } }) => {
          setNavigationBarStyleIndex(selectedSegmentIndex);
        }}
      />
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();

export default () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="App" component={App} />
    </Stack.Navigator>
  </NavigationContainer>
);
