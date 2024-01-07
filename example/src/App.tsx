import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { NavigationBar, StatusBar } from "react-native-bars";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  title: {
    color: "#374151",
    fontSize: 20,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
  },
  tag: {
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  tagText: {
    color: "#374151",
    fontSize: 16,
    lineHeight: 32,
    textAlignVertical: "center",
  },
  darkTag: {
    backgroundColor: "#374151",
  },
  darkTagText: {
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

const Line = ({
  title,
  left,
  right,
  value,
  onValueChange,
  dark,
}: {
  title: string;
  left: string;
  right: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  dark: boolean;
}) => (
  <View>
    <Text style={[styles.title, dark && { color: "#E5E7EB" }]}>{title}</Text>
    <Space size={16} />

    <View style={styles.row}>
      <View style={[styles.tag, dark && styles.darkTag]}>
        <Text style={[styles.tagText, dark && styles.darkTagText]}>{left}</Text>
      </View>

      <Space size={16} />

      <Switch
        onValueChange={onValueChange}
        value={value}
        thumbColor={dark ? "#374151" : "#E5E7EB"}
        trackColor={{
          true: dark ? "#6B7280" : "#9CA3AF",
          false: dark ? "#6B7280" : "#9CA3AF",
        }}
      />

      <Space size={16} />

      <View style={[styles.tag, dark && styles.darkTag]}>
        <Text style={[styles.tagText, dark && styles.darkTagText]}>
          {right}
        </Text>
      </View>
    </View>
  </View>
);

const App = () => {
  const [isLightTheme, setIsLightTheme] = React.useState(true);
  const dark = !isLightTheme;

  const [isLightStatus, setIsLightStatus] = React.useState(false);
  const [isLightNavigation, setIsLightNavigation] = React.useState(false);

  return (
    <SafeAreaView
      style={[styles.container, dark && { backgroundColor: "#1F2937" }]}
    >
      <StatusBar
        barStyle={isLightStatus ? "light-content" : "dark-content"}
        animated={true}
      />
      <NavigationBar
        barStyle={isLightNavigation ? "light-content" : "dark-content"}
      />

      <Line
        title="Theme"
        left="dark"
        right="light"
        value={isLightTheme}
        onValueChange={setIsLightTheme}
        dark={dark}
      />

      <Space size={48} />

      <Line
        title="<StatusBar />"
        left="dark-content"
        right="light-content"
        value={isLightStatus}
        onValueChange={setIsLightStatus}
        dark={dark}
      />

      <Space size={32} />

      <Line
        title="<NavigationBar />"
        left="dark-content"
        right="light-content"
        value={isLightNavigation}
        onValueChange={setIsLightNavigation}
        dark={dark}
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
