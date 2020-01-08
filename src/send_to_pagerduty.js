let https = require('https');
console.log(process.env.PAGER_INCIDENT_KEY, process.env.PAGER_SERVICE_KEY)
function sendAnalytics(params) {
  let key = params.name.split("_").join(" ");
  console.error("sending data to pager", key, params.body);
  let incident = {
    "incident": {
      "type": "incident",
      "title": `count has exceeded limit for ${key} ssdsd`,
      "service": {
        "id": process.env.PAGER_SERVICE_KEY,
        "type": "service_reference"
      },
      "urgency": "high",
      "incident_key": process.env.PAGER_INCIDENT_KEY,
      "body": {
        "type": "incident_body",
        "details": `redis is not in good condition.${key} ${params.body}`
      },
      "priority": {
        "id": "P53ZZH5",
        "type": "priority_reference"
      },

    }
  } 

  var options = {
    method: "POST",
    hostname:"api.pagerduty.com",
    path: "/incidents",
    headers:{
      "Content-Type": "application/json",
      "Accept": "application/vnd.pagerduty+json;version=2",
      "From": "anoop@vumonic.com",
      "Authorization": "Token token=yGjbQzEKso3bXj6xpAyX"
    }
  }
    
  let req = https.request(options, (res) => {
      console.log('statusCode:', res.statusCode);
      res.on('data', (d) => {
        console.log(d.toString());
      })
  })
    req.write(JSON.stringify(incident));
    req.on('error', x=> console.error(x));
    req.end();
}
exports.send = sendAnalytics;