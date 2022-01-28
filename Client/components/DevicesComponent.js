import { React, useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import DeviceListItemComponent from "./DeviceListItemComponent";

const DeviceComponent = () => {
  const [devices, setDevices] = useState({});
  const [items, setItems] = useState([]);

  const Create_List = () => {
    if (Object.keys(devices).length != 0) {
      console.log(devices["data"]);
      var myItems = [];
      for (var i = 0; i < devices["data"].length; i++) {
        myItems.push(
          <DeviceListItemComponent name={devices["data"][i]["ip"]} />
        );
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
    <Box sx={{ width: "100%", margin: "20px", bgcolor: "background.paper" }}>
      <List>{items}</List>
    </Box>
  );
};

export default DeviceComponent;
