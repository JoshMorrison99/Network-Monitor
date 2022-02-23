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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TrafficAdversaryListComponent from "../components/TrafficAdversaryListComponent";
import TrafficListItemComponent from "../components/TrafficListItemComponent";
import axios from "axios";
import Stack from "@mui/material/Stack";
import { settings } from "../../config.json";
import Divider from "@mui/material/Divider";

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
  const [items_packet, setItems_Packet] = useState([]);
  const [packets, setPackets] = useState([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [m_adversary_mac, m_setAdversary_mac] = useState("");
  const [m_adversary_ip, m_setAdversary_ip] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [filter, setFilter] = React.useState("None");

  const [ethernet_count, set_ethernet_count] = React.useState(0);
  const [ip_count, set_ip_count] = React.useState(0);
  const [tcp_count, set_tcp_count] = React.useState(0);
  const [udp_count, set_udp_count] = React.useState(0);
  const [arp_count, set_arp_count] = React.useState(0);
  const [dns_count, set_dns_count] = React.useState(0);
  const [icmp_count, set_icmp_count] = React.useState(0);
  const [raw_count, set_raw_count] = React.useState(0);
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

  const Get_Packets = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/packetlist/");
      setPackets(response);
    } catch (err) {
      console.log(err);
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Auguest",
    "September",
    "October",
    "November",
    "December",
  ];

  const DatePrettifier = (date) => {
    var year = date.slice(0, 4);
    var month = date.slice(5, 7);
    var day = date.slice(8, 10);
    var hour = date.slice(11, 14);
    var displayHour = 0;
    var minute = date.slice(14, 16);
    var ampm = "";

    if (hour.slice(0, 2) > 12) {
      ampm = "pm";
      displayHour = hour.slice(0, 2) - 12;
    } else {
      ampm = "am";
    }

    var index = 0;
    if (month[0] == 0) {
      index = month[1];
    } else {
      index = month;
    }
    return (
      day +
      " " +
      months[index] +
      " " +
      year +
      ", " +
      displayHour +
      ":" +
      minute +
      "" +
      ampm
    );
  };

  const Create_List_Packets = () => {
    console.log(packets);
    if (Object.keys(packets).length != 0) {
      var myItems = [];
      for (var i = 0; i < packets["data"].length; i++) {
        myItems.push(
          <TrafficListItemComponent
            date_found={DatePrettifier(packets["data"][i]["date_found"])}
            ethernet_destination={packets["data"][i]["ethernet_destination"]}
            ethernet_source={packets["data"][i]["ethernet_source"]}
            ip_destination={packets["data"][i]["ip_destination"]}
            ip_source={packets["data"][i]["ip_source"]}
            arp_destination_ip={packets["data"][i]["arp_destination_ip"]}
            arp_destination_mac={packets["data"][i]["arp_destination_mac"]}
            arp_source_ip={packets["data"][i]["arp_source_ip"]}
            arp_source_mac={packets["data"][i]["arp_source_mac"]}
            raw_packet_data={packets["data"][i]["raw_packet_data"]}
            tcp_destination_port={packets["data"][i]["tcp_destination_port"]}
            tcp_flag={packets["data"][i]["tcp_flag"]}
            tcp_source_port={packets["data"][i]["tcp_source_port"]}
            upd_destination_port={packets["data"][i]["upd_destination_port"]}
            upd_source_port={packets["data"][i]["upd_source_port"]}
          />
        );
      }
      setItems_Packet(myItems);
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

  const calculateNumPacketTypes = () => {
    if (Object.keys(packets).length != 0) {
      for (var i = 0; i < packets["data"].length; i++) {
        if (packets["data"][i]["ethernet_destination"] != null) {
          set_ethernet_count((ethernet_count) => ethernet_count + 1);
        }
        if (packets["data"][i]["ip_destination"] != null) {
          set_ip_count((ip_count) => ip_count + 1);
        }
        if (packets["data"][i]["tcp_destination_port"] != null) {
          set_tcp_count((tcp_count) => tcp_count + 1);
        }
        if (packets["data"][i]["upd_destination_port"] != null) {
          set_udp_count((udp_count) => udp_count + 1);
        }
        if (packets["data"][i]["arp_destination_mac"] != null) {
          set_arp_count((arp_count) => arp_count + 1);
        }
        if (packets["data"][i]["raw_packet_data"] != null) {
          set_raw_count((raw_count) => raw_count + 1);
        }
      }
    }
  };

  useEffect(() => {
    Create_List();
    Create_List_Packets();
    calculateNumPacketTypes();
  }, [devices, packets]);

  useEffect(() => {
    Get_Devices();
    Get_Packets();
  }, []);

  const filterClicked = (filter) => {
    setFilter(filter);
  };
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
      <Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "& > *": {
              m: 1,
            },
          }}
        >
          <Stack direction="row" spacing={2}>
            {filter == "Ethernet" ? (
              <Button
                onClick={() => filterClicked("Ethernet")}
                variant="contained"
              >
                {"Ethernet " + ethernet_count}
              </Button>
            ) : (
              <Button
                onClick={() => filterClicked("Ethernet")}
                variant="outlined"
              >
                {"Ethernet " + ethernet_count}
              </Button>
            )}
            {filter == "IP" ? (
              <Button onClick={() => filterClicked("IP")} variant="contained">
                {"IP " + ip_count}
              </Button>
            ) : (
              <Button onClick={() => filterClicked("IP")} variant="outlined">
                {"IP " + ip_count}
              </Button>
            )}
            {filter == "TCP" ? (
              <Button onClick={() => filterClicked("TCP")} variant="contained">
                {"TCP " + tcp_count}
              </Button>
            ) : (
              <Button onClick={() => filterClicked("TCP")} variant="outlined">
                {"TCP " + tcp_count}
              </Button>
            )}
            {filter == "UDP" ? (
              <Button onClick={() => filterClicked("UDP")} variant="contained">
                {"UDP " + udp_count}
              </Button>
            ) : (
              <Button onClick={() => filterClicked("UDP")} variant="outlined">
                {"UDP " + udp_count}
              </Button>
            )}
            {filter == "ARP" ? (
              <Button Click={() => filterClicked("ARP")} variant="contained">
                {"ARP " + arp_count}
              </Button>
            ) : (
              <Button onClick={() => filterClicked("ARP")} variant="outlined">
                {"ARP " + arp_count}
              </Button>
            )}
            {filter == "DNS" ? (
              <Button onClick={() => filterClicked("DNS")} variant="contained">
                {"DNS " + dns_count}
              </Button>
            ) : (
              <Button onClick={() => filterClicked("DNS")} variant="outlined">
                {"DNS " + dns_count}
              </Button>
            )}
            {filter == "ICMP" ? (
              <Button onClick={() => filterClicked("ICMP")} variant="contained">
                {"ICMP " + icmp_count}
              </Button>
            ) : (
              <Button onClick={() => filterClicked("ICMP")} variant="outlined">
                {"ICMP " + icmp_count}
              </Button>
            )}
            {filter == "RAW" ? (
              <Button onClick={() => filterClicked("RAW")} variant="contained">
                {"RAW " + raw_count}
              </Button>
            ) : (
              <Button onClick={() => filterClicked("RAW")} variant="outlined">
                {"RAW " + raw_count}
              </Button>
            )}
            {filter == "None" ? (
              <Button onClick={() => filterClicked("None")} variant="contained">
                None
              </Button>
            ) : (
              <Button onClick={() => filterClicked("None")} variant="outlined">
                None
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
      <Box sx={{ width: "95%", margin: "20px", bgcolor: "background.paper" }}>
        <List sx={{ width: "95%", bgcolor: "background.paper" }}>
          {items_packet}
        </List>
      </Box>
    </Fragment>
  );
};

export default TrafficComponent;
