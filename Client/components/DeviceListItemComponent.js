import { Fragment, React } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import TvIcon from "@mui/icons-material/Tv";
import DraftsIcon from "@mui/icons-material/Drafts";
import { Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ReaderFriendlyPortConverter = (port_number) => {
  if (port_number == 21) {
    return "ftp";
  } else if (port_number == 22) {
    return "ssh";
  } else if (port_number == 23) {
    return "telnet";
  } else if (port_number == 25) {
    return "smtp";
  } else if (port_number == 53) {
    return "dns";
  } else if (port_number == 80) {
    return "http";
  } else if (port_number == 110) {
    return "pop3";
  } else if (port_number == 111) {
    return "rpcbind";
  } else if (port_number == 135) {
    return "msrpc";
  } else if (port_number == 139) {
    return "netbios-ssn";
  } else if (port_number == 143) {
    return "imap";
  } else if (port_number == 443) {
    return "https";
  } else if (port_number == 445) {
    return "microsoft-ds";
  } else if (port_number == 993) {
    return "pop3s";
  } else if (port_number == 1723) {
    return "pptp";
  } else if (port_number == 3306) {
    return "mysql";
  } else if (port_number == 3389) {
    return "rdp";
  } else if (port_number == 5900) {
    return "vnc";
  } else if (port_number == 8080) {
    return "http-proxy";
  } else if (port_number == 62078) {
    return "iphone-sync";
  }
};

const DeviceListItemComponent = (props) => {
  return (
    <Fragment>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <ListItem alignItems="flex-start">
            <ListItemButton>
              <ListItemIcon>
                <TvIcon />
              </ListItemIcon>
              <ListItemText
                primary={props.name}
                secondary={
                  <Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {props.alias}
                    </Typography>
                    {" — " + props.mac}
                  </Fragment>
                }
              />
              <ListItemText
                align="right"
                primary={"Date Found: " + props.date_found}
                secondary={
                  <Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                      align="right"
                    >
                      {"Last Seen: " + props.last_seen}
                    </Typography>
                  </Fragment>
                }
              />
            </ListItemButton>
          </ListItem>
          <Divider variant="inset" component="li" />
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            sx={{ display: "inline" }}
            component="span"
            variant="body2"
            color="text.primary"
            align="right"
          >
            {props.mac_vendor}
            <Divider></Divider>
            <Box mb={5}></Box>
            {props.open_ports != undefined && props.open_ports.length != 0 ? (
              <Fragment>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                  align="right"
                >
                  Open Ports
                </Typography>
                <ul>
                  {props.open_ports.map((item) => {
                    return (
                      <li align="left">
                        {item + " " + ReaderFriendlyPortConverter(item)}
                      </li>
                    );
                  })}
                </ul>
              </Fragment>
            ) : null}
          </Typography>
          {console.log(props.open_ports)}
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
};

export default DeviceListItemComponent;
