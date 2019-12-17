function showdata(data){
    data = JSON.parse(JSON.stringify(data).replace(/\\r/gim, "").replace(/\\n/gim, "\\n"))
    let table = `<div class="table">`
    let keys = Object.keys(data);
    keys.sort((a,b)=>{
        if(a>b) return -1;
        if(a<b) return 1;
        return 0
    });
    keys.forEach(x=>{
        table += template1(x);
    })
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