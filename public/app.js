function showdata(data){
    data = JSON.parse(JSON.stringify(data).replace(/\\r/gim, "").replace(/\\n/gim, "\\n"))
    let table = `<div class="table">`
    for(let k in data) {
        table + template1(data[k]);
    }
    table += "</div>"
    document.getElementById("container").innerHTML = table;
}
fetch("/data").then(x=>x.json()).then(showdata);