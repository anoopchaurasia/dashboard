function template1(data){
    return `<div style="float:left; margin: 10px" class="template1">
        <table>
            <tr>
                <th>Server Name</th><td>${data.server_name}</td>
                <th>Command</th><td>${data.command_name}</td>
                <th>Received At</th><td>${getTime(data.received_at)}</td>
            </tr>
        </table>
        ${JSON.stringify(data)}
    </div>`
}

function getTime(date){
    date = new Date(date);
    let diff = Date.now() = date.now();
    let mili = diff%1000;
    diff = diff%1000;
    let seconds = diff%60;
    diff = diff%60;
    let minute = diff%60;
    diff = diff%60;
    let hours = diff%24||"00";
    return hours +":"+minute+":"+seconds;
}