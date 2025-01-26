type SystemBarsProp<T> = T | { statusBar?: T; navigationBar?: T };

export type SystemBarStyle = "auto" | "light" | "dark";

export type SystemBarsEntry = {
  statusBarStyle: SystemBarStyle | undefined;
  navigationBarStyle: SystemBarStyle | undefined;
  statusBarHidden: boolean | undefined;
  navigationBarHidden: boolean | undefined;
};

export type SystemBarsProps = {
  style?: SystemBarsProp<SystemBarStyle>;
  hidden?: SystemBarsProp<boolean>;
};
