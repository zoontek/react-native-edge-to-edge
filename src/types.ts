export type SystemBarStyle = "light" | "dark";

export type StatusBarProps = {
  animated?: boolean;
  style: SystemBarStyle;
};

export type NavigationBarProps = {
  style: SystemBarStyle;
};

export type SystemBarsProps = StatusBarProps;
