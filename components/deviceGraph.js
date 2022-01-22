import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

// Update the data inside the useEffect method
var graph = {
  nodes: [
    { ip: "192.168.2.12" },
    { ip: "192.168.2.16" },
    { ip: "192.168.2.17" },
    { ip: "192.168.2.30" },
    { ip: "192.168.2.32" },
    { ip: "192.168.2.116" },
    { ip: "192.168.2.188" },
    { ip: "192.168.2.206" },
    { ip: "192.168.2.236" },
    { ip: "192.168.2.238" },
    { ip: "192.168.2.239" },
    { ip: "192.168.2.246" },
  ],
  links: [{ source: "192.168.2.1" }],
};

const Circle = () => {
  const ref = useRef();
  useEffect(() => {
    const svgElement = d3.select(ref.current);
    //svgElement.append("circle").attr("cx", 150).attr("cy", 70).attr("r", 50);
    svgElement
      .selectAll("div")
      .data(graph.nodes)
      .enter()
      .append("div")
      .text((d) => d.ip);
  }, []);
  return <svg ref={ref} />;
};

export default Circle;
