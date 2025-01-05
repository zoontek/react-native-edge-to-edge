import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import * as React from "react";
import { ReactNode, useEffect, useState } from "react";
import {
  Appearance,
  Text as BaseText,
  Modal,
  Platform,
  StyleProp,
  StyleSheet,
  Switch,
  TextProps,
  TouchableOpacity,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";
import { SystemBars, SystemBarStyle } from "react-native-edge-to-edge";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

const Space = ({ size }: { size: number }) => (
  <View
    accessibilityRole="none"
    collapsable={true}
    style={{ height: size, width: size }}
  />
);

const Text = ({ style, ...props }: TextProps) => {
  const dark = useColorScheme() === "dark";

  return (
    <BaseText
      style={[{ color: dark ? LIGHT_TEXT : DARK_TEXT }, style]}
      {...props}
    />
  );
};

const Title = ({ children }: { children: ReactNode }) => (
  <>
    <Text style={{ fontSize: 20, fontWeight: "700" }}>{children}</Text>
    <Space size={16} />
  </>
);

const Button = ({
  title,
  style,
  onPress,
}: {
  title: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}) => {
  const dark = useColorScheme() === "dark";

  return (
    <TouchableOpacity
      role="button"
      onPress={onPress}
      activeOpacity={0.5}
      style={[
        {
          borderRadius: 8,
          padding: 10,
          backgroundColor: dark ? "#374151" : "#e5e7eb",
        },
        style,
      ]}
    >
      <Text style={{ textAlign: "center", fontWeight: "600" }}>{title}</Text>
    </TouchableOpacity>
  );
};

const SCHEMES = ["system", "light", "dark"];
const STYLES: SystemBarStyle[] = ["auto", "light", "dark"];

type StackParamList = {
  Home: undefined;
  Modal: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

const ModalContent = ({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) => {
  const dark = useColorScheme() === "dark";

  const [styleIndex, setStyleIndex] = useState(0);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, dark && styles.darkContainer]}>
      <Button
        title="Close"
        onPress={onClose}
        style={{
          position: "absolute",
          top: (Platform.OS === "ios" ? 0 : insets.top) + 8,
          right: insets.right + 8,
        }}
      />

      <SystemBars style={STYLES[styleIndex]} />

      <Text>{children}</Text>
      <Space size={16} />

      <SegmentedControl
        values={STYLES}
        selectedIndex={styleIndex}
        onValueChange={(value) => {
          setStyleIndex(STYLES.indexOf(value as SystemBarStyle));
        }}
      />
    </View>
  );
};

export const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<StackParamList, "Home">) => {
  const dark = useColorScheme() === "dark";

  const thumbColor = dark ? LIGHT_TEXT : "#fff";
  const trackColor = dark
    ? { false: "#1c1c1f", true: "#2b3e55" }
    : { false: "#eeeef0", true: "#ccd8e5" };

  const [schemeIndex, setSchemeIndex] = useState(0);
  const [styleIndex, setStyleIndex] = useState(0);
  const [statusBarHidden, setStatusBarHidden] = useState(false);
  const [navigationBarHidden, setNavigationBarHidden] = useState(false);
  const [reactNativeModalVisible, setReactNativeModalVisible] = useState(false);

  useEffect(() => {
    const value = SCHEMES[schemeIndex];
    const scheme = value === "light" || value === "dark" ? value : null;
    Appearance.setColorScheme(scheme);
  }, [schemeIndex]);

  const closeReactNativeModal = () => {
    setReactNativeModalVisible(false);
  };

  return (
    <View style={[styles.container, dark && styles.darkContainer]}>
      <SystemBars
        style={STYLES[styleIndex]}
        hidden={{
          statusBar: statusBarHidden,
          navigationBar: navigationBarHidden,
        }}
      />

      <Title>Theme</Title>

      <SegmentedControl
        appearance={dark ? "dark" : "light"}
        values={SCHEMES}
        selectedIndex={schemeIndex}
        onValueChange={(value) => {
          setSchemeIndex(SCHEMES.indexOf(value));
        }}
      />

      <Space size={32} />

      <Title>{"<SystemBars />"}</Title>

      <SegmentedControl
        appearance={dark ? "dark" : "light"}
        values={STYLES}
        selectedIndex={styleIndex}
        onValueChange={(value) => {
          setStyleIndex(STYLES.indexOf(value as SystemBarStyle));
        }}
      />

      <Space size={16} />

      <View style={styles.row}>
        <Text>Hide status bar</Text>

        <Switch
          thumbColor={thumbColor}
          trackColor={trackColor}
          value={statusBarHidden}
          onValueChange={setStatusBarHidden}
        />
      </View>

      <Space size={8} />

      <View style={styles.row}>
        <Text>Hide navigation bar (no effect on iOS)</Text>

        <Switch
          thumbColor={thumbColor}
          trackColor={trackColor}
          value={navigationBarHidden}
          onValueChange={setNavigationBarHidden}
        />
      </View>

      <Space size={16} />

      <Button
        title="Open React Native Modal"
        onPress={() => {
          setReactNativeModalVisible(true);
        }}
      />

      <Space size={8} />

      <Button
        title="Open React Navigation Modal"
        onPress={() => {
          navigation.navigate("Modal");
        }}
      />

      <Modal
        visible={reactNativeModalVisible}
        statusBarTranslucent={true}
        animationType="slide"
        presentationStyle="pageSheet"
        onDismiss={closeReactNativeModal}
        onRequestClose={closeReactNativeModal}
      >
        <ModalContent onClose={closeReactNativeModal}>
          This modal uses the React Native Modal component.{"\n"}On Android, you
          cannot update the status bar style or hide system bars.
        </ModalContent>
      </Modal>
    </View>
  );
};

const ModalScreen = ({
  navigation,
}: NativeStackScreenProps<StackParamList, "Modal">) => (
  <ModalContent onClose={navigation.goBack}>
    This modal uses a React Navigation modal.{"\n"}Eveything behaves correctly.
  </ModalContent>
);

export const App = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen
        name="Modal"
        component={ModalScreen}
        options={{
          presentation: "modal",
          animation:
            Platform.OS === "android" ? "slide_from_bottom" : "default",
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
