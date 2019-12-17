function showdata(data){
    data = JSON.parse(JSON.stringify(data).replace(/\\r/gim, "").replace(/\\n/gim, "\\n"))
    let table = `<div class="table">`
    table += "<div id='refresh_counter></div>"
    for(let k in data) {
        table += template1(data[k]);
    }
    table += "</div>"
    document.getElementById("container").innerHTML = table;
}

setInterval(x=>{
    document.getElementById("refresh_counter").innerHTML = "refreshed "+ ((Date.now()-refreshed_at)/1000) +"s ago";
}, 1000)

let refreshed_at = Date.now(); 
setInterval(x=>{
    refreshed_at = Date.now();
    fetch("/data").then(x=>x.json()).then(showdata);    
}, 1*60*1000)
fetch("/data").then(x=>x.json()).then(showdata);