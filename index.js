let stored_data = require("./src/udp").stored_data;
const express = require("express");
const app = express();
app.get('/data', function(req, res){
  res.json(stored_data);
})
app.use(express.static('public'));
app.listen("8080", "0.0.0.0");