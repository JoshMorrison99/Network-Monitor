import React, { useRef, useEffect, useState, Fragment } from "react";
import axios from "axios";
import * as d3 from "d3";
import { v4 as uuidv4 } from "uuid";
import AliasDialog from "./AliasDialogComponent";
import { settings } from "../../config.json";

const CreateLinks = (graph) => {
  var nodes = [];
  var links = [];
  for (var i = 0; i < graph["data"].length; i++) {
    var node = { ip: graph["data"][i]["ip"] };
    nodes.push(node);
  }

  for (var i = 0; i < nodes.length; i++) {
    var link = { source: settings[0]["default_gateway"], target: nodes[i] };
    links.push(link);
  }

  var new_graph = { nodes: nodes, links: links };
  return new_graph;
};

const ForceGraph = (props) => {
  const [animatedNodes, setAnimatedNodes] = useState([]);
  const [animatedLinks, setAnimatedLinks] = useState([]);
  const [graph, setGraph] = useState({});
  const [devices, setDevices] = useState({});
  const [clickedIP, setClickedIP] = React.useState(false);
  const [clickedMAC, setClickedMAC] = React.useState(false);
  const [clickedAlias, setClickedAlias] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const ip_or_alias = (node) => {
    for (var i = 0; i < devices["data"].length; i++) {
      if (devices["data"][i]["ip"] == node.ip) {
        if (
          devices["data"][i]["alias"] != null &&
          devices["data"][i]["alias"] != "null"
        ) {
          return (
            <text x={node.x - 45} y={node.y - 35} key={uuidv4()}>
              {devices["data"][i]["alias"]}
            </text>
          );
        } else {
          return (
            <text x={node.x - 45} y={node.y - 35} key={uuidv4()}>
              {devices["data"][i]["ip"]}
            </text>
          );
        }
      }
    }
  };

  const Get_Devices = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/devicelist/");
      var new_graph = CreateLinks(response);
      setDevices(response);
      console.log(devices);
      setGraph(() => new_graph);
    } catch (err) {
      console.log(err);
    }
  };

  const nodeClicked = (nodeIP) => {
    console.log(nodeIP);
    for (var i = 0; i < devices["data"].length; i++) {
      if (devices["data"][i]["ip"] == nodeIP["ip"]) {
        console.log(devices["data"][i]);
        setClickedIP(devices["data"][i]["ip"]);
        setClickedMAC(devices["data"][i]["mac"]);
        setClickedAlias(devices["data"][i]["alias"]);
        setOpen(true);
      }
    }
  };

  useEffect(() => {
    Get_Devices();
  }, []);

  useEffect(() => {
    const simulation = d3
      .forceSimulation(graph.nodes)
      .force(
        "link",
        d3.forceLink(graph.links).id((d) => d.ip)
      )
      .force("charge", d3.forceManyBody().strength(-5000))
      .force("center", d3.forceCenter(400, 400));

    // update state on every frame
    simulation.on("tick", () => {
      setAnimatedNodes([...simulation.nodes()]);
      setAnimatedLinks([...d3.forceLink(graph.links).links()]);
    });

    // slow down with a small alpha
    simulation.alpha(0.1).restart();

    // stop simulation on unmount
    return () => {
      simulation.stop();
    };
  }, [graph]);
  return (
    <Fragment>
      <g>
        {animatedNodes.map((node) => (
          <circle
            cx={node.x}
            cy={node.y}
            r={30}
            key={uuidv4()}
            stroke="black"
            fill="black"
            onClick={() => nodeClicked(node)}
          />
        ))}
      </g>
      <g>
        {animatedLinks.map((line) => (
          <line
            x1={line.source.x}
            y1={line.source.y}
            x2={line.target.x}
            y2={line.target.y}
            key={uuidv4()}
            stroke="black"
            strokeWidth={0.5}
          />
        ))}
      </g>
      <g>{animatedNodes.map((node) => ip_or_alias(node))}</g>
      {open ? (
        <AliasDialog
          handleClose={handleClose}
          open={open}
          ip={clickedIP}
          mac={clickedMAC}
          alias={clickedAlias}
        />
      ) : null}
    </Fragment>
  );
};

export default ForceGraph;
