import * as React from "react";
import { Platform } from "react-native";
import { NativeModule } from "./module";
import { NavigationBarProps } from "./types";

const isSupportedPlatform = Platform.OS === "android" && Platform.Version >= 27;

export class NavigationBar extends React.Component<NavigationBarProps> {
  private static propsStack: NavigationBarProps[] = [];
  private static immediate: NodeJS.Immediate | null = null;
  private static mergedProps: NavigationBarProps | null = null;

  private static createStackEntry({
    barStyle = "light-content",
  }: NavigationBarProps): NavigationBarProps {
    return { barStyle };
  }

  static currentHeight = NativeModule?.navigationBarHeight;

  static pushStackEntry(props: NavigationBarProps): NavigationBarProps {
    const entry = NavigationBar.createStackEntry(props);
    NavigationBar.propsStack.push(entry);
    NavigationBar.updatePropsStack();
    return entry;
  }

  static popStackEntry(entry: NavigationBarProps): void {
    const index = NavigationBar.propsStack.indexOf(entry);
    if (index !== -1) {
      NavigationBar.propsStack.splice(index, 1);
    }
    NavigationBar.updatePropsStack();
  }

  static replaceStackEntry(
    entry: NavigationBarProps,
    props: NavigationBarProps,
  ): NavigationBarProps {
    const newEntry = NavigationBar.createStackEntry(props);
    const index = NavigationBar.propsStack.indexOf(entry);
    if (index !== -1) {
      NavigationBar.propsStack[index] = newEntry;
    }
    NavigationBar.updatePropsStack();
    return newEntry;
  }

  private static updatePropsStack() {
    // Send the update to the native module only once at the end of the frame.
    if (NavigationBar.immediate !== null) {
      clearImmediate(NavigationBar.immediate);
    }

    NavigationBar.immediate = setImmediate(() => {
      const oldProps = NavigationBar.mergedProps;
      const lastEntry =
        NavigationBar.propsStack[NavigationBar.propsStack.length - 1];

      if (
        isSupportedPlatform &&
        lastEntry != null &&
        // Update only if style have changed.
        (!oldProps || oldProps.barStyle !== lastEntry.barStyle)
      ) {
        NativeModule?.setNavigationBarStyle(lastEntry.barStyle);
      }

      // Update the current prop values.
      NavigationBar.mergedProps = { barStyle: "light-content", ...lastEntry };
    });
  }

  private stackEntry: NavigationBarProps | null = null;

  componentDidMount() {
    this.stackEntry = NavigationBar.pushStackEntry(this.props);
  }

  componentDidUpdate() {
    if (this.stackEntry) {
      this.stackEntry = NavigationBar.replaceStackEntry(
        this.stackEntry,
        this.props,
      );
    }
  }

  componentWillUnmount() {
    if (this.stackEntry) {
      NavigationBar.popStackEntry(this.stackEntry);
    }
  }

  render(): React.ReactNode {
    return null;
  }
}
