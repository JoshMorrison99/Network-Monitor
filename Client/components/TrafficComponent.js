import * as React from "react";
import { Fragment, useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import PestControlIcon from "@mui/icons-material/PestControl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { styled, alpha } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TrafficAdversaryListComponent from "../components/TrafficAdversaryListComponent";
import axios from "axios";
import Stack from "@mui/material/Stack";
import { settings } from "../../config.json";

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

const TrafficComponent = () => {
  const [devices, setDevices] = useState({});
  const [items, setItems] = useState([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [m_adversary_mac, m_setAdversary_mac] = useState("");
  const [m_adversary_ip, m_setAdversary_ip] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const attackClicked = async () => {
    if (isAttacking) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/arppoisioning/",
          {
            adversary_mac: m_adversary_mac,
            adversary_ip: m_adversary_ip,
            gateway: settings[0]["default_gateway"],
            isAttacking: isAttacking,
          }
        );
        console.log(response);
      } catch (err) {
        console.log(err);
      }
      setIsAttacking(false);
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/arppoisioning/",
          {
            adversary_mac: m_adversary_mac,
            adversary_ip: m_adversary_ip,
            gateway: settings[0]["default_gateway"],
            isAttacking: isAttacking,
          }
        );
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setAdversary = (mac, ip) => {
    m_setAdversary_mac(mac);
    m_setAdversary_ip(ip);
  };

  const Get_Devices = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/devicelist/");
      setDevices(response);
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
              handleClose={handleClose}
              setAdversary={setAdversary}
            />
          );
        }
      }
      setItems(myItems);
    }
  };

  useEffect(() => {
    Create_List();
    console.log(devices);
  }, [devices]);

  useEffect(() => {
    Get_Devices();
  }, []);

  return (
    <Fragment>
      <Box m={4}>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <PestControlIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                m_adversary_mac == "" ? "Select an adversary" : m_adversary_mac
              }
            />
            <ListItemText>
              <Stack justifyContent="right" spacing={3} direction="row">
                {m_adversary_mac == "" ? (
                  <Button disabled variant="contained" color="error">
                    Attack
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      attackClicked(), setIsAttacking(true);
                    }}
                  >
                    {isAttacking == true ? "Stop" : "Attack"}
                  </Button>
                )}

                <Button
                  id="demo-customized-button"
                  aria-controls={open ? "demo-customized-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  variant="contained"
                  disableElevation
                  onClick={handleClick}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  Options
                </Button>
              </Stack>
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                {items}
              </StyledMenu>
            </ListItemText>
          </ListItem>
        </List>
      </Box>
    </Fragment>
  );
};

export default TrafficComponent;
