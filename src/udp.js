const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const ga = require("./send_to_ga");
server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  msg = JSON.parse(msg);
  if(msg.type=="ga") {
    return ga.send(msg);
  }
  msg.received_at = new Date();
  key_values[msg.server_name+"->"+msg.command_name] = msg;
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

let key_values = {};

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);

exports.stored_data =   key_values;