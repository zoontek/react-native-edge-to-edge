import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useState } from "react";
import {
  Appearance,
  ColorSchemeName,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SystemBars, SystemBarStyle } from "react-native-edge-to-edge";

const DARK_BACKGROUND = "#1F2937";
const DARK_TEXT = "#374151";
const LIGHT_BACKGROUND = "#F9FAFB";
const LIGHT_TEXT = "#E5E7EB";

const styles = StyleSheet.create({
  container: {
    backgroundColor: LIGHT_BACKGROUND,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  darkContainer: {
    backgroundColor: DARK_BACKGROUND,
  },
  title: {
    color: DARK_TEXT,
    fontSize: 20,
    fontWeight: "700",
  },
  darkTitle: {
    color: LIGHT_TEXT,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    color: DARK_TEXT,
  },
  darkText: {
    color: LIGHT_TEXT,
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

const STYLES: SystemBarStyle[] = ["auto", "light", "dark"];

export const App = () => {
  const dark = useColorScheme() === "dark";

  const thumbColor = dark ? LIGHT_TEXT : "#fff";
  const trackColor = dark
    ? { false: "#1c1c1f", true: "#2b3e55" }
    : { false: "#eeeef0", true: "#ccd8e5" };

  const [styleIndex, setStyleIndex] = useState(0);
  const [statusBarHidden, setStatusBarHidden] = useState(false);
  const [navigationBarHidden, setNavigationBarHidden] = useState(false);

  return (
    <View style={[styles.container, dark && styles.darkContainer]}>
      <SystemBars
        style={STYLES[styleIndex]}
        hidden={{
          statusBar: statusBarHidden,
          navigationBar: navigationBarHidden,
        }}
      />

      <Title text="Theme" />

      <SegmentedControl
        values={["light", "dark"] satisfies ColorSchemeName[]}
        selectedIndex={dark ? 1 : 0}
        onValueChange={(value) => {
          Appearance.setColorScheme(value as ColorSchemeName);
        }}
      />

      <Space size={32} />

      <Title text="<SystemBars />" />

      <SegmentedControl
        values={STYLES}
        selectedIndex={styleIndex}
        onValueChange={(value) => {
          setStyleIndex(STYLES.indexOf(value as SystemBarStyle));
        }}
      />

      <Space size={16} />

      <View style={styles.row}>
        <Text style={[styles.text, dark && styles.darkText]}>
          Hide status bar
        </Text>

        <Switch
          thumbColor={thumbColor}
          trackColor={trackColor}
          value={statusBarHidden}
          onValueChange={setStatusBarHidden}
        />
      </View>

      <Space size={8} />

      <View style={styles.row}>
        <Text style={[styles.text, dark && styles.darkText]}>
          Hide navigation bar (no effect on iOS)
        </Text>

        <Switch
          thumbColor={thumbColor}
          trackColor={trackColor}
          value={navigationBarHidden}
          onValueChange={setNavigationBarHidden}
        />
      </View>
    </View>
  );
};
