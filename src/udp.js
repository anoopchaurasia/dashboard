const dgram = require('dgram');
const server = dgram.createSocket('udp4');
server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

let registers_list=[];
const client = require('prom-client');
const gauge = new client.Gauge({
  name: "node_my_gauge",
  help: "This is my gauge"
});
registers_list.push(gauge);

server.on('message', (msg, rinfo) => {
  msg = JSON.parse(msg);
  if(msg.type=="multi") {

    msg.data.filter(x=> x.formatter !=="count").forEach(x=> handleMessage(x, rinfo));
    let counter =  msg.data.filter(x=> x.formatter==="count");
    if(counter.length===0) return;
    counter[0].value = counter.map(x=>x.value).reduce((a,b)=> a+b, 0);
    handleMessage(counter[0], rinfo)

  } else {
    handleMessage(msg, rinfo);
  }
});

function handleMessage(msg, rinfo) {
  msg.command_name = msg.command_name||msg.type;
  msg.received_at = new Date();
  key_values[(msg.server_name)+"->"+(msg.command_name)] = msg;
  msg.server_name = msg.server_name||rinfo.address;
  sendToPager(msg);
  if(msg.command_name==="new_email") {
    gauge.set(msg.value||msg.data);
  }
  console.log(`from ${rinfo.address}:${rinfo.port}`);
}

var cloudwatchMetrics = require('cloudwatch-metrics');
cloudwatchMetrics.initialize({region:"eu-central-1"})
var myMetric = new cloudwatchMetrics.Metric('RedisCount', 'Count', [], {
  sendCallback: (err)=> err && console.error(err),
  sendInterval: 30*1000,
  summaryInterval: 60*1000

});

function sendToPager(msg){
  if(msg.formatter === "item_length"||msg.formatter==="count") {
    let value = msg.data === undefined ? msg.value*1 : msg.data*1;
    myMetric.put(value, msg.command_name, [{Name: 'Region', Value: 'EU'}, {Name: 'Sever', Value: 'Redis'}]);
  }
  if(msg.formatter==="value") {
    myMetric.put(msg.value, msg.type, [{Name: 'Region', Value: 'EU'}, {Name: 'Sever', Value: 'Redis'}]);
  }
}

let key_values = {};

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);

exports.stored_data =   {key_values, registers_list};