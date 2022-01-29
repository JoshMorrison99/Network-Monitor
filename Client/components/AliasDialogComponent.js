import { React, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useRouter } from "next/router";

export default function FormDialog(props) {
  const router = useRouter();
  const [alias, setAlias] = useState("");
  const handleChange = async () => {
    console.log("handle change");
    try {
      const response = await axios.post(
        "http://localhost:8000/api/updatealias/",
        { alias: alias, ip: props.ip }
      );
      console.log(response);
      router.push(
        {
          pathname: "/devices",
        },
        undefined,
        { shallow: true }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Dialog open={props.open} onClose={props.handleClose}>
        <DialogTitle>Device Alias</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box fontStyle="italic" fontWeight="bold">
              {"IP: " + props.ip}
            </Box>
          </DialogContentText>
          <DialogContentText>
            <Box fontStyle="italic" fontWeight="bold">
              {"MAC: " + props.mac}
            </Box>
          </DialogContentText>
          <DialogContentText>
            <Box mb={4} fontStyle="italic" fontWeight="bold">
              {" "}
              {"Alias: " + props.alias}{" "}
            </Box>
          </DialogContentText>
          <DialogContentText mb={4}>
            Changing the alias of a device will make it easier to understand
            whose device is on the network.
          </DialogContentText>
          <DialogContentText>
            <Box fontStyle="italic">
              Put null if you want the IP to be displayed.
            </Box>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Alias"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setAlias(e.target.value)}
            inputProps={{ maxLength: 20 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              handleChange();
              props.handleClose();
            }}
          >
            Change
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
