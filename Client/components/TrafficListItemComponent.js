import { Fragment, React, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import DraftsIcon from "@mui/icons-material/Drafts";
import { Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";

const PacketComponent = (props) => {
  const data = {
    id: "root",
    name: "Packet",
    children: [
      {
        id: "1",
        name: "Ethernet",
        children: [
          {
            id: "2",
            name: "Ethernet Destination: " + props.ethernet_destination,
          },
          {
            id: "3",
            name: "Ethernet Source: " + props.ethernet_source,
          },
        ],
      },
      {
        id: "4",
        name: "IP",
        children: [
          {
            id: "5",
            name: "IP Destination: " + props.ip_destination,
          },
          {
            id: "6",
            name: "IP Source: " + props.ip_source,
          },
        ],
      },
      {
        id: "7",
        name: "TCP",
        children: [
          {
            id: "8",
            name: "TCP Destination Port: " + props.tcp_destination_port,
          },
          {
            id: "9",
            name: "TCP Source Port: " + props.tcp_source_port,
          },
          {
            id: "10",
            name: "TCP Flag: " + props.tcp_flag,
          },
        ],
      },
      {
        id: "11",
        name: "UDP",
        children: [
          {
            id: "12",
            name: "UDP Destination Port: " + props.upd_destination_port,
          },
          {
            id: "13",
            name: "UDP Source Port: " + props.upd_source_port,
          },
        ],
      },
      {
        id: "14",
        name: "ARP",
        children: [
          {
            id: "15",
            name: "ARP Destination IP: " + props.arp_destination_ip,
          },
          {
            id: "16",
            name: "ARP Destination MAC: " + props.arp_destination_mac,
          },
          {
            id: "17",
            name: "ARP Source IP: " + props.arp_source_ip,
          },
          {
            id: "18",
            name: "ARP Source MAC: " + props.arp_source_mac,
          },
        ],
      },
      {
        id: "19",
        name: "RAW",
        children: [
          {
            id: "20",
            name: "RAW: " + props.raw_packet_data,
          },
        ],
      },
    ],
  };

  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );
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
                <EmailOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Destination: " + props.ethernet_destination}
                secondary={
                  <Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {"Source: " + props.ethernet_source}
                    </Typography>
                  </Fragment>
                }
              />
              <ListItemText
                align="right"
                primary={"Date Found: " + props.date_found}
              />
            </ListItemButton>
          </ListItem>
          <Divider variant="inset" component="li" />
        </AccordionSummary>
        <AccordionDetails>
          <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={["root"]}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ height: 400, flexGrow: 1, maxWidth: 1000, overflowY: "auto" }}
          >
            {renderTree(data)}
          </TreeView>
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
};

export default PacketComponent;
