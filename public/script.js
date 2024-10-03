const messagesDiv = document.getElementById('messages');
const container = document.getElementById('sigma-container');
const graph = new graphology.Graph();
var addToGraph = false;
const toggleSwitch = document.getElementById('toggleSwitch');
const statusText = document.getElementById('status');

toggleSwitch.addEventListener('change', function () {
    addToGraph = toggleSwitch.checked;
    statusText.innerText = `Add to Graph is ${addToGraph ? 'ON' : 'OFF'}`;
});

function addMessage(role, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = role;
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
    const queryInput = document.getElementById('query');
    const query = queryInput.value.trim();
    if (!query) return;

    addMessage('user', 'You: ' + query);
    queryInput.value = '';

    try {
        const response = await fetch('/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, addToGraph }),
        });
        const data = await response.json();
        const botResponse = data.response || 'Error fetching response';

        addMessage('bot', 'Bot: ' + botResponse);
    } catch (error) {
        console.error('Error:', error);
        addMessage('bot', 'Bot: Error occurred while fetching response.');
    }
    fetchGraphData();
}

// Fetch existing graph data from backend and visualize it
async function fetchGraphData() {
    const response = await fetch('/graph');
    const { graph: graphData } = await response.json();
    console.log(graphData)

    graphData.nodes.forEach(node => {
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        graph.addNode(node.properties.name, { label: node.properties.name, x: randomX, y: randomY, size: 20});
    });
    graphData.relationships.forEach(rel => {
        graph.addEdge(rel.source, rel.target, { label: rel.relationships, size: 5, type: 'arrow' });
    });
    const sigmaInstance = new Sigma(graph, container);
}
  
// Fetch initial graph data on page load
fetchGraphData();
