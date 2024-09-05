export type SystemBarStyle = "auto" | "light" | "dark";

export type SystemBarsEntry = {
  statusBarHidden: boolean | undefined;
  statusBarStyle: SystemBarStyle | undefined;
  navigationBarHidden: boolean | undefined;
};

export type SystemBarsProps = {
  style?: SystemBarStyle;
  hidden?: boolean | { statusBar?: boolean; navigationBar?: boolean };
};
