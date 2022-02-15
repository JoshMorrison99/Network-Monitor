import * as React from "react";
import { Fragment, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import RouterIcon from "@mui/icons-material/Router";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import { settings } from "../../config.json";
import axios from "axios";

const saveClicked = async (new_gateway) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/updategateway/",
      { gateway: new_gateway }
    );
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};

const SettingsComponent = () => {
  const [gateway, setGateway] = useState("");
  return (
    <Box m={4}>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <RouterIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Default Gateway" />
          <ListItemText align="right">
            <Fragment>
              {console.log(settings[0]["default_gateway"])}
              <TextField
                id="outlined-basic"
                label={settings[0]["default_gateway"]}
                variant="outlined"
                onChange={(e) => {
                  console.log(e);
                  setGateway(e.target.value);
                }}
              />
            </Fragment>
          </ListItemText>
        </ListItem>
      </List>
      <Box textAlign="right" m={3}>
        <Button
          startIcon={<SaveIcon />}
          color="primary"
          variant="contained"
          onClick={() => {
            saveClicked(gateway);
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsComponent;
