import { useEffect, useMemo, useRef } from "react";
import { Appearance, Platform, StatusBar, useColorScheme } from "react-native";
import NativeModule from "./NativeRNEdgeToEdge";

export type SystemBarStyle = "auto" | "light" | "dark";

export type SystemBarsProps = {
  style?: SystemBarStyle;
  hidden?: boolean | { statusBar?: boolean; navigationBar?: boolean };
};

type SystemBarsEntry = {
  statusBarStyle: SystemBarStyle | undefined;
  statusBarHidden: boolean | undefined;
  navigationBarHidden: boolean | undefined;
};

function getColorScheme(): "light" | "dark" {
  return Appearance?.getColorScheme() ?? "light";
}

/**
 * Merges the entries stack.
 */
function mergeEntriesStack(
  entriesStack: SystemBarsEntry[],
): SystemBarsEntry | null {
  const mergedEntry = entriesStack.reduce<SystemBarsEntry>(
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
      statusBarHidden: undefined,
      navigationBarHidden: undefined,
    },
  );

  if (
    mergedEntry.statusBarStyle == null &&
    mergedEntry.statusBarHidden == null &&
    mergedEntry.navigationBarHidden == null
  ) {
    return null;
  } else {
    return mergedEntry;
  }
}

/**
 * Returns an object to insert in the props stack from the props.
 */
function createStackEntry(props: SystemBarsProps): SystemBarsEntry {
  return {
    statusBarStyle: props.style,
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
  statusBarStyle: "light" | "dark" | undefined;
  statusBarHidden: boolean | undefined;
  navigationBarHidden: boolean | undefined;
} | null = null;

/**
 * Updates the native system bars with the entries from the stack.
 */
function updateEntriesStack() {
  if (updateImmediate != null) {
    clearImmediate(updateImmediate);
  }

  updateImmediate = setImmediate(() => {
    const mergedEntries = mergeEntriesStack(entriesStack);

    if (mergedEntries != null) {
      const { statusBarHidden, navigationBarHidden } = mergedEntries;

      const statusBarStyle: "light" | "dark" | undefined =
        mergedEntries.statusBarStyle === "auto"
          ? getColorScheme() === "light"
            ? "dark"
            : "light"
          : mergedEntries.statusBarStyle;

      if (
        currentMergedEntries?.statusBarStyle !== statusBarStyle ||
        currentMergedEntries?.statusBarHidden !== statusBarHidden ||
        currentMergedEntries?.navigationBarHidden !== navigationBarHidden
      ) {
        if (Platform.OS === "android") {
          NativeModule?.setSystemBarsConfig({
            statusBarStyle,
            statusBarHidden,
            navigationBarHidden,
          });
        } else {
          // Emulate android behavior with react-native StatusBar
          if (statusBarStyle != null) {
            StatusBar.setBarStyle(`${statusBarStyle}-content`, true);
          }
          if (statusBarHidden != null) {
            StatusBar.setHidden(statusBarHidden, "fade"); // 'slide' doesn't work in this context
          }
        }
      }

      currentMergedEntries = {
        statusBarStyle,
        statusBarHidden,
        navigationBarHidden,
      };
    } else {
      currentMergedEntries = null;
    }
  });
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
  const statusBarHidden =
    typeof hidden === "boolean" ? hidden : hidden?.statusBar;
  const navigationBarHidden =
    typeof hidden === "boolean" ? hidden : hidden?.navigationBar;

  const stableProps = useMemo<SystemBarsProps>(
    () => ({
      hidden:
        statusBarHidden === navigationBarHidden
          ? statusBarHidden
          : { statusBar: statusBarHidden, navigationBar: navigationBarHidden },
      style,
    }),
    [style, statusBarHidden, navigationBarHidden],
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
