import * as React from "react";
import { useState } from "react";
import { Fragment } from "react";
import LayoutComponent from "../components/LayoutComponent";
import DashboardComponent from "../components/DashboardComponent";

const Dashboard = () => {
  return (
    <Fragment>
      <LayoutComponent name="Dashboard">
        <DashboardComponent />
      </LayoutComponent>
    </Fragment>
  );
};

export default Dashboard;
