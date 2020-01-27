const dgram = require('dgram');
const server = dgram.createSocket('udp4');
server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  msg = JSON.parse(msg);
  if(msg.type=="multi") {
    console.log(msg)
    msg.data.forEach(x=> handleMessage(x, rinfo));
  } else {
    handleMessage(msg, rinfo);
  }
});

function handleMessage(msg, rinfo) {
  sendToPager(msg);
  msg.server_name = msg.server_name||rinfo.address;
  msg.command_name = msg.command_name||msg.type;
  msg.received_at = new Date();
  key_values[(msg.server_name)+"->"+(msg.command_name)] = msg;
  console.log(`from ${rinfo.address}:${rinfo.port}`);
}

var cloudwatchMetrics = require('cloudwatch-metrics');
cloudwatchMetrics.initialize({region:"eu-central-1"})
var myMetric = new cloudwatchMetrics.Metric('RedisCount', 'Count', [], {sendCallback: (err)=> console.error(err)});

function sendToPager(msg){
  if(msg.formatter === "item_length"||msg.formatter==="count") {
    let value = msg.data === undefined ? msg.value*1 : msg.data*1;
    myMetric.put(value, msg.command_name, [{Name: 'Region', Value: 'EU'}, {Name: 'Sever', Value: 'Redis'}]);
  }
}

let key_values = {};

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);

exports.stored_data =   key_values;