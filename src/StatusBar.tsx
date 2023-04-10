import * as React from "react";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import NativeModule from "./NativeRNBars";
import { StatusBarProps } from "./types";

function createStackEntry({
  animated = false,
  barStyle = "light-content",
}: StatusBarProps): StatusBarProps {
  return { animated, barStyle };
}

export class StatusBar extends React.Component<StatusBarProps> {
  private static propsStack: StatusBarProps[] = [];
  private static immediate: NodeJS.Immediate | null = null;
  private static mergedProps: StatusBarProps | null = null;

  static pushStackEntry(props: StatusBarProps): StatusBarProps {
    const entry = createStackEntry(props);
    StatusBar.propsStack.push(entry);
    StatusBar.updatePropsStack();
    return entry;
  }

  static popStackEntry(entry: StatusBarProps): void {
    const index = StatusBar.propsStack.indexOf(entry);
    if (index !== -1) {
      StatusBar.propsStack.splice(index, 1);
    }
    StatusBar.updatePropsStack();
  }

  static replaceStackEntry(
    entry: StatusBarProps,
    props: StatusBarProps,
  ): StatusBarProps {
    const newEntry = createStackEntry(props);
    const index = StatusBar.propsStack.indexOf(entry);
    if (index !== -1) {
      StatusBar.propsStack[index] = newEntry;
    }
    StatusBar.updatePropsStack();
    return newEntry;
  }

  private static updatePropsStack() {
    // Send the update to the native module only once at the end of the frame.
    if (StatusBar.immediate !== null) {
      clearImmediate(StatusBar.immediate);
    }

    StatusBar.immediate = setImmediate(() => {
      const oldProps = StatusBar.mergedProps;
      const lastEntry = StatusBar.propsStack[StatusBar.propsStack.length - 1];

      if (lastEntry != null) {
        // Update only if style have changed or if current props are unavailable.
        if (oldProps?.barStyle !== lastEntry.barStyle) {
          if (Platform.OS === "android") {
            NativeModule?.setStatusBarStyle(lastEntry.barStyle);
          } else {
            RNStatusBar.setBarStyle(lastEntry.barStyle, lastEntry.animated);
          }
        }

        // Update the current props values.
        StatusBar.mergedProps = { ...lastEntry };
      } else {
        // Reset current props when the stack is empty.
        StatusBar.mergedProps = null;
      }
    });
  }

  private stackEntry: StatusBarProps | null = null;

  override componentDidMount() {
    this.stackEntry = StatusBar.pushStackEntry(this.props);
  }

  override componentDidUpdate() {
    if (this.stackEntry) {
      this.stackEntry = StatusBar.replaceStackEntry(
        this.stackEntry,
        this.props,
      );
    }
  }

  override componentWillUnmount() {
    if (this.stackEntry) {
      StatusBar.popStackEntry(this.stackEntry);
    }
  }

  override render(): React.ReactNode {
    return null;
  }
}
