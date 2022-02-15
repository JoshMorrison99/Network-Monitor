import * as React from "react";
import PestControlIcon from "@mui/icons-material/PestControl";
import MenuItem from "@mui/material/MenuItem";

const TrafficAdversaryListComponent = (props) => {
  return (
    <MenuItem
      onClick={() => {
        props.setAdversary(props.mac);
        props.handleClose();
      }}
    >
      <PestControlIcon />
      {props.mac}
    </MenuItem>
  );
};

export default TrafficAdversaryListComponent;
