let stored_data = require("./src/udp").stored_data;
const express = require("express");
const app = express();
let server = require("http").createServer(app);
let ws = require("ws");

//initialize the WebSocket server instance
const wss = new ws.Server({ server });

wss.on('connection', (ws) => {
    ws.send(JSON.stringify(stored_data));
});

app.get('/data', function(req, res){
  res.json(stored_data);
})
app.use(express.static('public'));
app.listen("8080", "0.0.0.0");