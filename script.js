d3.json("data.json").then(data => {
  // Transformar materias a nodos y links
  const nodes = data.materias.map(m => ({ id: m.codigo, nombre: m.nombre }));
  const links = [];
  data.materias.forEach(m => {
    m.correlativas.forEach(correlativa => {
      links.push({ source: correlativa, target: m.codigo });
    });
  });

  // Resto de tu código igual:
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(120))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", 2);

  const node = svg.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("g")
    .data(nodes)
    .join("g")
    .call(drag(simulation));

  node.append("circle")
    .attr("r", 20)
    .attr("fill", "#1f77b4");

  node.append("text")
    .text(d => d.nombre) // Mostrar nombre en lugar del código
    .attr("x", 0)
    .attr("y", 5)
    .attr("text-anchor", "middle")
    .attr("fill", "#fff");

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("transform", d => `translate(${d.x},${d.y})`);
  });
});
