function showdata(data){
    data = JSON.parse(JSON.stringify(data).replace(/\\r/gim, "").replace(/\\n/gim, "\\n"))
    let table = `<div class="table">`
    let keys = Object.keys(data);
    keys.sort((a,b)=>{
        if(a<b) return -1;
        if(a>b) return 1;
        return 0
    });
    let current_key = "";
    keys.forEach(x=>{
        let d = data[x];
        if(d.server_name!==current_key) {
            table +="<hr style='width:100%'/>"
        }
        current_key= d.server_name;
        table += template1(data[x], x)
    })
    table += "</div>"
    document.getElementById("container").innerHTML = table;
}

function deleteData(id) {
    return fetch("/delete_data?key="+id, {
        method:"delete",
    }).then(x=> x.json()).then(showdata)
}

function deleteAll() {
    return fetch("/clean_all", {
        method:"delete",
    }).then(x=> x.json()).then(showdata)
}

document.getElementById("container").onclick = function(y)  {
    if(y.target.className=="delete") {
        deleteData(y.target.id)
    }
}


document.getElementById("delete_all").onclick = deleteAll;

setInterval(x=>{
    document.getElementById("refresh_counter").innerHTML = "refreshed "+ ((Date.now()-refreshed_at)/1000) +"s ago";
}, 1000)

let refreshed_at = Date.now(); 
setInterval(x=>{
    refreshed_at = Date.now();
    fetch("/data").then(x=>x.json()).then(showdata);    
}, 1*60*1000)
fetch("/data").then(x=>x.json()).then(showdata);