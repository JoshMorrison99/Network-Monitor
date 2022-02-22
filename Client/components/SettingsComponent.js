import * as React from "react";
import { Fragment, useState, useEffect } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import NoCellIcon from "@mui/icons-material/NoCell";
import HandymanIcon from "@mui/icons-material/Handyman";
import TrafficAdversaryListComponent from "../components/TrafficAdversaryListComponent";
import Stack from "@mui/material/Stack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";

const saveClicked = async (new_gateway) => {
  deleteClicked();
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={10} ref={ref} variant="filled" {...props} />;
});

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const SettingsComponent = () => {
  const [devices, setDevices] = useState({});
  const [items, setItems] = useState([]);
  const [gateway, setGateway] = useState("");
  const [m_adversary_mac, m_setAdversary_mac] = useState("");
  const [m_adversary_ip, m_setAdversary_ip] = useState("");
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open_arp = Boolean(anchorEl);

  const vertical = "bottom";
  const horizontal = "right";

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const deleteClicked = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:8000/api/deletedatabase/"
      );
      console.log(response);
      setOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  const Create_List = () => {
    if (Object.keys(devices).length != 0) {
      var myItems = [];
      for (var i = 0; i < devices["data"].length; i++) {
        if (
          devices["data"][i]["ip"] != settings[0]["default_gateway"] &&
          devices["data"][i]["mac"] != null
        ) {
          myItems.push(
            <TrafficAdversaryListComponent
              mac={devices["data"][i]["mac"]}
              ip={devices["data"][i]["ip"]}
              handleClose={handleClose_ARP}
              setAdversary={setAdversary}
            />
          );
        }
      }
      setItems(myItems);
    }
  };

  const setAdversary = (mac, ip) => {
    m_setAdversary_mac(mac);
    m_setAdversary_ip(ip);
  };

  useEffect(() => {
    Create_List();
  }, [devices]);

  const Get_Devices = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/devicelist/");
      setDevices(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    Get_Devices();
  }, []);

  const handleClick_ARP = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose_ARP = () => {
    setAnchorEl(null);
  };

  const FixARPClicked = async (mac, ip) => {
    try {
      const response = await axios.post("http://localhost:8000/api/fixarp/", {
        mac_fix: mac,
        ip_fix: ip,
        gateway: settings[0]["default_gateway"],
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      <Box m={4}>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <RouterIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Default Gateway"
              secondary="Warning: changing the gateway will delete the database"
            />
            <ListItemText align="right">
              <Fragment>
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
        </List>
      </Box>
      <Box m={4} bottom="0px">
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <DeleteIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Clear Database" />
            <ListItemText align="right">
              <Fragment>
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => {
                    deleteClicked();
                  }}
                >
                  Delete
                </Button>
              </Fragment>
            </ListItemText>
          </ListItem>
        </List>
      </Box>
      <Box m={4}>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <NoCellIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Fix ARP Cache" />
            <ListItemText align="right">
              <Fragment>
                <ListItem>
                  <ListItemText>
                    <Stack justifyContent="right" spacing={3} direction="row">
                      <Typography>{m_adversary_mac}</Typography>
                      <Button
                        id="demo-customized-button"
                        aria-controls={
                          open_arp ? "demo-customized-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={open_arp ? "true" : undefined}
                        variant="contained"
                        disableElevation
                        onClick={handleClick_ARP}
                        endIcon={<KeyboardArrowDownIcon />}
                      >
                        Options
                      </Button>
                      <Button
                        startIcon={<HandymanIcon />}
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          FixARPClicked(m_adversary_mac, m_adversary_ip);
                        }}
                      >
                        Fix
                      </Button>
                    </Stack>
                    <StyledMenu
                      id="demo-customized-menu"
                      MenuListProps={{
                        "aria-labelledby": "demo-customized-button",
                      }}
                      anchorEl={anchorEl}
                      open={open_arp}
                      onClose={handleClose_ARP}
                    >
                      {items}
                    </StyledMenu>
                  </ListItemText>
                </ListItem>
              </Fragment>
            </ListItemText>
          </ListItem>
        </List>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Database successfully deleted!
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

export default SettingsComponent;
