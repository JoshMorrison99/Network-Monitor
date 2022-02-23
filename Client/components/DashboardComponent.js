import React, { Fragment, useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const DashboardComponent = () => {
  const [packets, setPackets] = useState([]);
  const [devices, setDevices] = useState({});
  const [devicesList, setDevicesList] = useState([]);

  const Get_Packets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/packetprotocolamount/"
      );
      setPackets(response["data"]);
      console.log(response["data"]);
    } catch (err) {
      console.log(err);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Network Protocol Distribution",
      },
    },
  };

  const labels = ["TCP", "UDP", "ICMP", "ARP", "DNS"];

  const data = {
    labels,
    datasets: [
      {
        data: packets,
      },
    ],
  };

  const Get_Devices = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/devicelist/");
      setDevices(response);
    } catch (err) {
      console.log(err);
    }
  };

  function createData(IP, MAC, Alias, Vendor, OpenPorts) {
    return { IP, MAC, Alias, Vendor, OpenPorts };
  }

  const DeviceList = () => {
    if (Object.keys(devices).length != 0) {
      var newData = [];
      for (var i = 0; i < devices["data"].length; i++) {
        newData.push(
          createData(
            devices["data"][i]["ip"],
            devices["data"][i]["mac"],
            devices["data"][i]["alias"],
            devices["data"][i]["vendor"],
            devices["data"][i]["open_ports"]
          )
        );
      }
      setDevicesList(newData);
    }
  };

  useEffect(() => {
    DeviceList();
  }, [devices]);

  useEffect(() => {
    Get_Packets();
    Get_Devices();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <Bar options={options} data={data} />
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <Item>xs=6</Item>
        </Grid>
        <Grid item xs={6}>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Network Device Information</TableCell>
                  <TableCell align="right">MAC</TableCell>
                  <TableCell align="right">Alias</TableCell>
                  <TableCell align="right">Vendor</TableCell>
                  <TableCell align="right">Open Ports</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {console.log(devicesList)}
                {devicesList.map((row) => (
                  <TableRow key={row.IP}>
                    <TableCell component="th" scope="row">
                      {row.IP}
                    </TableCell>
                    <TableCell align="right">{row.MAC}</TableCell>
                    <TableCell align="right">{row.Alias}</TableCell>
                    <TableCell align="right">{row.Vendor}</TableCell>
                    <TableCell align="right">{row.OpenPorts}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardComponent;
