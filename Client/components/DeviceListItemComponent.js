import { Fragment, React } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import TvIcon from "@mui/icons-material/Tv";
import DraftsIcon from "@mui/icons-material/Drafts";
import { Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
};

export default DeviceListItemComponent;
