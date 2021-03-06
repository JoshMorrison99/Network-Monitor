import { React, useState, Fragment, useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GraphIcon from "@mui/icons-material/Timeline";
import NetworkIcon from "@mui/icons-material/NetworkCheck";
import DeviceIcon from "@mui/icons-material/PhoneAndroid";
import SettingsIcon from "@mui/icons-material/Settings";
import RadarIcon from "@mui/icons-material/Radar";
import DeviceNetwork from "./GraphComponent";
import Link from "next/link";
import useInterval from "react-useinterval";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

const LayoutComponent = (props) => {
  const [open, setOpen] = useState(true);
  const [scanActive, setscanActive] = useState(false);
  const [scanCounter, setScanCounter] = useState(0);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const timer = () => {
    if (scanActive) {
      setScanCounter(scanCounter + 1);
      console.log(scanCounter);
      if (scanCounter >= 60) {
        // button get ability to runs every 60 Seconds
        setscanActive(false);
        setScanCounter(0);
        window.location.reload();
      }
    }
  };

  const Scan_Devices = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/devicescan/");
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const dataIsScanning = localStorage.getItem("scanningActive");
    const dataScanCounter = localStorage.getItem("scanningCounter");
    if (dataIsScanning) {
      setscanActive(JSON.parse(dataIsScanning));
      setScanCounter(JSON.parse(dataScanCounter));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("scanningActive", JSON.stringify(scanActive));
    localStorage.setItem("scanningCounter", JSON.stringify(scanCounter));
  });

  useInterval(timer, 1000);

  const toggleScan = () => {
    setscanActive(true);

    Scan_Devices();
    window.location.reload();
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {props.name}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
            <div>
              <Link href="/">
                <ListItem button>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              </Link>
              <Link href="/graph">
                <ListItem button>
                  <ListItemIcon>
                    <GraphIcon />
                  </ListItemIcon>
                  <ListItemText primary="Graph" />
                </ListItem>
              </Link>
              <Link href="/traffic">
                <ListItem button>
                  <ListItemIcon>
                    <NetworkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Traffic" />
                </ListItem>
              </Link>
              <Link href="/devices">
                <ListItem button>
                  <ListItemIcon>
                    <DeviceIcon />
                  </ListItemIcon>
                  <ListItemText primary="Devices" />
                </ListItem>
              </Link>
            </div>
          </List>
          <Divider />
          <List>
            {scanActive ? <LinearProgress /> : null}
            <div>
              <ListItem button onClick={toggleScan} disabled={scanActive}>
                <ListItemIcon>
                  <RadarIcon />
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Fragment>
                      {scanActive ? (
                        <Typography>Network Scan {scanCounter}</Typography>
                      ) : (
                        <Typography>Network Scan </Typography>
                      )}
                    </Fragment>
                  }
                />
              </ListItem>
            </div>
          </List>
          <Box position="absolute" bottom="0px" mt={3} width="100%">
            <List>
              <Link href="/settings">
                <ListItem button>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItem>
              </Link>
            </List>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          {props.children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LayoutComponent;
