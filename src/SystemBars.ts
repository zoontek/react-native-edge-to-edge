import { useEffect, useMemo, useRef } from "react";
import { Appearance, Platform, StatusBar, useColorScheme } from "react-native";
import NativeModule from "./specs/NativeEdgeToEdgeModule";
import { SystemBarsEntry, SystemBarsProps, SystemBarStyle } from "./types";

type MergeableBarStyle = "light" | "dark" | undefined;

function getColorScheme(): "light" | "dark" {
  return Appearance?.getColorScheme() ?? "light";
}

function toNativeBarStyle(
  style: MergeableBarStyle,
): "default" | "light-content" | "dark-content" {
  return style === "light" || style === "dark" ? `${style}-content` : "default";
}

/**
 * Merges the entries stack.
 */
function mergeEntriesStack(entriesStack: SystemBarsEntry[]) {
  return entriesStack.reduce<{
    statusBarStyle: SystemBarStyle | undefined;
    navigationBarStyle: SystemBarStyle | undefined;
    statusBarHidden: boolean;
    navigationBarHidden: boolean;
  }>(
    (prev, cur) => {
      for (const prop in cur) {
        if (cur[prop as keyof SystemBarsEntry] != null) {
          // @ts-expect-error
          prev[prop] = cur[prop];
        }
      }
      return prev;
    },
    {
      statusBarStyle: undefined,
      navigationBarStyle: undefined,
      statusBarHidden: false,
      navigationBarHidden: false,
    },
  );
}

/**
 * Returns an object to insert in the props stack from the props.
 */
function createStackEntry(props: SystemBarsProps): SystemBarsEntry {
  return {
    statusBarStyle:
      typeof props.style === "string" ? props.style : props.style?.statusBar,
    navigationBarStyle:
      typeof props.style === "string"
        ? props.style
        : props.style?.navigationBar,
    statusBarHidden:
      typeof props.hidden === "boolean"
        ? props.hidden
        : props.hidden?.statusBar,
    navigationBarHidden:
      typeof props.hidden === "boolean"
        ? props.hidden
        : props.hidden?.navigationBar,
  };
}

const entriesStack: SystemBarsEntry[] = [];

// Timer for updating the native module values at the end of the frame.
let updateImmediate: NodeJS.Immediate | null = null;

// The current merged values from the entries stack.
let currentMergedEntries: {
  statusBarStyle: MergeableBarStyle;
  navigationBarStyle: MergeableBarStyle;
  statusBarHidden: boolean;
  navigationBarHidden: boolean;
} = {
  statusBarStyle: undefined,
  navigationBarStyle: undefined,
  statusBarHidden: false,
  navigationBarHidden: false,
};

/**
 * Updates the native system bars with the entries from the stack.
 */
function updateEntriesStack() {
  if (Platform.OS === "android" || Platform.OS === "ios") {
    if (updateImmediate != null) {
      clearImmediate(updateImmediate);
    }

    updateImmediate = setImmediate(() => {
      const autoBarStyle = getColorScheme() === "light" ? "dark" : "light";
      const mergedEntries = mergeEntriesStack(entriesStack);

      const statusBarStyle: MergeableBarStyle =
        mergedEntries.statusBarStyle === "auto"
          ? autoBarStyle
          : mergedEntries.statusBarStyle;

      const navigationBarStyle: MergeableBarStyle =
        mergedEntries.navigationBarStyle === "auto"
          ? autoBarStyle
          : mergedEntries.navigationBarStyle;

      const { statusBarHidden, navigationBarHidden } = mergedEntries;

      if (statusBarStyle !== currentMergedEntries.statusBarStyle) {
        const style = toNativeBarStyle(statusBarStyle);

        Platform.OS === "android"
          ? NativeModule?.setStatusBarStyle(style)
          : StatusBar.setBarStyle(style, true);
      }

      if (statusBarHidden !== currentMergedEntries.statusBarHidden) {
        Platform.OS === "android"
          ? NativeModule?.setStatusBarHidden(statusBarHidden)
          : StatusBar.setHidden(statusBarHidden, "fade"); // 'slide' doesn't work in this context
      }

      if (Platform.OS === "android") {
        if (navigationBarStyle !== currentMergedEntries.navigationBarStyle) {
          const style = toNativeBarStyle(navigationBarStyle);
          NativeModule?.setNavigationBarStyle(style);
        }

        if (navigationBarHidden !== currentMergedEntries.navigationBarHidden) {
          NativeModule?.setNavigationBarHidden(navigationBarHidden);
        }
      }

      currentMergedEntries = {
        statusBarStyle,
        navigationBarStyle,
        statusBarHidden,
        navigationBarHidden,
      };
    });
  }
}

