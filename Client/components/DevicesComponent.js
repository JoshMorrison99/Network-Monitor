import { React, useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import DeviceListItemComponent from "./DeviceListItemComponent";

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

const AliasPrettifier = (string) => {
  if (string == null) {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const DatePrettifier = (date) => {
  var year = date.slice(0, 4);
  var month = date.slice(5, 7);
  var day = date.slice(8, 10);

  var index = 0;
  if (month[0] == 0) {
    index = month[1];
  } else {
    index = month;
  }
  return day + " " + months[index] + " " + year;
};

const DeviceComponent = () => {
  const [devices, setDevices] = useState({});
  const [items, setItems] = useState([]);

  const Create_List = () => {
    if (Object.keys(devices).length != 0) {
      console.log(devices["data"]);
      var myItems = [];
      for (var i = 0; i < devices["data"].length; i++) {
        myItems.push(
          <DeviceListItemComponent
            name={devices["data"][i]["ip"]}
            mac={devices["data"][i]["mac"]}
            date_found={DatePrettifier(devices["data"][i]["date_found"])}
            alias={AliasPrettifier(devices["data"][i]["alias"])}
            last_seen={DatePrettifier(
              AliasPrettifier(devices["data"][i]["last_seen"])
            )}
          />
        );
        console.log(devices["data"][i]["date_found"]);
      }
      setItems(myItems);
    }
  };

  const Get_Devices = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/devicelist/");
      setDevices(response);
    } catch (err) {
      console.log(err);
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
    <Box sx={{ width: "95%", margin: "20px", bgcolor: "background.paper" }}>
      <List sx={{ width: "95%", bgcolor: "background.paper" }}>{items}</List>
    </Box>
  );
};

export default DeviceComponent;
