document.getElementById('dijkstra-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nodesInput = document.getElementById('nodes').value;
    const edgesInput = document.getElementById('edges').value;
    const startNode = document.getElementById('startNode').value;
    const results = document.getElementById('results');

    const graph = { Nodes: {} };
    const nodesArray = nodesInput.split(',').map(node => node.trim());
    const edgesArray = edgesInput.split(';').map(edge => edge.trim());

    nodesArray.forEach(node => {
        graph.Nodes[node] = {};
    });

    edgesArray.forEach(edge => {
        const [fromNode, toNode, weight] = edge.split(',').map(e => e.trim());
        if (graph.Nodes[fromNode] && toNode && weight) {
            graph.Nodes[fromNode][toNode] = parseInt(weight);
        }
    });

    try {
        const response = await fetch(`http://localhost:5077/dijkstra/calculate?startNode=${startNode}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(graph)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        results.textContent = JSON.stringify(data, null, 2);

        visualizeGraph(graph, startNode, data);
    } catch (error) {
        results.textContent = `Error: ${error.message}`;
    }
});

function visualizeGraph(graph, startNode, results) {
    const nodes = Object.keys(graph.Nodes);
    const links = [];

    nodes.forEach(node => {
        for (let neighbor in graph.Nodes[node]) {
            links.push({ source: node, target: neighbor, value: graph.Nodes[node][neighbor] });
        }
    });

    const svg = d3.select("#graph-container").html("").append("svg")
        .attr("width", 600)
        .attr("height", 400);

    const nodeRadius = 20;
    const nodePositions = {};

    // Распределяем узлы на плоскости
    nodes.forEach((node, i) => {
        const angle = (i / nodes.length) * 2 * Math.PI;
        const x = 300 + 200 * Math.cos(angle);
        const y = 200 + 200 * Math.sin(angle);
        nodePositions[node] = { x, y };
    });

    // Добавляем ребра
    svg.selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("x1", d => nodePositions[d.source].x)
        .attr("y1", d => nodePositions[d.source].y)
        .attr("x2", d => nodePositions[d.target].x)
        .attr("y2", d => nodePositions[d.target].y)
        .attr("stroke-width", 2)
        .attr("stroke", "#999");

    // Добавляем узлы
    const node = svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("cx", d => nodePositions[d].x)
        .attr("cy", d => nodePositions[d].y)
        .attr("r", nodeRadius)
        .attr("fill", d => d === startNode ? "red" : "blue");

    // Добавляем подписи к узлам
    svg.selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("x", d => nodePositions[d].x)
        .attr("y", d => nodePositions[d].y)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(d => d);
}
