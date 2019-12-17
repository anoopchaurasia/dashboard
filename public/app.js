function showdata(data){
    data = JSON.parse(JSON.stringify(data).replace(/\\r/gim, "").replace(/\\n/gim, "\\n"))
    let table = `<div class="table">`
    for(let k in data) {
        table += template1(data[k]);
    }
    table += "</div>"
    document.getElementById("container").innerHTML = table;
}
setInterval(x=>{
    fetch("/data").then(x=>x.json()).then(showdata);    
}, 1*60*1000)
fetch("/data").then(x=>x.json()).then(showdata);