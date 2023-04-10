import * as React from "react";
import { NavigationBar } from "./NavigationBar";
import { StatusBar } from "./StatusBar";
import { SystemBarsProps } from "./types";

export class SystemBars extends React.Component<SystemBarsProps> {
  override render(): React.ReactNode {
    return (
      <>
        <StatusBar
          animated={this.props.animated}
          barStyle={this.props.barStyle}
        />

        <NavigationBar barStyle={this.props.barStyle} />
      </>
    );
  }
}
