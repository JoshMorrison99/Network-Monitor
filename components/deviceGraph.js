import React, { useRef, useEffect, useState, Fragment } from "react";
import * as d3 from "d3";
var graph = require("../user_information/devices.json");

console.log(graph);

// Update the data inside the useEffect metho
// const graph = {
//   nodes: [
//     { ip: "192.168.2.1" },
//     { ip: "192.168.2.12" },
//     { ip: "192.168.2.16" },
//     { ip: "192.168.2.17" },
//     { ip: "192.168.2.30" },
//     { ip: "192.168.2.32" },
//     { ip: "192.168.2.116" },
//     { ip: "192.168.2.188" },
//     { ip: "192.168.2.206" },
//     { ip: "192.168.2.236" },
//     { ip: "192.168.2.238" },
//     { ip: "192.168.2.239" },
//     { ip: "192.168.2.246" },
//   ],
//   links: [
//     { source: "192.168.2.1", target: "192.168.2.12" },
//     { source: "192.168.2.1", target: "192.168.2.16" },
//     { source: "192.168.2.1", target: "192.168.2.17" },
//     { source: "192.168.2.1", target: "192.168.2.30" },
//     { source: "192.168.2.1", target: "192.168.2.32" },
//     { source: "192.168.2.1", target: "192.168.2.116" },
//     { source: "192.168.2.1", target: "192.168.2.188" },
//     { source: "192.168.2.1", target: "192.168.2.206" },
//     { source: "192.168.2.1", target: "192.168.2.236" },
//     { source: "192.168.2.1", target: "192.168.2.238" },
//     { source: "192.168.2.1", target: "192.168.2.239" },
//     { source: "192.168.2.1", target: "192.168.2.246" },
//   ],
// };

const ForceGraph = (props) => {
  const [animatedNodes, setAnimatedNodes] = useState([]);
  const [animatedLinks, setAnimatedLinks] = useState([]);
  const [counter, setCounter] = useState(0);

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
  }, []);
  return (
    <Fragment>
      <g>
        {animatedNodes.map((node) => (
          <circle
            cx={node.x}
            cy={node.y}
            r={30}
            stroke="black"
            fill="black"
            onClick={() => nodeClicked(node.ip)}
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
            stroke="black"
            stroke-width={0.5}
          />
        ))}
      </g>
      <g>
        {animatedNodes.map((node) => (
          <text x={node.x - 45} y={node.y - 35}>
            {node.ip}
          </text>
        ))}
      </g>
    </Fragment>
  );
};

const nodeClicked = (nodeIP) => {
  console.log(nodeIP + " node clicked");
};

export default ForceGraph;
