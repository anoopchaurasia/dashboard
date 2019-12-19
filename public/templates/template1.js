function template1(data, key1){
    if(data.server_name===data.command_name) return ""
    let time = getTime(data.received_at);
    return `<div style="float:left; margin: 10px; border-color: ${time>"00:04:00"?'red':'#dfe341'};" class="template1">
    <div id="${key1}" class="delete">X</div>
        <table>
            <tr><th>Server Name</th><td>${data.server_name}</td> </tr>
            <tr><th>Command</th><td>${data.command_name}</td> </tr>
            <tr><th>Received At</th><td>${time}</td></tr>
        </table>
        ${dataFormatter(data)}
    </div>`
}

function dataFormatter(data) {
    switch(data.formatter) {
        case 'redis_memory':
            return redisMemory(data.data);
        case 'item_length':{
            return "List Count: "+ data.data;
        }
        case 'pm2_log':
        case 'table':{
            return "<pre> "+ data.data +"</pre>";
        }
        case 'ec2metadata':{
            return ec2metadata(data.data)
        }
        default:
            if(typeof data.data ==='string' && data.data.match(/# Memory/gim)) return redisMemory(data.data);
            return data.data;
    }
}

let list = [
    "instance-type",
    "public-ipv4",
    "security-groups",
    "ami-id", 
    "instance-id",
]

function ec2metadata(data) {
    return "<table>"+ data.map(x=>x.split(":")).filter(x=> list.includes(x[0].trim())).map(x=> `<tr><th>${x.join("</th><td>")}</td></tr>`).join("") + "</table>"
}

function redisMemory(data) {
    return data.split("\n").filter(x=>x.match(/human/)).join("<br>")
}

function getTime(date){
    date = new Date(date);
    let diff = Date.now() - date.getTime();
    diff = diff/1000;
    let seconds = parseInt(diff%60);
    diff = diff/60;
    let minute = parseInt(diff%60);
    diff = diff/60;
    let hours = parseInt(diff%24)||"00";
    return two(hours) +":"+two(minute)+":"+two(seconds);
}

function two(str){
    return ("000"+str).slice(-2);
}