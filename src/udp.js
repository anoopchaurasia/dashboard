const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const pager = require("./send_to_pagerduty");
server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  msg = JSON.parse(msg);
  sendToPager(msg);
  msg.received_at = new Date();
  key_values[msg.server_name+"->"+msg.command_name] = msg;
  console.log(`from ${rinfo.address}:${rinfo.port}`);
});

var cloudwatchMetrics = require('cloudwatch-metrics');
cloudwatchMetrics.initialize({region:"eu-central-1"})
var myMetric = new cloudwatchMetrics.Metric('namespace', 'Count', [], {sendCallback: (err)=> console.error(err)});

function sendToPager(msg){
  if(msg.formatter === "item_length") {
    myMetric.put(msg.data*1, msg.command_name, [{Name: 'Region', Value: 'EU'}, {Name: 'Sever', Value: 'Redis'}]);
    switch(msg.command_name) {
      case "db_user_actions": {
        msg.data > 100 && pager.send({name: msg.command_name, body: " exceeds more than 100"});
        break;
      }
      case "email_update_for_user":{
        msg.data > 2000 && pager.send({name: msg.command_name, body: " exceeds more than 2000"});
        break;
      }

      case "imap_user_actions": { 
        msg.data > 500 && pager.send({name: msg.command_name, body: " exceeds more than 500"});
        break;
      }

      case "process_user_login": {
        msg.data > 10 && pager.send({name: msg.command_name, body: " exceeds more than 10"});
        break;
      }

      case "qc_scan_user_boxes": {
        msg.data > 10 && pager.send({name: msg.command_name, body: " exceeds more than 10"});
        break;
      }

      case "raw_email_data": {
        msg.data > 1000 && pager.send({name: msg.command_name, body: " exceeds more than 1000"});
        break;
      }

      case "new_data_avail": {
        msg.data > 1000 && pager.send({name: msg.command_name, body: " exceeds more than 1000"});
        break;
      }
    }
  }
}

let key_values = {};

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);

exports.stored_data =   key_values;