/**
 * Push a SystemBars entry onto the stack.
 * The return value should be passed to `popStackEntry` when complete.
 *
 * @param props Object containing the SystemBars props to use in the stack entry.
 */
function pushStackEntry(props: SystemBarsProps): SystemBarsEntry {
  const entry = createStackEntry(props);
  entriesStack.push(entry);
  updateEntriesStack();
  return entry;
}

/**
 * Pop a SystemBars entry from the stack.
 *
 * @param entry Entry returned from `pushStackEntry`.
 */
function popStackEntry(entry: SystemBarsEntry): void {
  const index = entriesStack.indexOf(entry);
  if (index !== -1) {
    entriesStack.splice(index, 1);
  }
  updateEntriesStack();
}

/**
 * Replace an existing SystemBars stack entry with new props.
 *
 * @param entry Entry returned from `pushStackEntry` to replace.
 * @param props Object containing the SystemBars props to use in the replacement stack entry.
 */
function replaceStackEntry(
  entry: SystemBarsEntry,
  props: SystemBarsProps,
): SystemBarsEntry {
  const newEntry = createStackEntry(props);
  const index = entriesStack.indexOf(entry);
  if (index !== -1) {
    entriesStack[index] = newEntry;
  }
  updateEntriesStack();
  return newEntry;
}

export function SystemBars({ hidden, style }: SystemBarsProps) {
  const statusBarStyle = typeof style === "string" ? style : style?.statusBar;
  const navigationBarStyle =
    typeof style === "string" ? style : style?.navigationBar;
  const statusBarHidden =
    typeof hidden === "boolean" ? hidden : hidden?.statusBar;
  const navigationBarHidden =
    typeof hidden === "boolean" ? hidden : hidden?.navigationBar;

  const stableProps = useMemo<SystemBarsProps>(
    () => ({
      style:
        statusBarStyle === navigationBarStyle
          ? statusBarStyle
          : { statusBar: statusBarStyle, navigationBar: navigationBarStyle },
      hidden:
        statusBarHidden === navigationBarHidden
          ? statusBarHidden
          : { statusBar: statusBarHidden, navigationBar: navigationBarHidden },
    }),
    [statusBarStyle, navigationBarStyle, statusBarHidden, navigationBarHidden],
  );

  const colorScheme = useColorScheme();
  const stackEntryRef = useRef<SystemBarsEntry | null>(null);

  useEffect(() => {
    // Every time a SystemBars component is mounted, we push it's prop to a stack
    // and always update the native system bars with the props from the top of then
    // stack. This allows having multiple SystemBars components and the one that is
    // added last or is deeper in the view hierarchy will have priority.
    stackEntryRef.current = pushStackEntry(stableProps);

    return () => {
      // When a SystemBars is unmounted, remove itself from the stack and update
      // the native bars with the next props.
      if (stackEntryRef.current) {
        popStackEntry(stackEntryRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (stackEntryRef.current) {
      stackEntryRef.current = replaceStackEntry(
        stackEntryRef.current,
        stableProps,
      );
    }
  }, [colorScheme, stableProps]);

  return null;
}

SystemBars.pushStackEntry = pushStackEntry;
SystemBars.popStackEntry = popStackEntry;
SystemBars.replaceStackEntry = replaceStackEntry;
