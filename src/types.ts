export type SystemBarStyle = "auto" | "light" | "dark";

export type SystemBarsEntry = {
  statusBarHidden: boolean | undefined;
  statusBarStyle: SystemBarStyle | undefined;
  navigationBarHidden: boolean | undefined;
  navigationBarStyle: SystemBarStyle | undefined;
};

export type SystemBarsProps = {
  style?:
    | SystemBarStyle
    | { statusBar?: SystemBarStyle; navigationBar?: SystemBarStyle };
  hidden?: boolean | { statusBar?: boolean; navigationBar?: boolean };
};
