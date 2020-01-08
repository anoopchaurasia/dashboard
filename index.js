require("dotenv").config()
let stored_data = require("./src/udp").stored_data;
const express = require("express");
const app = express();

//initialize the WebSocket server instance



app.get('/data', function(req, res){
  res.json(stored_data);
})

app.delete('/delete_data', function(req, res){
    console.log(req.query.key, stored_data[req.query.key]);
    delete stored_data[req.query.key];
    res.json(stored_data);
})

app.delete('/clean_all', function(req, res){
  for(let i in stored_data) {
    delete stored_data[i];
  }
  res.json(stored_data);
})

app.use(express.static('public'));
app.listen("8080", "localhost");