require("dotenv").config()
const express = require("express");
const app = express();

//initialize the WebSocket server instance
const client = require('prom-client');
const register = new client.Registry();
let all, {stored_data} = require("./src/udp").stored_data;


all.register_gauge = function(gauge) {
  register.registerMetric(gauge);
};

app.get('/data', function(req, res){
  res.json(stored_data);
})

app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});

app.delete('/delete_data', function(req, res){
    console.log(req.query.key, stored_data[req.query.key]);
    delete stored_data[req.query.key];
    res.json(stored_data);
});

app.delete('/clean_all', function(req, res){
  for(let i in stored_data) {
    delete stored_data[i];
  }
  res.json(stored_data);
})

app.use(express.static('public'));
app.listen("8080", "localhost");