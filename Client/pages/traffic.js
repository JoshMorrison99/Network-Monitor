import * as React from "react";
import { Fragment } from "react";
import LayoutComponent from "../components/LayoutComponent";
import TrafficComponent from "../components/TrafficComponent";

const Traffic = () => {
  return (
    <Fragment>
      <LayoutComponent name="Traffic">
        <TrafficComponent></TrafficComponent>
      </LayoutComponent>
    </Fragment>
  );
};

export default Traffic;
