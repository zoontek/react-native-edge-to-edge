export type SystemBarStyle = "auto" | "light" | "dark";

export type SystemBarsProps = {
  style?: SystemBarStyle;
  hidden?: boolean | { statusBar?: boolean; navigationBar?: boolean };
};
