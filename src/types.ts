type SystemBarsProp<T> = T | { statusBar?: T; navigationBar?: T };

export type SystemBarStyle = "auto" | "light" | "dark";

export type SystemBarsEntry = {
  statusBarHidden: boolean | undefined;
  statusBarStyle: SystemBarStyle | undefined;
  navigationBarHidden: boolean | undefined;
  navigationBarStyle: SystemBarStyle | undefined;
};

export type SystemBarsProps = {
  style?: SystemBarsProp<SystemBarStyle>;
  hidden?: SystemBarsProp<boolean>;
};
