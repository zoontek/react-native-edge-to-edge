import { useEffect, useMemo, useRef } from "react";
import { Appearance, Platform, StatusBar, useColorScheme } from "react-native";
import NativeModule from "./specs/NativeEdgeToEdgeModule";
import { SystemBarsEntry, SystemBarsProps, SystemBarStyle } from "./types";

type NativeBarStyle = "default" | "light-content" | "dark-content";

function isLightColorScheme() {
  const colorScheme = Appearance?.getColorScheme() ?? "light";
  return colorScheme === "light";
}

function toNativeSystemBarStyle(
  style: SystemBarStyle | undefined,
): NativeBarStyle {
  switch (style) {
    case "light":
    case "dark":
      return `${style}-content`;
    case "auto":
      return isLightColorScheme() ? "dark-content" : "light-content";
    case "inverted":
      return isLightColorScheme() ? "light-content" : "dark-content";
    default:
      return "default";
  }
}

function expandStyleProp(style: SystemBarsProps["style"]) {
  const compact = typeof style === "string";

  return {
    statusBarStyle: compact ? style : style?.statusBar,
    navigationBarStyle: compact ? style : style?.navigationBar,
  };
}

function expandHiddenProp(hidden: SystemBarsProps["hidden"]) {
  const compact = typeof hidden === "boolean";

  return {
    statusBarHidden: compact ? hidden : hidden?.statusBar,
    navigationBarHidden: compact ? hidden : hidden?.navigationBar,
  };
}

function setStatusBarStyle(style: NativeBarStyle) {
  if (Platform.OS === "android") {
    NativeModule?.setStatusBarStyle(style);
  } else if (Platform.OS === "ios") {
    StatusBar.setBarStyle(style, true);
  }
}

function setNavigationBarStyle(style: NativeBarStyle) {
  if (Platform.OS === "android") {
    NativeModule?.setNavigationBarStyle(style);
  }
}

function setStatusBarHidden(hidden: boolean) {
  if (Platform.OS === "android") {
    NativeModule?.setStatusBarHidden(hidden);
  } else if (Platform.OS === "ios") {
    StatusBar.setHidden(hidden, "fade"); // 'slide' doesn't work in this context
  }
}

function setNavigationBarHidden(hidden: boolean) {
  if (Platform.OS === "android") {
    NativeModule?.setNavigationBarHidden(hidden);
  }
}

const defaultEntry: SystemBarsEntry & {
  statusBarHidden: boolean;
  navigationBarHidden: boolean;
} = {
  statusBarStyle: undefined,
  navigationBarStyle: undefined,
  statusBarHidden: false,
  navigationBarHidden: false,
};

/**
 * Merges the entries stack.
 */
function mergeEntriesStack(entriesStack: SystemBarsEntry[]) {
  return entriesStack.reduce<typeof defaultEntry>(
    (prev, cur) => {
      for (const prop in cur) {
        if (cur[prop as keyof SystemBarsEntry] != null) {
          // @ts-expect-error
          prev[prop] = cur[prop];
        }
      }
      return prev;
    },
    { ...defaultEntry },
  );
}

/**
 * Returns an object to insert in the props stack from the props.
 */
function createStackEntry({ hidden, style }: SystemBarsProps): SystemBarsEntry {
  const { statusBarStyle, navigationBarStyle } = expandStyleProp(style);
  const { statusBarHidden, navigationBarHidden } = expandHiddenProp(hidden);

  return {
    statusBarStyle,
    navigationBarStyle,
    statusBarHidden,
    navigationBarHidden,
  };
}

const entriesStack: SystemBarsEntry[] = [];

// Timer for updating the native module values at the end of the frame.
let updateImmediate: NodeJS.Immediate | null = null;

// The current merged values from the entries stack.
let currentMergedEntries: {
  statusBarStyle: NativeBarStyle;
  navigationBarStyle: NativeBarStyle;
  statusBarHidden: boolean;
  navigationBarHidden: boolean;
} = {
  statusBarStyle: "default",
  navigationBarStyle: "default",
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
      const mergedEntries = mergeEntriesStack(entriesStack);

      const statusBarStyle = toNativeSystemBarStyle(
        mergedEntries.statusBarStyle,
      );
      const navigationBarStyle = toNativeSystemBarStyle(
        mergedEntries.navigationBarStyle,
      );

      const { statusBarHidden, navigationBarHidden } = mergedEntries;

      if (statusBarStyle !== currentMergedEntries.statusBarStyle) {
        setStatusBarStyle(statusBarStyle);
      }
      if (statusBarHidden !== currentMergedEntries.statusBarHidden) {
        setStatusBarHidden(statusBarHidden);
      }
      if (navigationBarStyle !== currentMergedEntries.navigationBarStyle) {
        setNavigationBarStyle(navigationBarStyle);
      }
      if (navigationBarHidden !== currentMergedEntries.navigationBarHidden) {
        setNavigationBarHidden(navigationBarHidden);
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

/**
 * Set the SystemBars style.
 *
 * @param style SystemBars style to set.
 */
function setStyle(style: SystemBarsProps["style"]) {
  const { statusBarStyle, navigationBarStyle } = expandStyleProp(style);

  if (typeof statusBarStyle === "string") {
    defaultEntry.statusBarStyle = statusBarStyle;
    setStatusBarStyle(toNativeSystemBarStyle(statusBarStyle));
  }
  if (typeof navigationBarStyle === "string") {
    defaultEntry.navigationBarStyle = navigationBarStyle;
    setNavigationBarStyle(toNativeSystemBarStyle(navigationBarStyle));
  }
}

/**
 * Show or hide the SystemBars
 *
 * @param hidden Hide the SystemBars.
 */
function setHidden(hidden: SystemBarsProps["hidden"]) {
  const { statusBarHidden, navigationBarHidden } = expandHiddenProp(hidden);

  if (typeof statusBarHidden === "boolean") {
    defaultEntry.statusBarHidden = statusBarHidden;
    setStatusBarHidden(statusBarHidden);
  }
  if (typeof navigationBarHidden === "boolean") {
    defaultEntry.navigationBarHidden = navigationBarHidden;
    setNavigationBarHidden(navigationBarHidden);
  }
}

export function SystemBars({ hidden, style }: SystemBarsProps) {
  const { statusBarStyle, navigationBarStyle } = expandStyleProp(style);
  const { statusBarHidden, navigationBarHidden } = expandHiddenProp(hidden);

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
SystemBars.setStyle = setStyle;
SystemBars.setHidden = setHidden;
