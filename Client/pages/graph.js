import * as React from "react";
import { Fragment } from "react";
import LayoutComponent from "../components/LayoutComponent";
import GraphComponentFull from "../components/GraphComponentFull";

const Graph = () => {
  return (
    <Fragment>
      <LayoutComponent name="Graph">
        <GraphComponentFull />
      </LayoutComponent>
    </Fragment>
  );
};

export default Graph;
