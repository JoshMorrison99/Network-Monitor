import * as React from "react";
import { Fragment } from "react";
import DeviceComponent from "../components/DevicesComponent";
import LayoutComponent from "../components/LayoutComponent";

const Devices = () => {
  return (
    <Fragment>
      <LayoutComponent name="Devices">
        <DeviceComponent />
      </LayoutComponent>
    </Fragment>
  );
};

export default Devices;
