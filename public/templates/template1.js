function template1(data){
    if(data.server_name===data.command_name) return ""
    return `<div style="float:left; margin: 10px" class="template1">
        <table>
            <tr><th>Server Name</th><td>${data.server_name}</td> </tr>
            <tr><th>Command</th><td>${data.command_name}</td> </tr>
            <tr><th>Received At</th><td>${getTime(data.received_at)}</td></tr>
        </table>
        ${dataFormatter(data)}
    </div>`
}

function dataFormatter(data) {
    switch(data.formatter) {
        case 'redis_memory':
            return redisMemory(data.data);
        default:
            if(typeof data.data ==='string' && data.data.match(/# Memory/gim)) return redisMemory(data.data);
            return data.data;
    }
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