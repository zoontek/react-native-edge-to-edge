import { useEffect, useMemo, useRef } from "react";
import { Appearance, Platform, StatusBar, useColorScheme } from "react-native";
import NativeModule from "./specs/NativeEdgeToEdgeModule";
import { SystemBarsEntry, SystemBarsProps, SystemBarStyle } from "./types";

type ResolvedBarStyle = "light" | "dark" | undefined;

function isLightColorScheme() {
  const colorScheme = Appearance?.getColorScheme() ?? "light";
  return colorScheme === "light";
}

function resolveSystemBarStyle(
  style: SystemBarStyle | undefined,
): ResolvedBarStyle {
  switch (style) {
    case "auto":
      return isLightColorScheme() ? "dark" : "light";
    case "inverted":
      return isLightColorScheme() ? "light" : "dark";
    default:
      return style;
  }
}

function toNativeBarStyle(
  style: ResolvedBarStyle,
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

function resolveProps({ hidden, style }: SystemBarsProps) {
  const compactStyle = typeof style === "string";
  const compactHidden = typeof hidden === "boolean";

  return {
    statusBarStyle: compactStyle ? style : style?.statusBar,
    navigationBarStyle: compactStyle ? style : style?.navigationBar,
    statusBarHidden: compactHidden ? hidden : hidden?.statusBar,
    navigationBarHidden: compactHidden ? hidden : hidden?.navigationBar,
  };
}

/**
 * Returns an object to insert in the props stack from the props.
 */
function createStackEntry(props: SystemBarsProps): SystemBarsEntry {
  return resolveProps(props);
}

const entriesStack: SystemBarsEntry[] = [];

// Timer for updating the native module values at the end of the frame.
let updateImmediate: NodeJS.Immediate | null = null;

// The current merged values from the entries stack.
const currentValues: {
  statusBarStyle: ResolvedBarStyle;
  navigationBarStyle: ResolvedBarStyle;
  statusBarHidden: boolean;
  navigationBarHidden: boolean;
} = {
  statusBarStyle: undefined,
  navigationBarStyle: undefined,
  statusBarHidden: false,
  navigationBarHidden: false,
};

function setStatusBarStyle(style: ResolvedBarStyle) {
  if (style !== currentValues.statusBarStyle) {
    currentValues.statusBarStyle = style;

    const nativeStyle = toNativeBarStyle(style);

    if (Platform.OS === "android") {
      NativeModule?.setStatusBarStyle(nativeStyle);
    } else if (Platform.OS === "ios") {
      StatusBar.setBarStyle(nativeStyle, true);
    }
  }
}

function setNavigationBarStyle(style: ResolvedBarStyle) {
  if (style !== currentValues.navigationBarStyle) {
    currentValues.navigationBarStyle = style;

    if (Platform.OS === "android") {
      const nativeStyle = toNativeBarStyle(style);
      NativeModule?.setNavigationBarStyle(nativeStyle);
    }
  }
}

function setStatusBarHidden(hidden: boolean) {
  if (hidden !== currentValues.statusBarHidden) {
    currentValues.statusBarHidden = hidden;

    if (Platform.OS === "android") {
      NativeModule?.setStatusBarHidden(hidden);
    } else if (Platform.OS === "ios") {
      StatusBar.setHidden(hidden, "fade"); // 'slide' doesn't work in this context
    }
  }
}

function setNavigationBarHidden(hidden: boolean) {
  if (hidden !== currentValues.navigationBarHidden) {
    currentValues.navigationBarHidden = hidden;

    if (Platform.OS === "android") {
      NativeModule?.setNavigationBarHidden(hidden);
    }
  }
}

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
      const { statusBarHidden, navigationBarHidden } = mergedEntries;

      const statusBarStyle = resolveSystemBarStyle(
        mergedEntries.statusBarStyle,
      );
      const navigationBarStyle = resolveSystemBarStyle(
        mergedEntries.navigationBarStyle,
      );

      setStatusBarStyle(statusBarStyle);
      setNavigationBarStyle(navigationBarStyle);
      setStatusBarHidden(statusBarHidden);
      setNavigationBarHidden(navigationBarHidden);
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
  const props = resolveProps({ style });

  const statusBarStyle = resolveSystemBarStyle(props.statusBarStyle);
  const navigationBarStyle = resolveSystemBarStyle(props.navigationBarStyle);

  if (typeof statusBarStyle === "string") {
    setStatusBarStyle(statusBarStyle);
  }
  if (typeof navigationBarStyle === "string") {
    setNavigationBarStyle(navigationBarStyle);
  }
}

/**
 * Show or hide the SystemBars
 *
 * @param hidden Hide the SystemBars.
 */
function setHidden(hidden: SystemBarsProps["hidden"]) {
  const { statusBarHidden, navigationBarHidden } = resolveProps({ hidden });

  if (typeof statusBarHidden === "boolean") {
    setStatusBarHidden(statusBarHidden);
  }
  if (typeof navigationBarHidden === "boolean") {
    setNavigationBarHidden(navigationBarHidden);
  }
}

export function SystemBars(props: SystemBarsProps) {
  const {
    statusBarStyle,
    navigationBarStyle,
    statusBarHidden,
    navigationBarHidden,
  } = resolveProps(props);

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
