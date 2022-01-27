import React, { useRef, useEffect, useState, Fragment } from "react";
import axios from "axios";
import useInterval from "react-useinterval";
import * as d3 from "d3";
import { v4 as uuidv4 } from "uuid";

const CreateLinks = (graph) => {
  var nodes = [];
  var links = [];
  for (var i = 0; i < graph["data"].length; i++) {
    var node = { ip: graph["data"][i]["ip"] };
    nodes.push(node);
  }

  for (var i = 0; i < nodes.length; i++) {
    var link = { source: "192.168.2.1", target: nodes[i] };
    links.push(link);
  }

  var new_graph = { nodes: nodes, links: links };
  return new_graph;
};

const ForceGraph = (props) => {
  const [animatedNodes, setAnimatedNodes] = useState([]);
  const [animatedLinks, setAnimatedLinks] = useState([]);
  const [counter, setCounter] = useState(0);
  const [graph, setGraph] = useState({});

  const Get_Devices = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/devicelist/");
      var new_graph = CreateLinks(response);
      setGraph(() => new_graph);
    } catch (err) {
      console.log(err);
    }
  };

  const Scan_Devices = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/devicescan/");
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const timer = () => {
    setCounter(counter + 1);
    console.log(counter);
    console.log("Polling...");
    if (counter == 60) {
      // runs every 10 minutes
      console.log("getting devices");
      Scan_Devices();
      Get_Devices();
      setCounter(0);
    }
  };
  useInterval(timer, 10000);

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
      <g>
        {animatedNodes.map((node) => (
          <text x={node.x - 45} y={node.y - 35} key={uuidv4()}>
            {node.ip}
          </text>
        ))}
      </g>
    </Fragment>
  );
};

const nodeClicked = (node) => {
  console.log(node);
};

export default ForceGraph;
