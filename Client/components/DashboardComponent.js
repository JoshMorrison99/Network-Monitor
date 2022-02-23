import React, { Fragment, useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import DeviceNetwork from "./GraphComponent";
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

  useEffect(() => {
    Get_Packets();
  }, []);

  console.log(data);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <Bar options={options} data={data} />
        </Grid>
        <Grid item xs={6}>
          <Item>xs=6</Item>
        </Grid>
        <Grid item xs={6}>
          <Item>xs=6</Item>
        </Grid>
        <Grid item xs={6}>
          <Item>xs=6</Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardComponent;
