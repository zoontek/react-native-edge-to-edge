export type SystemBarStyle = "light-content" | "dark-content";

export type StatusBarProps = {
  animated?: boolean;
  barStyle: SystemBarStyle;
};

export type NavigationBarProps = {
  barStyle: SystemBarStyle;
};

export type SystemBarsProps = StatusBarProps;
