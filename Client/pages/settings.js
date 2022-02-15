import * as React from "react";
import { Fragment } from "react";
import LayoutComponent from "../components/LayoutComponent";
import SettingsComponent from "../components/SettingsComponent";

const Settings = () => {
  return (
    <Fragment>
      <LayoutComponent name="Settings">
        <SettingsComponent></SettingsComponent>
      </LayoutComponent>
    </Fragment>
  );
};

export default Settings;
